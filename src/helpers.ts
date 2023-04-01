export type ValueGetter<T = number> = T | ((index: number) => T);

export function isFunction(value: any): value is Function {
    return typeof value === 'function'
        || (value && {}.toString.call(value) === '[object Function]');
}

export function isArray<T>(value: T[]): value is T[]
export function isArray<T>(value: Array<T>): value is Array<T>
export function isArray<T>(value: T | T[]): value is Array<T>
export function isArray<T>(value: Readonly<T[]>): value is Readonly<T[]>
export function isArray<T>(value: Readonly<Array<T>>): value is Readonly<Array<T>>
export function isArray<T>(value: T | Readonly<T[]>): value is Readonly<Array<T>>
export function isArray(value: unknown): value is Array<unknown>
export function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
}

export function sumColumnWidths(columnWidthGetter: ValueGetter<number>, index: number) {

    if (index < 0) {
        return 0;
    }

    if(isFunction(columnWidthGetter)) {
        let sum = 0;
        while (index-- > 0) {
            sum += columnWidthGetter(index);
        }
        return sum;
    }

    return columnWidthGetter + (index * columnWidthGetter);
}


export function sumRowsHeights<T>(rowHeightGetter: ValueGetter<number>, rows: ReadonlyArray<T>, index: number) {

    if (index < 0) {
        return 0;
    }

    if(isFunction(rowHeightGetter)) {

        let sum = 0;
        
        for(; index > -1; index--) {
            sum += rowHeightGetter(index);
        }

        return sum;
    }
    
    return index * rowHeightGetter;
}

export function assignRef<T>(refValue: T, ...refs: (React.Ref<T> | undefined)[]) {

    for(let i = 0; i < refs.length; i++) {

        const tmpRef = refs[i];

        if(typeof tmpRef === 'function') { tmpRef(refValue); }
        if(typeof tmpRef === 'object')   { (tmpRef as unknown as React.MutableRefObject<T>).current = refValue; }
    }
}

export function refSetter<T>(...refs: (React.Ref<T> | undefined)[]) {
    return (ref: T) => assignRef(ref, ...refs);
}

export function mixClassNameSingle(classList1: string, classList2: string | undefined) {
    return classList1 + (classList2 ? " " + classList2 : '');
}

export const hasOwn = {}.hasOwnProperty;

export type ClassNamesValue = string | number | boolean | undefined | null;
export type ClassNamesMapping = Record<string, unknown>;
export type ClassNamesArgument = ClassNamesValue | ClassNamesMapping | ClassNamesArgumentArray;
export interface ClassNamesArgumentArray extends Array<ClassNamesArgument> {}

export function classNames(...args: ClassNamesArgumentArray) {

    const classes: string[] = [];

    for (let i = 0; i < arguments.length; i++) {

        const arg = arguments[i];

        if (!arg) continue;

        const argType = typeof arg;

        if (argType === 'string' || argType === 'number') {

            classes.push(arg);

        } else if (Array.isArray(arg)) {

            if (arg.length) {

                const inner = classNames.apply(null, arg);

                if (inner) {
                    classes.push(inner);
                }
            }

        } else if (argType === 'object') {

            if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {

                classes.push(arg.toString());
                continue;
            }

            for (var key in arg) {

                if (hasOwn.call(arg, key) && arg[key]) {

                    classes.push(key);
                }
            }
        }
    }

    return classes.join(' ');
}