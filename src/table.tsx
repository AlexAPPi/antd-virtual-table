import React, { Ref, useEffect } from 'react';
import { ConfigProvider, Empty, Table, TableProps, TableColumnType as AntdTableColumnType } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Grid, OnScrollCallback, OnScrollProps } from './grid';
import { assignRef, classNames, isFunction, refSetter, sumColumnWidths, sumRowsHeights } from './helpers';
import { GridChildComponentProps, MemonableVirtualTableCell } from './cell';
import { TableComponents } from 'rc-table/lib/interface';

import './style.css';

export interface InfoRef {
    scrollLeft: number;
}

export interface Info {
    scrollbarSize: number;
    ref: React.Ref<InfoRef>;
    onScroll: (info: {
        currentTarget?: HTMLElement;
        scrollLeft?: number;
    }) => void;
}

export interface ScrollViewSize {
    x: number,
    y: number
}

export interface ScrollConfig extends ScrollViewSize {
    scrollToFirstRowOnChange?: boolean;
}

export interface ColumnType<RecordType extends Record<any, any> = any> extends Omit<AntdTableColumnType<RecordType>, "width" | "shouldCellUpdate" | "onCell" | "render"> {
    overlap?: number,
    width: number,
    onCell?: (data: RecordType | undefined, index?: number, isScrolling?: boolean) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;
    render?: (value: any, record: RecordType | undefined, index: number, isScrolling?: boolean) => React.ReactNode;
    shouldCellUpdate?: (record: RecordType | undefined, prevRecord: RecordType | undefined, isScrolling?: boolean) => boolean;
}

export type ColumnsType<RecordType extends Record<any, any> = any> = ColumnType<RecordType>[];

export type VirtualTableComponents<RecordType> = Omit<TableComponents<RecordType>, "body">;

export interface VirtualTableProps<RecordType extends Record<any, any>> extends Omit<TableProps<RecordType>, "columns" | "scroll" | "components"> {
    components?: VirtualTableComponents<RecordType>,
    gridRef?: React.Ref<Grid<RecordType>>,
    outerGridRef?: React.Ref<HTMLElement>,
    scroll: ScrollConfig,
    columns: ColumnsType<RecordType>,
    rowHeight: number | ((record: Readonly<RecordType>) => number),
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    onScroll?: OnScrollCallback,
}

