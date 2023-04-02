import { Align, VariableSizeGridProps } from "react-window";
import { columnGetter, Grid, InstanceProps, ItemMetadata, ItemType } from "./grid";
export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean;
    scrollbarSize?: number;
    itemData: readonly RecordType[];
    columnGetter: columnGetter<RecordType>;
}
export declare const getItemMetadata: <TRecord extends Record<any, any> = any>(itemType: ItemType, props: import("./grid").IGridProps<TRecord>, index: number, instanceProps: InstanceProps) => ItemMetadata;
export declare const getEstimatedTotalHeight: <TRecord extends Record<any, any> = any>({ rowCount }: import("./grid").IGridProps<TRecord>, { rowMetadataMap, estimatedRowHeight, lastMeasuredRowIndex }: InstanceProps) => number;
export declare const getEstimatedTotalWidth: <TRecord extends Record<any, any> = any>({ columnCount }: import("./grid").IGridProps<TRecord>, { columnMetadataMap, estimatedColumnWidth, lastMeasuredColumnIndex, }: InstanceProps) => number;
export declare const getOffsetForIndexAndAlignment: <TRecord extends Record<any, any> = any>(itemType: ItemType, props: import("./grid").IGridProps<TRecord>, index: number, align: Align | undefined, scrollOffset: number, instanceProps: InstanceProps, scrollbarSize: number, sumOfLeftFixedColumnsWidth: number, sumOfRightFixedColumnsWidth: number) => number;
export declare const getOffsetForColumnAndAlignment: <TRecord extends Record<any, any> = any>(props: import("./grid").IGridProps<TRecord>, index: number, align: Align | undefined, scrollOffset: number, instanceProps: InstanceProps, scrollbarSize: number, sumOfLeftFixedColumnsWidth: number, sumOfRightFixedColumnsWidth: number) => number;
export declare const getOffsetForRowAndAlignment: <TRecord extends Record<any, any> = any>(props: import("./grid").IGridProps<TRecord>, index: number, align: Align | undefined, scrollOffset: number, instanceProps: InstanceProps, scrollbarSize: number, sumOfLeftFixedColumnsWidth: number, sumOfRightFixedColumnsWidth: number) => number;
export declare const getRowOffset: <TRecord extends Record<any, any> = any>(props: import("./grid").IGridProps<TRecord>, index: number, instanceProps: InstanceProps) => number;
export declare const getRowHeightOrCalculate: <TRecord extends Record<any, any> = any>(props: import("./grid").IGridProps<TRecord>, index: number, instanceProps: InstanceProps) => number;
export declare const getRowHeight: <TRecord extends Record<any, any> = any>(props: import("./grid").IGridProps<TRecord>, index: number, instanceProps: InstanceProps) => number;
export declare const getColumnWidth: <TRecord extends Record<any, any> = any>(props: import("./grid").IGridProps<TRecord>, index: number, instanceProps: InstanceProps) => number;
export declare const getColumnWidthOrCalculate: <TRecord extends Record<any, any> = any>(props: import("./grid").IGridProps<TRecord>, index: number, instanceProps: InstanceProps) => number;
//# sourceMappingURL=grid-helpers.d.ts.map