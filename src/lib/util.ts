const _hasOwnProperty = Object.prototype.hasOwnProperty;
export const has = function(obj: any, prop: any) {
    return _hasOwnProperty.call(obj, prop);
};

/**
 * Function signature for comparing
 * <0 means a is smaller
 * = 0 means they are equal
 * >0 means a is larger
 */
export interface ICompareFunction<T> {
    (a: T, b: T): number;
}

/**
 * Function signature for checking equality
 */
export interface IEqualsFunction<T> {
    (a: T, b: T): boolean;
}

/**
 * Function signature for Iterations. Return false to break from loop
 */
export interface ILoopFunction<T> {
    (a: T): boolean | void;
}

/**
 * Default function to compare element order.
 * @function
 */
export function defaultCompare<T>(a: T, b: T): number {
    if (a < b) {
        return -1;
    } else if (a === b) {
        return 0;
    } else {
        return 1;
    }
}

/**
 * Default function to test equality.
 * @function
 */
export function defaultEquals<T>(a: T, b: T): boolean {
    return a === b;
}

/**
 * Default function to convert an object to a string.
 * @function
 */
export function defaultToString(item: any): string {
    if (item === null) {
        return 'COLLECTION_NULL';
    } else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
    } else if (isString(item)) {
        return '$s' + item;
    } else {
        return '$o' + item.toString();
    }
}

/**
 * Joins all the properies of the object using the provided join string
 */
export function makeString<T>(item: T, join: string = ','): string {
    if (item === null) {
        return 'COLLECTION_NULL';
    } else if (isUndefined(item)) {
        return 'COLLECTION_UNDEFINED';
    } else if (isString(item)) {
        return item.toString();
    } else {
        let toret = '{';
        let first = true;
        for (const prop in item) {
            if (has(item, prop)) {
                if (first) {
                    first = false;
                } else {
                    toret = toret + join;
                }
                toret = toret + prop + ':' + (<any>item)[prop];
            }
        }
        return toret + '}';
    }
}

/**
 * Checks if the given argument is a function.
 * @function
 */
export function isFunction(func: any): boolean {
    return (typeof func) === 'function';
}

/**
 * Checks if the given argument is undefined.
 * @function
 */
export function isUndefined(obj: any): obj is undefined {
    return (typeof obj) === 'undefined';
}

/**
 * Checks if the given argument is a string.
 * @function
 */
export function isString(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object String]';
}

/**
 * Reverses a compare function.
 * @function
 */
export function reverseCompareFunction<T>(compareFunction?: ICompareFunction<T>): ICompareFunction<T> {
    if (isUndefined(compareFunction) || !isFunction(compareFunction)) {
        return function(a, b) {
            if (a < b) {
                return 1;
            } else if (a === b) {
                return 0;
            } else {
                return -1;
            }
        };
    } else {
        return function(d: T, v: T) {
            return compareFunction(d, v) * -1;
        };
    }
}

/**
 * Returns an equal function given a compare function.
 * @function
 */
export function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T> {
    return function(a: T, b: T) {
        return compareFunction(a, b) === 0;
    };
}
