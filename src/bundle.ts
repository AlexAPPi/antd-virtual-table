import { VirtualTable, VirtualTableProps } from './table'
import { Grid, IGridProps, IGridState, OnScrollProps, OnScrollCallback } from './grid';
import { ColumnType, ColumnsType, ScrollViewSize, ScrollConfig } from './interfaces';

export type GridOnScrollProps = OnScrollProps;
export type GridOnScrollCallback = OnScrollCallback;

export type { VirtualTableProps, IGridProps, IGridState, ColumnType, ColumnsType, ScrollViewSize, ScrollConfig }
export { VirtualTable, Grid };
export default VirtualTable;