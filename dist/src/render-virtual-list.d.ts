import React from "react";
import { Grid, OnScrollCallback } from "./grid";
import { ColumnsType, ColumnType, GridChildComponentProps, ScrollViewSize } from "./interfaces";
export interface InfoRef {
    scrollLeft: number;
}
export interface Info {
    scrollbarSize: number;
    ref: React.Ref<InfoRef>;
    onScroll: (info: {
        currentTarget?: HTMLElement;
        scrollLeft?: number;
    }) => void;
}
export interface IRenderVirtualListProps<RecordType extends Record<any, any> = any> {
    scroll: ScrollViewSize;
    gridRef?: React.Ref<Grid<RecordType>>;
    outerGridRef?: React.Ref<HTMLElement>;
    rowHeight: number;
    columns: ColumnsType<RecordType>;
    connectObject: InfoRef;
    normalizeColumns: ColumnsType<RecordType>;
    normalizeIndexes: number[];
    rowHeightGetter: (index: number) => number;
    getColumn: (index: number) => ColumnType<RecordType>;
    cellRender: (props: GridChildComponentProps<RecordType>) => React.ReactElement;
    onScroll?: OnScrollCallback;
}
export declare const RenderVirtualList: <RecordType extends Record<any, any>>({ scroll, gridRef, outerGridRef, rowHeight, columns, connectObject, normalizeColumns, normalizeIndexes, getColumn, rowHeightGetter, cellRender, onScroll: onScrollTable }: IRenderVirtualListProps<RecordType>) => (rawData: readonly RecordType[], info: Info) => JSX.Element;
//# sourceMappingURL=render-virtual-list.d.ts.map