import { VirtualTable, VirtualTableProps, InfoRef, Info } from './table'
import { Grid, IGridProps, IGridState, OnScrollProps, OnScrollCallback } from './grid';
import { ColumnType, ColumnsType, ScrollViewSize, ScrollConfig } from './interfaces';

export type { VirtualTableProps, IGridProps, IGridState, ColumnType, ColumnsType, ScrollViewSize, ScrollConfig, InfoRef, Info }

export type GridOnScrollProps = OnScrollProps;
export type GridOnScrollCallback = OnScrollCallback;

export { VirtualTable, Grid }
export default VirtualTable;