import { TableProps } from 'antd';
import React from 'react';
import { Grid, OnScrollCallback } from './grid';
import { ColumnsType, ScrollConfig } from './interfaces';
import './style.css';
export interface VirtualTableProps<RecordType extends Record<any, any>> extends Omit<TableProps<RecordType>, "columns" | "scroll"> {
    gridRef?: React.Ref<Grid<RecordType>>;
    outerGridRef?: React.Ref<HTMLElement>;
    scroll: ScrollConfig;
    columns: ColumnsType<RecordType>;
    rowHeight: number;
    onScroll?: OnScrollCallback;
}
export declare function VirtualTable<RecordType extends Record<any, any>>(props: VirtualTableProps<RecordType>): JSX.Element;
export default VirtualTable;
