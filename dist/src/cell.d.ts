import React from 'react';
export declare const columnRowClassName = "virtial-grid-item";
export declare const defaultItemKey: <TData>({ columnIndex, data, rowIndex }: {
    columnIndex: number;
    data: TData | undefined;
    rowIndex: number;
}) => string;
import { VirtualTableItemProps } from './interfaces';
export declare function VirtualTableCell<RecordType extends Record<any, any> = any>(props: VirtualTableItemProps<RecordType>): JSX.Element;
export declare const MemonableVirtualTableCell: React.MemoExoticComponent<typeof VirtualTableCell>;
//# sourceMappingURL=cell.d.ts.map