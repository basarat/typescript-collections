export declare const has: (obj: any, prop: any) => any;
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
export declare function defaultCompare<T>(a: T, b: T): number;
/**
 * Default function to test equality.
 * @function
 */
export declare function defaultEquals<T>(a: T, b: T): boolean;
/**
 * Default function to convert an object to a string.
 * @function
 */
export declare function defaultToString(item: any): string;
/**
 * Joins all the properies of the object using the provided join string
 */
export declare function makeString<T>(item: T, join?: string): string;
/**
 * Checks if the given argument is a function.
 * @function
 */
export declare function isFunction(func: any): boolean;
/**
 * Checks if the given argument is undefined.
 * @function
 */
export declare function isUndefined(obj: any): obj is undefined;
/**
 * Checks if the given argument is a string.
 * @function
 */
export declare function isString(obj: any): boolean;
/**
 * Reverses a compare function.
 * @function
 */
export declare function reverseCompareFunction<T>(compareFunction?: ICompareFunction<T>): ICompareFunction<T>;
/**
 * Returns an equal function given a compare function.
 * @function
 */
export declare function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T>;
