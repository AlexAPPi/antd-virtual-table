import { Table, TableProps } from 'antd';
import React, { useEffect } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Grid, OnScrollCallback } from './grid';
import { assignRef, classNames } from './helpers';
import { MemonableVirtualTableItem } from './item';
import { Info, InfoRef, RenderVirtualList } from './render-virtual-list';
import { ColumnsType, GridChildComponentProps, ScrollConfig } from './interfaces';

import './style.css';

export interface VirtualTableProps<RecordType extends Record<any, any>> extends Omit<TableProps<RecordType>, "columns" | "scroll"> {
    gridRef?: React.Ref<Grid<RecordType>>,
    outerGridRef?: React.Ref<HTMLElement>,
    scroll: ScrollConfig,
    columns: ColumnsType<RecordType>,
    rowHeight: number,
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    onScroll?: OnScrollCallback,
}

export function VirtualTable<RecordType extends Record<any, any>>(props: VirtualTableProps<RecordType>) {

    const { className, columns, rowHeight, scroll, gridRef, outerGridRef, onScroll, onChange, rerenderFixedColumnOnHorizontalScroll } = props;
    
    const tableRef = useRef<HTMLElement | null>(null);
    
    const internalGridRef = useRef<Grid<RecordType> | null>(null);
    const [connectObject] = useState<InfoRef>(() => {

        return {

            get scrollLeft() {

                if (internalGridRef.current) {
                    return internalGridRef.current?.state.scrollLeft;
                }

                return 0;
            },

            set scrollLeft(value: number) {

                const currentScrollLeft = internalGridRef.current?.state.scrollLeft;

                if(currentScrollLeft == value) {
                    return;
                }

                if (internalGridRef.current) {
                    internalGridRef.current.scrollTo({ scrollLeft: value });
                }
            }
        }
    });

    const fixSticky = useCallback((tableWrap?: HTMLElement | null) => {

        if(tableWrap) {

            // Исправляем смещение для sticky колонок
            // При использовании кастомного компонента смещение колонок работает не корректно 

            const headers = tableWrap.querySelectorAll<HTMLTableCellElement>(".ant-table .ant-table-header .ant-table-thead .ant-table-cell");
            
            let leftOffset = 0;

            for(let headerIndex = 0; headerIndex < headers.length; headerIndex++) {

                const header = headers[headerIndex];

                if (header.classList.contains("ant-table-cell-fix-left")) {
                    header.style.left = `${leftOffset}px`;
                    const width = header.getBoundingClientRect().width;
                    leftOffset += width;
                    continue;
                }

                break;
            }

            let rightOffset = 0;

            for(let headerIndex = headers.length - 1; headerIndex > -1; headerIndex--) {

                const header = headers[headerIndex];

                if (header.classList.contains("ant-table-cell-fix-right")) {
                    header.style.right = `${rightOffset}px`;
                    const width = header.getBoundingClientRect().width;
                    rightOffset += width;
                    continue;
                }

                break;
            }
        }
        
    }, [scroll.x, scroll.y, scroll.scrollToFirstRowOnChange]);

    const resetVirtualGrid = useCallback((columnIndex: number = 0, rowIndex: number = 0) => {

        fixSticky(tableRef.current);

        if(scroll.scrollToFirstRowOnChange) {
            connectObject.scrollLeft = 0;
        }

        internalGridRef.current?.resetAfterIndices({
            columnIndex: columnIndex,
            rowIndex: rowIndex,
            shouldForceUpdate: true,
        });

    }, [connectObject, fixSticky]);

    const handleOnChange = useCallback<NonNullable<typeof onChange>>((pagination, filters, sorter, extra) => {

        fixSticky(tableRef.current);

        if(onChange) {
            onChange(pagination, filters, sorter, extra);
        }

        if(scroll.scrollToFirstRowOnChange) {

            resetVirtualGrid();
        }

    }, [onChange, fixSticky, resetVirtualGrid]);

    const [normalizeColumns, normalizeIndexes, getColumn, cellRender] = useMemo(() => {

        let blockBuffer = 0;

        const normalizeColumns: typeof columns = [];
        const normalizeIndexes: number[] = [];

        columns.forEach((column, index) => {
            
            if(blockBuffer > 1) {
                blockBuffer--;
                return;
            }

            blockBuffer = column.overlap ?? 0;

            normalizeColumns.push(column);
            normalizeIndexes.push(index);
        });

        const getColumn = (index: number) => normalizeColumns[index];
        const cellRender = (props: GridChildComponentProps<RecordType>) => {

            const { columnIndex, data } = props;
            const originalColumnIndex = normalizeIndexes[columnIndex];
            const column = normalizeColumns[columnIndex];

            return (
                <MemonableVirtualTableItem
                    {...props}
                    originalColumnIndex={originalColumnIndex}
                    column={column}
                    data={data}
                />
            );
        };

        return [
            normalizeColumns,
            normalizeIndexes,
            getColumn,
            cellRender
        ]; 

    }, [columns]);

    const rowHeightGetter = useCallback(() => rowHeight, [rowHeight]);

    const renderVirtualList = RenderVirtualList({
        scroll,
        gridRef: (ref) => { assignRef(ref, internalGridRef, gridRef) },
        outerGridRef,
        rowHeight,
        columns,
        connectObject,
        normalizeColumns,
        normalizeIndexes,
        rerenderFixedColumnOnHorizontalScroll,
        getColumn,
        rowHeightGetter,
        cellRender,
        onScroll
    });

    useEffect(() => resetVirtualGrid(), [scroll.x, columns]);
    useEffect(() => resetVirtualGrid(columns.length > 0 ? columns.length - 2 : 0), [scroll.y]);

    return (
        <Table<RecordType>
            {...props}
            ref={(el) => {
                assignRef(el, tableRef);
                fixSticky(el);
            }}
            className={classNames("virtual-table", className)}
            components={{
                body: renderVirtualList,
            }}
            onChange={handleOnChange}
        />
    );
};

export default VirtualTable;