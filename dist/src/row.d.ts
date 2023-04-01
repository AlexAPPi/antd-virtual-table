import React from "react";
import { IGridProps, IItemStyle } from "./grid";
export interface IVirtualTableRowProps<RecordType extends Record<any, any> = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    rowIndex: number;
    getItemStyle: (rowIndex: number, columnIndex: number) => IItemStyle;
    isScrolling?: boolean;
    useIsScrolling?: boolean;
    children: IGridProps<RecordType>['children'];
    itemData: IGridProps<RecordType>['itemData'];
    itemKey?: IGridProps<RecordType>['itemKey'];
    columnCount: number;
    firstUnFixedColumn: number;
    firstRightFixedColumn: number;
    columnStartIndex?: number;
    columnStopIndex?: number;
    fixedContent?: React.ReactNode;
}
export declare function VirtualTableRow<RecordType extends Record<any, any> = any>(props: IVirtualTableRowProps<RecordType>): JSX.Element;
//# sourceMappingURL=row.d.ts.map