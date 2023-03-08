import equal from 'fast-deep-equal';
import React, { memo } from 'react';

import { classNames } from './helpers';
import { VirtualTableItemProps } from './interfaces';

export const columnRowClassName = "virtial-grid-item";

export function VirtualTableItem<RecordType extends Record<any, any> = any>(props: VirtualTableItemProps<RecordType>) {

    const { style, column, data, originalColumnIndex, columnIndex, rowIndex, isScrolling } = props;

    const row       = data && data[rowIndex];
    const value     = column.dataIndex && row ? row[column.dataIndex as any] : undefined;
    const cellProps = column.onCell && column.onCell(row, columnIndex, isScrolling);
    const render    = column.render;
    const content   = render ?
                      render(value, row, columnIndex, isScrolling) :
                      value as unknown as React.ReactNode;
    
    return (
        <div
            {...cellProps}
            data-row-index={rowIndex}
            data-column-index={columnIndex}
            data-original-column-index={originalColumnIndex}
            style={{
                ...cellProps?.style,
                ...style
            }}
            className={classNames(columnRowClassName, cellProps?.className)}
        >
            {content}
        </div>
    );
}

export const MemonableVirtualTableItem = memo(VirtualTableItem, (prevProps, nextProps) => {

    // system index
    if(prevProps.originalColumnIndex !== nextProps.originalColumnIndex
    || prevProps.columnIndex         !== nextProps.columnIndex
    || prevProps.rowIndex            !== nextProps.rowIndex) {
        return false;
    }

    if (prevProps.style !== nextProps.style
    && !equal(prevProps.style, nextProps.style)) {
        return false;
    }

    // check handler
    const shouldCellUpdate = nextProps.column.shouldCellUpdate;

    if(shouldCellUpdate) {

        const prevRecord  = prevProps.data;
        const nextRecord  = nextProps.data;
        const isScrolling = nextProps.isScrolling;

        if(!shouldCellUpdate(nextRecord, prevRecord, isScrolling)) {
            return true;
        }
    }

    if(prevProps.data             === nextProps.data
    && prevProps.column.dataIndex === nextProps.column.dataIndex
    && prevProps.column.onCell    === nextProps.column.onCell
    && prevProps.column.render    === nextProps.column.render) {
        return true;
    }

    return false;
});