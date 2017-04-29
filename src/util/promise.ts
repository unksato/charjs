namespace MyQ {
    export class Promise<RESULT> {
        constructor() { }

        private _ok: { (result: RESULT) } = null;
        private _ng: { (e: any) } = null;
        private _final: { () } = null;

        private _next: Promise<any> = null;
        private _finallyCalled = false;

        public resolve(arg: RESULT) {
            if (this._ok) {
                try {
                    var ret = this._ok(arg);
                    if (ret instanceof Promise) {
                        ret.then((arg) => {
                            this._next.resolve(arg);
                        }).catch((e) => {
                            this.reject(e);
                        });
                    } else {
                        this._next.resolve(ret);
                    }
                } catch (e) {
                    this.reject(e);
                } finally {
                    this.final();
                }
            }
        }

        public reject(e: any) {
            try {
                if (this._next)
                    this._next.reject(e);
                else if (this._ng)
                    this._ng(e);
            } catch (e) {
                throw e;
            } finally {
                this.final();
            }
        }

        public final() {
            if (this._next) {
                this._next.final();
            } else if (this._final) {
                if (!this._finallyCalled) {
                    this._finallyCalled = true;
                    this._final();
                }
            }
        }

        public then<NEW_RESULT>(func: { (result: RESULT): NEW_RESULT }): Promise<NEW_RESULT> {
            this._ok = func;
            this._next = new Promise<NEW_RESULT>();
            return this._next;
        }

        public catch(func: { (e: any) }): Promise<RESULT> {
            this._ng = func;
            return this;
        }

        public finally(func: { () }): Promise<RESULT> {
            this._final = func;
            return this;
        }

        public static when<T>(arg?: T): Promise<T> {
            let d = Deferred.defer();

            setTimeout(() => {
                d.resolve(arg);
            }, 0);

            return d.promise;
        }

        public static all(Promises: Promise<any>[]): Promise<any[]> {
            var PromiseLength = Promises.length;
            var callbackCount = 0;
            var PromisesArgs = [];
            var allPromise = new Promise<any[]>();

            var resolve = function (index: number) {
                return function (arg) {
                    callbackCount++;
                    PromisesArgs[index] = arg;
                    if (PromiseLength == callbackCount) {
                        allPromise.resolve(PromisesArgs);
                    }
                }
            };
            var reject = function (index: number) {
                return function (e: any) {
                    allPromise.reject(e);
                }
            };

            for (let i = 0; i < Promises.length; i++) {
                Promises[i].then(resolve(i)).catch(reject(i));
            }
            return allPromise;
        }

        public static allSettled(Promises: Promise<any>[]): Promise<any[]> {
            var PromiseLength = Promises.length;
            var callbackCount = 0;
            var results = [];
            var allPromise = new Promise<any[]>();

            var resolve = function (index: number) {
                return function (arg) {
                    callbackCount++;
                    results[index] = { state: 'fulfilled', value: arg };
                    if (PromiseLength == callbackCount) {
                        allPromise.resolve(results);
                    }
                }
            };
            var reject = function (index: number) {
                return function (e: any) {
                    callbackCount++;
                    results[index] = { state: 'rejected', reason: e };
                    if (PromiseLength == callbackCount) {
                        allPromise.resolve(results);
                    }
                }
            };

            for (let i = 0; i < Promises.length; i++) {
                Promises[i].then(resolve(i)).catch(reject(i));
            }
            return allPromise;
        }

        public static race(Promises: Promise<any>[]): Promise<any> {
            var racePromise = new Promise<any>();
            var raceCalled = false;

            var resolve = function (arg) {
                if (!raceCalled) {
                    raceCalled = true;
                    racePromise.resolve(arg);
                }
            };
            var reject = function (e: any) {
                if (!raceCalled) {
                    raceCalled = true;
                    racePromise.reject(e);
                }
            };

            for (let i = 0; i < Promises.length; i++) {
                Promises[i].then(resolve).catch(reject);
            }

            return racePromise;
        }

        public static reduce<T>(values: any[], func: { (defer: MyQ.Deferred<{}>, value: T) }): MyQ.Promise<{}> {
            return values.reduce((prev: MyQ.Promise<{}>, current: T) => {
                return prev.then(() => {
                    let d = MyQ.Deferred.defer();
                    func(d, current);
                    return d.promise;
                });
            }, Promise.when());
        }
    }
}
