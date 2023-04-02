import { VirtualTable, VirtualTableProps, InfoRef, Info, ColumnType, ColumnsType, ScrollViewSize, ScrollConfig } from './table';
import { Grid, IGridProps, IGridState, OnScrollProps, OnScrollCallback } from './grid';
import { Align } from 'react-window';

export type { VirtualTableProps, IGridProps, IGridState, ColumnType, ColumnsType, ScrollViewSize, ScrollConfig, InfoRef, Info }

export type GridScrollAlign = Align;
export type GridOnScrollProps = OnScrollProps;
export type GridOnScrollCallback = OnScrollCallback;

export { VirtualTable, Grid }
export default VirtualTable;