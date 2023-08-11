import React, { Ref, useEffect, useLayoutEffect } from 'react';
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

    const didMountRef = useRef(false);
    const widthRef = useRef<number>();
    const tableRef = useRef<HTMLDivElement | null>(null);
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

                /*
                let totalWidth = 0;
                for(let headerIndex = 0; headerIndex < headerCells.length; headerIndex++) {
                    const cell = headerCells[headerIndex];
                    const width = cell.getBoundingClientRect().width;
                    totalWidth += width;
                }
                */
                
                // TODO: Возможно пользователь задал свое значение, тут надо подумать...
                // Если размер блока грида, меньше длины 
                if (maxWidth !== -1) {
                    header.style.maxWidth = `${maxWidth}px`;
                } else {
                    header.style.removeProperty("maxWidth");
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

    const handleChange = useCallback<NonNullable<typeof onChange>>((pagination, filters, sorter, extra) => {

        if(scroll.scrollToFirstRowOnChange) {

            connectObject.scrollLeft = 0;
            internalGridRef.current?.resetAfterIndices({
                columnIndex: 0,
                rowIndex: 0,
                shouldForceUpdate: true,
            });
        }

        fixStickyHeaderOffset(tableRef.current, widthRef.current);

        if(onChange) {
            onChange(pagination, filters, sorter, extra);
        }

    }, [fixStickyHeaderOffset,
        scroll.scrollToFirstRowOnChange,
        connectObject,
        onChange,
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

    const columnWidthGetterWithLastFlag = useCallback((index: number): [number, boolean] => {

        const column = normalizeColumns[index];
        const { width, overlap } = column;

        if (overlap && overlap > 0) {

            let blockedWidth = width;
            let lastBlockedIndex = normalizeIndexes[index];

            for(let overlapIndex = 1; overlapIndex < overlap; overlapIndex++) {
                lastBlockedIndex++;
                blockedWidth += columns[lastBlockedIndex].width;
            }
            
            return [blockedWidth, lastBlockedIndex === columns.length - 1];
        }

        return [width, index === normalizeColumns.length - 1];

    }, [normalizeColumns,
        columns
    ]);

    const realColumnWidthGetter = useCallback((index: number) => {
        const [width] = columnWidthGetterWithLastFlag(index);
        return width;
    }, [columnWidthGetterWithLastFlag]);

    const bodyRender = useCallback((rawData: readonly RecordType[], info: Info) => {

        const { ref, scrollbarSize, onScroll: tableOnScroll } = info;

        assignRef(connectObject, ref);

        const rowHeightGetter = (index: number) => rowHeightGetterByRecord(rawData[index]);
        const realTotalWidth = sumColumnWidths(realColumnWidthGetter, normalizeColumns.length - 1);
        const rowsHeight = sumRowsHeights(rowHeightGetter, rawData, rawData.length - 1);
        const scrollBarVerticalSize = rowsHeight > scroll.y ? scrollbarSize + 1 : 0;

        const columnWidthGetter = (index: number) => {
            const [width, isLast] = columnWidthGetterWithLastFlag(index);
            return isLast
                ? width - scrollBarVerticalSize
                : width;
        }

        const totalWidth = realTotalWidth - scrollBarVerticalSize;
        widthRef.current = realTotalWidth;

        const handleScroll = (props: OnScrollProps) => {

            if(onScroll) {
                onScroll(props);
            }

            if(tableOnScroll) {
                tableOnScroll({
                    scrollLeft: props.scrollLeft
                });
            }
        }

        const hasData = rawData.length > 0;
        const estimatedColumnWidth = totalWidth / normalizeColumns.length;
        const estimatedRowHeight = rowsHeight / rawData.length;

        return (
            <div className="virtual-grid-wrap">
                {!hasData && emptyNode}
                <Grid<RecordType>
                    useIsScrolling
                    ref={refSetter(gridRef, internalGridRef)}
                    outerRef={refSetter(outerGridRef)}
                    className="virtual-grid"
                    rerenderFixedColumnOnHorizontalScroll={rerenderFixedColumnOnHorizontalScroll}
                    estimatedColumnWidth={estimatedColumnWidth}
                    estimatedRowHeight={estimatedRowHeight}
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

    }, [rowHeightGetterByRecord,
        realColumnWidthGetter,
        columnWidthGetterWithLastFlag,
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

        if (didMountRef.current
        &&  internalGridRef.current) {
            internalGridRef.current.resetAfterColumnIndex(normalizeColumns.length - 1, true);
        }

    }, [scroll.y]);

    useEffect(() => {
        fixStickyHeaderOffset(tableRef.current, widthRef.current);
    }, [columns]);

    useEffect(() => {
                       didMountRef.current = true;
        return () => { didMountRef.current = false; }
    }, []);

    return (
        <Table<RecordType>
            {...tableProps}
            ref={refSetter(ref, tableRef)}
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