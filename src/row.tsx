import React, { createElement } from "react";
import { defaultItemKey } from "./cell";
import { IGridProps, IItemStyle } from "./grid";
import { classNames } from "./helpers";

const defaultRowClassName = "virtial-grid-row";

export interface IVirtualTableRowProps<RecordType extends Record<any, any> = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    rowIndex: number,
    getItemStyle: (rowIndex: number, columnIndex: number) => IItemStyle,
    isScrolling?: boolean,
    useIsScrolling?: boolean,
    children: IGridProps<RecordType>['children'],
    itemData: IGridProps<RecordType>['itemData'],
    itemKey?: IGridProps<RecordType>['itemKey'],
    columnCount: number,
    firstUnFixedColumn: number,
    firstRightFixedColumn: number,
    columnStartIndex?: number,
    columnStopIndex?: number,
    fixedContent?: React.ReactNode,
}

export function VirtualTableRow<RecordType extends Record<any, any> = any>(props: IVirtualTableRowProps<RecordType>) {

    const {
        rowIndex,
        getItemStyle,
        isScrolling,
        useIsScrolling,
        children,
        itemData,
        itemKey = defaultItemKey,
        columnCount,
        firstUnFixedColumn,
        firstRightFixedColumn,
        columnStartIndex = 0,
        columnStopIndex = columnCount,
        fixedContent,
        ...divProps
    } = props;

    // cache useless
    const rowColumns: React.ReactElement[] = [];

    for (
        let columnIndex = columnStartIndex;
        columnIndex <= columnStopIndex;
        columnIndex++
    ) {
        
        if(columnIndex < firstUnFixedColumn
        || columnIndex > firstRightFixedColumn - 1) {
            continue;
        }

        rowColumns.push(
            createElement(children, {
                columnIndex,
                data: itemData,
                isScrolling: useIsScrolling ? isScrolling : undefined,
                key: itemKey({ columnIndex, data: itemData, rowIndex }),
                rowIndex,
                style: getItemStyle(rowIndex, columnIndex),
            })
        );
    }

    return (
        <div
            {...divProps}
            className={classNames(
                defaultRowClassName,
                divProps.className
            )}
        >
            {rowColumns}
            {fixedContent}
        </div>
    );
}