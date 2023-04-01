/// <reference types="react" />
export type ValueGetter<T = number> = T | ((index: number) => T);
export declare function isFunction(value: any): value is Function;
export declare function isArray<T>(value: T[]): value is T[];
export declare function isArray<T>(value: Array<T>): value is Array<T>;
export declare function isArray<T>(value: T | T[]): value is Array<T>;
export declare function isArray<T>(value: Readonly<T[]>): value is Readonly<T[]>;
export declare function isArray<T>(value: Readonly<Array<T>>): value is Readonly<Array<T>>;
export declare function isArray<T>(value: T | Readonly<T[]>): value is Readonly<Array<T>>;
export declare function isArray(value: unknown): value is Array<unknown>;
export declare function sumColumnWidths(columnWidthGetter: ValueGetter<number>, index: number): number;
export declare function sumRowsHeights<T>(rowHeightGetter: ValueGetter<number>, rows: ReadonlyArray<T>, index: number): number;
export declare function assignRef<T>(refValue: T, ...refs: (React.Ref<T> | undefined)[]): void;
export declare function refSetter<T>(...refs: (React.Ref<T> | undefined)[]): (ref: T) => void;
export declare function mixClassNameSingle(classList1: string, classList2: string | undefined): string;
export declare const hasOwn: (v: PropertyKey) => boolean;
export type ClassNamesValue = string | number | boolean | undefined | null;
export type ClassNamesMapping = Record<string, unknown>;
export type ClassNamesArgument = ClassNamesValue | ClassNamesMapping | ClassNamesArgumentArray;
export interface ClassNamesArgumentArray extends Array<ClassNamesArgument> {
}
export declare function classNames(...args: ClassNamesArgumentArray): string;
//# sourceMappingURL=helpers.d.ts.map