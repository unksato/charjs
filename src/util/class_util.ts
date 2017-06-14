namespace Charjs {
    export interface Clazz<T> {
        new (...args: any[]): T;
    }

    export class ClassUtil {
        static getClass<T>(className: string, nameSpace?: any): Clazz<T> {
            const p = className.split(".");
            let c = nameSpace || window;
            if (p.length >= 0) {
                for (let i of p) {
                    if (typeof c[i] === "undefined") {
                        throw ReferenceError(`No such a reachable reference scope "${i}". `);
                    } else {
                        c = c[i];
                    }
                }
            }

            if (this.isClass<T>(c, className)) {
                return <any>c;
            } else {
                throw TypeError(`${className} is not a Class.`)
            }
        }

        private static isClass<T>(obj: any, className: string): boolean {
            const cnl = className.split(".");
            return (typeof obj === "function")
                && (typeof obj.prototype !== "undefined")
                && (obj.name === cnl[cnl.length - 1]);
        }
    }
}
