import React, { Ref } from 'react';
import { TableProps } from 'antd';
import { Grid, OnScrollCallback } from './grid';
import { ColumnsType, ScrollConfig } from './interfaces';
import { TableComponents } from 'rc-table/lib/interface';
import './style.css';
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
export type ColumnType = 'fixed-left' | 'fixed-right' | 'common';
export type VirtualTableComponents<RecordType> = Omit<TableComponents<RecordType>, "body">;
export interface VirtualTableProps<RecordType extends Record<any, any>> extends Omit<TableProps<RecordType>, "columns" | "scroll" | "components"> {
    components?: VirtualTableComponents<RecordType>;
    gridRef?: React.Ref<Grid<RecordType>>;
    outerGridRef?: React.Ref<HTMLElement>;
    scroll: ScrollConfig;
    columns: ColumnsType<RecordType>;
    rowHeight: number | ((record: Readonly<RecordType>) => number);
    rerenderFixedColumnOnHorizontalScroll?: boolean;
    onScroll?: OnScrollCallback;
}
export declare const VirtualTable: <RecordType extends Record<any, any>>(props: VirtualTableProps<RecordType> & {
    ref?: React.Ref<HTMLDivElement> | undefined;
}) => JSX.Element;
export default VirtualTable;
//# sourceMappingURL=table.d.ts.map