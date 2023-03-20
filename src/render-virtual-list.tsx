import React from "react";
import { ConfigProvider, Empty } from "antd";
import { Grid, OnScrollCallback } from "./grid";
import { assignRef, refSetter, sumColumnWidths } from "./helpers";
import { ColumnsType, ColumnType, GridChildComponentProps, ScrollViewSize } from "./interfaces";
import { TableLocale } from "antd/lib/table/interface";

import defaultLocale from 'antd/locale/en_US';

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

export interface IRenderVirtualListProps<RecordType extends Record<any, any> = any> {
    locale: TableLocale | undefined,
    scroll: ScrollViewSize,
    gridRef?: React.Ref<Grid<RecordType>>,
    outerGridRef?: React.Ref<HTMLElement>,
    rowHeight: number,
    columns: ColumnsType<RecordType>,
    connectObject: InfoRef,
    normalizeColumns: ColumnsType<RecordType>,
    normalizeIndexes: number[],
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    rowHeightGetter: (index: number) => number,
    getColumn: (index: number) => ColumnType<RecordType>,
    cellRender: (props: GridChildComponentProps<RecordType>) => React.ReactElement,
    onScroll?: OnScrollCallback,
}

export const RenderVirtualList = <RecordType extends Record<any, any>, >({
    locale,
    scroll,
    gridRef,
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
    onScroll: onScrollTable
}: IRenderVirtualListProps<RecordType>) => {

    const {
        locale: contextLocale = defaultLocale,
        renderEmpty,
    } = React.useContext(ConfigProvider.ConfigContext);

    const emptyText = (locale && locale.emptyText) || renderEmpty?.('Table') || (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
    );

    return (rawData: readonly RecordType[], info: Info) => {

        const { scrollbarSize, ref, onScroll } = info;
        const totalHeight = rawData.length * rowHeight;

        const hasData = rawData && rawData.length > 0;
        const emptyNode = hasData
                        ? null
                        : typeof emptyText === 'function'
                        ? emptyText()
                        : emptyText;

        assignRef(connectObject, ref);
        
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
        
        const totalWidth = sumColumnWidths(columnWidthGetter, normalizeColumns.length - 1);

        return (
            <div className="virtual-grid-wrap">
                {emptyNode &&
                <div className="virtual-grid-empty">
                    {emptyNode}
                </div>}
                <Grid<RecordType>
                    useIsScrolling
                    ref={refSetter(gridRef)}
                    estimatedColumnWidth={totalWidth / normalizeColumns.length}
                    estimatedRowHeight={rowHeight}
                    outerRef={outerGridRef}
                    className="virtual-grid"
                    width={scroll.x}
                    height={scroll.y}
                    columnCount={normalizeColumns.length}
                    rowCount={rawData.length}
                    rowHeight={rowHeightGetter}
                    columnWidth={columnWidthGetter}
                    itemData={rawData}
                    columnGetter={getColumn}
                    rerenderFixedColumnOnHorizontalScroll={rerenderFixedColumnOnHorizontalScroll}
                    onScroll={(props) => {
                        onScroll({ scrollLeft: props.scrollLeft });
                        onScrollTable && onScrollTable(props);
                    }}
                >
                    {cellRender}
                </Grid>
            </div>
        );
    }
}