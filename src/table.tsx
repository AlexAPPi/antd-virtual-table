import { Table, TableProps } from 'antd';
import React, { useEffect } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Grid, OnScrollCallback } from './grid';
import { assignRef, classNames } from './helpers';
import { MemonableVirtualTableItem } from './item';
import { Info, InfoRef, RenderVirtualList } from './render-virtual-list';
import { ColumnsType, GridChildComponentProps, ScrollConfig } from './interfaces';
import { TableComponents } from 'rc-table/lib/interface';

import './style.css';

export type ColumnType = 'fixed-left' | 'fixed-right' | 'common';

export type VirtualTableComponents<RecordType> = Omit<TableComponents<RecordType>, "body">;

export interface VirtualTableProps<RecordType extends Record<any, any>> extends Omit<TableProps<RecordType>, "columns" | "scroll" | "components"> {
    components?: VirtualTableComponents<RecordType>,
    gridRef?: React.Ref<Grid<RecordType>>,
    outerGridRef?: React.Ref<HTMLElement>,
    scroll: ScrollConfig,
    columns: ColumnsType<RecordType>,
    rowHeight: number,
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    onScroll?: OnScrollCallback,
}

export function VirtualTable<RecordType extends Record<any, any>>(props: VirtualTableProps<RecordType>) {

    const { className, columns, rowHeight, scroll, gridRef, outerGridRef, onScroll, onChange, rerenderFixedColumnOnHorizontalScroll, components } = props;
    
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

                if (internalGridRef.current) {

                    const currentScrollLeft = internalGridRef.current.state.scrollLeft;

                    if(currentScrollLeft == value) {
                        return;
                    }

                    internalGridRef.current.scrollTo({ scrollLeft: value });
                }
            }
        }
    });

    const fixStickyHeaderOffset = useCallback((tableWrap?: HTMLElement | null) => {

        // Данная функция нужна для поддержки overlap свойства колонки
        // Исправляем смещение для sticky колонок
        // Так же исправим баг связанный с таблицей

        if(components?.header) {
            return;
        }

        if(tableWrap) {

            const header = tableWrap.querySelector<HTMLElement>(".ant-table .ant-table-header");

            if (header) {

                const headerCells = header.querySelectorAll<HTMLTableCellElement>(".ant-table-thead .ant-table-cell");

                let totalWidth = 0;

                for(let headerIndex = 0; headerIndex < headerCells.length; headerIndex++) {
                    const cell = headerCells[headerIndex];
                    const width = cell.getBoundingClientRect().width;
                    totalWidth += width;
                }

                // TODO: Возможно пользователь задал свое значение, тут надо подумать...
                header.style.maxWidth = `${totalWidth}px`;

                let leftOffset = 0;
                let rightOffset = 0;

                for(let headerIndex = 0; headerIndex < headerCells.length; headerIndex++) {

                    const cell = headerCells[headerIndex];

                    if (cell.classList.contains("ant-table-cell-fix-left")) {
                        cell.style.left = `${leftOffset}px`;
                        const width = cell.getBoundingClientRect().width;
                        leftOffset += width;
                        continue;
                    }

                    break;
                }

                for(let headerIndex = headerCells.length - 1; headerIndex > -1; headerIndex--) {

                    const cell = headerCells[headerIndex];

                    if (cell.classList.contains("ant-table-cell-fix-right")) {
                        cell.style.right = `${rightOffset}px`;
                        const width = cell.getBoundingClientRect().width;
                        rightOffset += width;
                        continue;
                    }

                    break;
                }
            }
        }
        
    }, [scroll.x, scroll.y, scroll.scrollToFirstRowOnChange, components?.header]);

    const reset = useCallback((columnIndex: number = 0, rowIndex: number = 0) => {

        fixStickyHeaderOffset(tableRef.current);

        if(scroll.scrollToFirstRowOnChange) {
            connectObject.scrollLeft = 0;
        }

        internalGridRef.current?.resetAfterIndices({
            columnIndex: columnIndex,
            rowIndex: rowIndex,
            shouldForceUpdate: true,
        });

    }, [connectObject, fixStickyHeaderOffset]);

    const handleOnChange = useCallback<NonNullable<typeof onChange>>((pagination, filters, sorter, extra) => {

        fixStickyHeaderOffset(tableRef.current);

        if(onChange) {
            onChange(pagination, filters, sorter, extra);
        }

        if(scroll.scrollToFirstRowOnChange) {

            reset();
        }

    }, [onChange, fixStickyHeaderOffset, reset]);

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

            const { columnIndex } = props;
            const originalColumnIndex = normalizeIndexes[columnIndex];
            const column = normalizeColumns[columnIndex];

            return (
                <MemonableVirtualTableItem
                    {...props}
                    originalColumnIndex={originalColumnIndex}
                    column={column}
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

    useEffect(() => fixStickyHeaderOffset(tableRef.current), [columns, fixStickyHeaderOffset]);

    return (
        <Table<RecordType>
            {...props}
            ref={(el) => {
                assignRef(el, tableRef);
                fixStickyHeaderOffset(el);
            }}
            className={classNames("virtual-table", className)}
            components={{
                ...components,
                body: renderVirtualList,
            }}
            onChange={handleOnChange}
        />
    );
};

export default VirtualTable;