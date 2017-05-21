/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../src/util/deferred.ts" />
/// <reference path="../../src/util/promise.ts" />

class Sample {
    success(timeout: number): MyQ.Promise<string> {
        var q = MyQ.Deferred.defer<string>();
        setTimeout(() => {
            var obj = 'success';
            q.resolve(obj);
        }, timeout);
        return q.promise;
    }
    error(timeout: number): MyQ.Promise<string> {
        var q = MyQ.Deferred.defer<string>();
        setTimeout(() => {
            q.reject("error has occured.");
        }, timeout);
        return q.promise;
    }
}

const expect = chai.expect;
const assert = chai.assert;

describe('Util.Promise', () => {
    it('simple resolved test', (done) => {
        let firstActualVal = null;
        let secondActualVal = null;

        new Sample().success(0).then((val) => {
            firstActualVal = val;
            return val + ':' + val;
        }).then((val) => {
            secondActualVal = val;
        }).catch((e) => {
            done(e);
        }).finally(() => {
            expect(firstActualVal).equal('success');
            expect(secondActualVal).equal('success:success');
            done();
        });
    });

    it('simple reject test', (done) => {
        let catchVal = null;
        new Sample().error(0).then(() => {
        }).catch((e) => {
            catchVal = e;
        }).finally(() => {
            expect(catchVal).equal('error has occured.');
            done();
        });
    });

    it('error throw in then func test', (done) => {
        let catchVal = null;
        new Sample().success(0).then(() => {
            throw new Error('unknown error');
        }).catch((e) => {
            catchVal = e;
        }).finally(() => {
            expect(catchVal).instanceof(Error);
            expect(catchVal.message).equal('unknown error');
            done();
        });
    });

    it('when test', (done) => {
        let isSuccess = false;
        MyQ.Promise.when().then(() => {
            isSuccess = true;
        }).finally(() => {
            assert.isOk(isSuccess);
            done();
        });
    });

    it('all success test', (done) => {
        let p1 = new Sample().success(0);
        let p2 = new Sample().success(10);
        let result = null;

        MyQ.Promise.all([p1, p2]).then((val) => {
            result = val;
        }).finally(() => {
            expect(result).deep.equal(['success', 'success']);
            done();
        })
    });

    it('all fail test', (done) => {
        let p1 = new Sample().success(0);
        let p2 = new Sample().error(10);
        let result = null;

        MyQ.Promise.all([p1, p2]).then((val) => {
            result = null;
        }).catch((e) => {
            result = e;
        }).finally(() => {
            expect(result).equal("error has occured.");
            done();
        });
    });

    it('allSettled test', (done) => {
        let p1 = new Sample().success(0);
        let p2 = new Sample().error(10);
        let p3 = new Sample().success(200);
        let result = null;
        MyQ.Promise.allSettled([p1, p2, p3]).then((val) => {
            result = val;
        }).finally(() => {
            expect(result).deep.equal([
                { state: 'fulfilled', value: 'success' },
                { state: 'rejected', reason: 'error has occured.' },
                { state: 'fulfilled', value: 'success' }]);
            done();
        });
    });

    it('race resolve case test', (done) => {
        let p1 = new Sample().success(10);
        let p2 = new Sample().error(100);
        let result = null;
        MyQ.Promise.race([p1, p2]).then((val) => {
            result = val;
        }).catch((e) => {
            result = e;
        }).finally(() => {
            expect(result).equal('success');
            done();
        });
    });

    it('race reject case test', (done) => {
        let p1 = new Sample().success(100);
        let p2 = new Sample().error(10);
        let result = null;
        MyQ.Promise.race([p1, p2]).then((val) => {
            result = val;
        }).catch((e) => {
            result = e;
        }).finally(() => {
            expect(result).equal('error has occured.');
            done();
        });
    });

    it('reduce test', (done) => {
        let datas = [
            { timeout: 10, message: 'Hello' },
            { timeout: 700, message: 'Promise' },
            { timeout: 50, message: 'World' },
            { timeout: 100, message: '!!!' }
        ];

        let result = null;
        let message = '';

        let f = (d: MyQ.Deferred<{}>, value: { timeout: number, message: string }) => {
            setTimeout(() => {
                message += value.message + " ";
                d.resolve(value.message);
            }, value.timeout);
        }

        MyQ.Promise.reduce(datas, f).then((val) => {
            result = val;
        }).catch((e) => {
            console.log(e);
        }).finally(() => {
            expect(result).equal('!!!');
            expect(message).equal('Hello Promise World !!! ');
            done();
        });
    });

})