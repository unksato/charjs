namespace Charjs {
    export interface Clazz<T> {
        new (...args: any[]): T;
    }

    export class ClassUtil {
        static getClass<T>(className: string): Clazz<T> {
            const g = window;
            const p = className.split(".");
            let c = g;
            if (p.length >= 0) {
                for (let i of p) {
                    if (typeof c[i] === "undefined") {
                        throw ReferenceError(`No such a reachable reference scope "${i}". `);
                    } else {
                        c = c[i];
                    }
                }
            }

            if (this.isClassLike<T>(c, className)) {
                return <any>c;
            } else {
                throw TypeError(`${className} is not a Class.`)
            }
        }

        private static isClassLike<T>(classLike: any, className: string): classLike is T {
            const cnl = className.split(".");
            return (typeof classLike === "function")
                && (typeof classLike.prototype !== "undefined")
                && (classLike.name === cnl[cnl.length - 1]);
        }
    }
}
