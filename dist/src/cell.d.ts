import React from 'react';
import { GridChildComponentProps as OriginalGridChildComponentProps } from 'react-window';
import { ColumnType } from './table';
export declare const columnRowClassName = "virtial-grid-item";
export declare const defaultItemKey: <TData>({ columnIndex, data, rowIndex }: {
    columnIndex: number;
    data: TData | undefined;
    rowIndex: number;
}) => string;
export interface GridChildComponentProps<RecordType extends Record<any, any> = any> extends OriginalGridChildComponentProps<readonly RecordType[]> {
}
export interface VirtualTableCellProps<RecordType extends Record<any, any> = any> extends GridChildComponentProps<RecordType> {
    originalColumnIndex: number;
    column: ColumnType<RecordType>;
}
export declare function VirtualTableCell<RecordType extends Record<any, any> = any>(props: VirtualTableCellProps<RecordType>): JSX.Element;
export declare const MemonableVirtualTableCell: React.MemoExoticComponent<typeof VirtualTableCell>;
//# sourceMappingURL=cell.d.ts.map