export const VirtualTable = <RecordType extends Record<any, any>>(props: VirtualTableProps<RecordType> & { ref?: Ref<HTMLDivElement> }) => {

    const {
        ref,
        dataSource,
        className,
        columns,
        rowHeight,
        scroll,
        gridRef,
        outerGridRef,
        onScroll,
        onChange,
        components,
        locale,
        showHeader,
        rerenderFixedColumnOnHorizontalScroll,
        ...tableProps
    } = props;

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

    const fixStickyHeaderOffset = useCallback((tableWrap?: HTMLElement | null, maxWidth: number = -1) => {

        // Данная функция нужна для поддержки overlap свойства колонки
        // Исправляем смещение для sticky колонок
        // Так же исправим баг связанный с таблицей

        if(showHeader === false || components?.header) {
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
                if (maxWidth !== -1 ) {
                    header.style.maxWidth = `${maxWidth}px`;
                }

                let leftOffset = 0;
                let rightOffset = 0;

                for(let headerIndex = 0; headerIndex < headerCells.length; headerIndex++) {

                    const cell = headerCells[headerIndex];

                    if (cell.classList.contains("ant-table-cell-fix-left")) {
                        const width = cell.getBoundingClientRect().width;
                        cell.style.left = `${leftOffset}px`;
                        leftOffset += width;
                        continue;
                    }

                    break;
                }

                for(let headerIndex = headerCells.length - 1; headerIndex > -1; headerIndex--) {

                    const cell = headerCells[headerIndex];

                    if (cell.classList.contains("ant-table-cell-fix-right")) {
                        const width = cell.getBoundingClientRect().width;
                        cell.style.right = `${rightOffset}px`;
                        rightOffset += width;
                        continue;
                    }

                    break;
                }
            }
        }
        
    }, [components?.header,
        showHeader
    ]);

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

    }, [scroll.scrollToFirstRowOnChange, connectObject, fixStickyHeaderOffset]);

    const handleChange = useCallback<NonNullable<typeof onChange>>((pagination, filters, sorter, extra) => {

        fixStickyHeaderOffset(tableRef.current);

        if(onChange) {
            onChange(pagination, filters, sorter, extra);
        }

        if(scroll.scrollToFirstRowOnChange) {

            reset();
        }

    }, [scroll.scrollToFirstRowOnChange,
        onChange,
        reset,
        fixStickyHeaderOffset
    ]);

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
                <MemonableVirtualTableCell
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

    const rowHeightGetterByRecord = useMemo(
        () => isFunction(rowHeight) ? rowHeight : () => rowHeight,
        [rowHeight]
    );

    const { renderEmpty } = React.useContext(ConfigProvider.ConfigContext);

    const emptyNode = useMemo(() => {

        const emptyText = (locale && locale.emptyText) || renderEmpty?.('Table') || (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );

        const emptyNode = typeof emptyText === 'function'
                        ? emptyText()
                        : emptyText;

        return (
            <div className="virtual-grid-empty">
                {emptyNode}
            </div>
        )

    }, [locale?.emptyText,
        renderEmpty
    ]);

    const bodyRender = useCallback((rawData: readonly RecordType[], info: Info) => {

        const { ref, scrollbarSize, onScroll: tableOnScroll } = info;

        assignRef(connectObject, ref);

        const rowHeightGetter = (index: number) => rowHeightGetterByRecord(rawData[index]);

        const totalHeight = sumRowsHeights(rowHeightGetter, rawData, rawData.length - 1);

        const columnWidthGetter = (index: number): number => {

            const column = normalizeColumns[index];
            const { width, overlap } = column;
    
            if(overlap && overlap > 0) {
    
                let blockedWidth = width;
                let lastBlockedIndex = normalizeIndexes[index];
    
                for(let overlapIndex = 1; overlapIndex < overlap; overlapIndex++) {
                    lastBlockedIndex++;
                    blockedWidth += columns[lastBlockedIndex].width;
                }
                
                return lastBlockedIndex === columns.length - 1
                ? blockedWidth - scrollbarSize
                : blockedWidth;
            }
    
            return totalHeight >= scroll.y && index === normalizeColumns.length - 1
            ? width - scrollbarSize
            : width;
        }

        const totalWidth  = sumColumnWidths(columnWidthGetter, normalizeColumns.length - 1);
        const scrollBarOffset = totalHeight >= scroll.y ? scrollbarSize : 0;
        
        fixStickyHeaderOffset(tableRef.current, totalWidth + scrollBarOffset);

        const handleScroll = (props: OnScrollProps) => {

            if(tableOnScroll) {
                tableOnScroll({
                    scrollLeft: props.scrollLeft
                });
            }

            if(onScroll) {
                onScroll(props);
            }
        }

        const hasData = rawData.length > 0;
        
        return (
            <div className="virtual-grid-wrap">
                {!hasData && emptyNode}
                <Grid<RecordType>
                    useIsScrolling
                    ref={refSetter(gridRef, internalGridRef)}
                    outerRef={refSetter(outerGridRef)}
                    className="virtual-grid"
                    rerenderFixedColumnOnHorizontalScroll={rerenderFixedColumnOnHorizontalScroll}
                    estimatedColumnWidth={totalWidth / normalizeColumns.length}
                    estimatedRowHeight={totalHeight / rawData.length}
                    width={scroll.x}
                    height={scroll.y}
                    columnCount={normalizeColumns.length}
                    rowCount={rawData.length}
                    rowHeight={rowHeightGetter}
                    columnWidth={columnWidthGetter}
                    itemData={rawData}
                    columnGetter={getColumn}
                    onScroll={handleScroll}
                >
                    {cellRender}
                </Grid>
            </div>
        );

    }, [fixStickyHeaderOffset,
        rowHeightGetterByRecord,
        rerenderFixedColumnOnHorizontalScroll,
        normalizeIndexes,
        normalizeColumns,
        columns,
        scroll.x,
        scroll.y,
        getColumn,
        onScroll,
        cellRender,
        emptyNode
    ]);

    useEffect(() => {
        fixStickyHeaderOffset(tableRef.current)
    }, [fixStickyHeaderOffset,
        scroll.x,
        scroll.y,
        scroll.scrollToFirstRowOnChange,
        columns,
        showHeader,
        components?.header
    ]);

    return (
        <Table<RecordType>
            {...tableProps}
            ref={(el) => {
                assignRef(el, ref, tableRef);
                fixStickyHeaderOffset(el);
            }}
            locale={locale}
            showHeader={showHeader}
            className={classNames("virtual-table", className)}
            columns={columns}
            dataSource={dataSource}
            scroll={scroll}
            components={{
                ...components,
                body: bodyRender,
            }}
            onChange={handleChange}
        />
    );
}

export default VirtualTable;