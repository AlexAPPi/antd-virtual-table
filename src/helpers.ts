export type ValueGetter<T = number> = T | ((index: number) => T);

export function sumColumnWidths(columnWidthGetter: ValueGetter<number>, index: number) {

    if(isFunction(columnWidthGetter)) {
        let sum = 0;
        while (index-- > 0) {
            sum += columnWidthGetter(index);
        }
        return sum;
    }

    return ((index + 1) * columnWidthGetter) - columnWidthGetter;
}

export function sumRowsHeights(rowHeightGetter: ValueGetter<number>, index: number) {

    if(isFunction(rowHeightGetter)) {
        let sum = 0;
        while (index-- > 0) {
            sum += rowHeightGetter(index);
        }
        return sum;
    }

    return ((index + 1) * rowHeightGetter) - rowHeightGetter;
}

export function isFunction(value: any): value is Function {
    return value && {}.toString.call(value) === '[object Function]';
}

export function assignRef<T>(refValue: T, ...refs: (React.Ref<T> | undefined)[]) {

    for(let i = 0; i < refs.length; i++) {

        const tmpRef = refs[i];

        if(typeof tmpRef === 'function') { tmpRef(refValue); }
        if(typeof tmpRef === 'object')   { (tmpRef as unknown as React.MutableRefObject<T>).current = refValue; }
    }
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