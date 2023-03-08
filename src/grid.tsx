import React, { Component } from "react";
import { createElement, SyntheticEvent } from "react";
import { Align, VariableSizeGrid, VariableSizeGridProps, GridOnScrollProps } from "react-window";
import { ColumnType } from "./interfaces";
import { getScrollbarSize } from "./domHelpers";
import { classNames } from "./helpers";

type ScrollEvent = SyntheticEvent<HTMLDivElement>;
type columnGetter<TRecord extends Record<any, any> = any> = (index: number) => ColumnType<TRecord>;
type itemSizeGetter = (index: number) => number;
type ItemType = 'column' | 'row';
type ItemMetadata = {
    offset: number,
    size: number,
};
type ItemMetadataMap = { [index: number]: ItemMetadata };
type InstanceProps = {
    columnMetadataMap: ItemMetadataMap,
    estimatedColumnWidth: number,
    estimatedRowHeight: number,
    lastMeasuredColumnIndex: number,
    lastMeasuredRowIndex: number,
    rowMetadataMap: ItemMetadataMap,
};

const defaultItemKey = <TData,>({ columnIndex, data, rowIndex }: { columnIndex: number, data: TData | undefined, rowIndex: number }) =>
  `${rowIndex}:${columnIndex}`;

const getItemMetadata = <TRecord extends Record<any, any> = any,>(
    itemType: ItemType,
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): ItemMetadata => {

    let itemMetadataMap: ItemMetadataMap, itemSize: itemSizeGetter, lastMeasuredIndex: number;

    if (itemType === 'column') {
        itemMetadataMap = instanceProps.columnMetadataMap;
        itemSize = props.columnWidth;
        lastMeasuredIndex = instanceProps.lastMeasuredColumnIndex;
    } else {
        itemMetadataMap = instanceProps.rowMetadataMap;
        itemSize = props.rowHeight;
        lastMeasuredIndex = instanceProps.lastMeasuredRowIndex;
    }
  
    if (index > lastMeasuredIndex) {

        let offset = 0;

        if (lastMeasuredIndex >= 0) {
            const itemMetadata = itemMetadataMap[lastMeasuredIndex];
            offset = itemMetadata.offset + itemMetadata.size;
        }
  
        for (let i = lastMeasuredIndex + 1; i <= index; i++) {

            let size = itemSize(i);
  
            itemMetadataMap[i] = {
                offset,
                size,
            };
  
            offset += size;
        }
  
        if (itemType === 'column') {
            instanceProps.lastMeasuredColumnIndex = index;
        } else {
            instanceProps.lastMeasuredRowIndex = index;
        }
    }

    return itemMetadataMap[index];
}

const getEstimatedTotalHeight = <TRecord extends Record<any, any> = any,>(
    { rowCount }: Grid<TRecord>['props'],
    { rowMetadataMap, estimatedRowHeight, lastMeasuredRowIndex }: InstanceProps
) => {
    let totalSizeOfMeasuredRows = 0;
  
    // Edge case check for when the number of items decreases while a scroll is in progress.
    // https://github.com/bvaughn/react-window/pull/138
    if (lastMeasuredRowIndex >= rowCount) {
        lastMeasuredRowIndex = rowCount - 1;
    }
  
    if (lastMeasuredRowIndex >= 0) {
        const itemMetadata = rowMetadataMap[lastMeasuredRowIndex];
        totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
    }
  
    const numUnmeasuredItems = rowCount - lastMeasuredRowIndex - 1;
    const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedRowHeight;
  
    return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

const getEstimatedTotalWidth = <TRecord extends Record<any, any> = any,>(
    { columnCount }: Grid<TRecord>['props'],
    {
        columnMetadataMap,
        estimatedColumnWidth,
        lastMeasuredColumnIndex,
    }: InstanceProps
) => {
    let totalSizeOfMeasuredRows = 0;
  
    // Edge case check for when the number of items decreases while a scroll is in progress.
    // https://github.com/bvaughn/react-window/pull/138
    if (lastMeasuredColumnIndex >= columnCount) {
        lastMeasuredColumnIndex = columnCount - 1;
    }
  
    if (lastMeasuredColumnIndex >= 0) {
        const itemMetadata = columnMetadataMap[lastMeasuredColumnIndex];
        totalSizeOfMeasuredRows = itemMetadata.offset + itemMetadata.size;
    }
  
    const numUnmeasuredItems = columnCount - lastMeasuredColumnIndex - 1;
    const totalSizeOfUnmeasuredItems = numUnmeasuredItems * estimatedColumnWidth;

    return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
};

const getOffsetForIndexAndAlignment = <TRecord extends Record<any, any> = any,>(
    itemType: ItemType,
    props: Grid<TRecord>['props'],
    index: number,
    align: Align | undefined,
    scrollOffset: number,
    instanceProps: InstanceProps,
    scrollbarSize: number,
    sumOfLeftFixedColumnsWidth: number,
    sumOfRightFixedColumnsWidth: number,
  ): number => {

    const leftOffset = itemType === 'column' ? sumOfLeftFixedColumnsWidth : 0;
    const rightOffset = itemType === 'column' ? sumOfRightFixedColumnsWidth : 0;
    const size = itemType === 'column' ? props.width : props.height;
    const itemMetadata = getItemMetadata(itemType, props, index, instanceProps);

    // Get estimated total size after ItemMetadata is computed,
    // To ensure it reflects actual measurements instead of just estimates.
    const estimatedTotalSize =
        itemType === 'column'
            ? getEstimatedTotalWidth(props, instanceProps)
            : getEstimatedTotalHeight(props, instanceProps);

    const maxOffset = Math.max(
        0,
        Math.min(estimatedTotalSize - size + leftOffset, itemMetadata.offset - leftOffset)
    );

    const minOffset = Math.max(
        0,
        itemMetadata.offset + itemMetadata.size - size + rightOffset + scrollbarSize
    );

    if (align === 'smart') {

        if (
            scrollOffset >= minOffset - size &&
            scrollOffset <= maxOffset + size
        ) {
            align = 'auto';
        } else {
            align = 'center';
        }
    }

    switch (align) {
        case 'start':
            return maxOffset;
        case 'end':
            return minOffset;
        case 'center':
            return Math.round(minOffset + (maxOffset - minOffset) / 2);
        case 'auto':
        default:
            if (scrollOffset >= minOffset && scrollOffset <= maxOffset) {
                return scrollOffset;
            } else if (minOffset > maxOffset) {
                // Because we only take into account the scrollbar size when calculating minOffset
                // this value can be larger than maxOffset when at the end of the list
                return minOffset;
            } else if (scrollOffset < minOffset) {
                return minOffset;
            } else {
                return maxOffset;
            }
    }
}

const getOffsetForColumnAndAlignment = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    align: Align | undefined,
    scrollOffset: number,
    instanceProps: InstanceProps,
    scrollbarSize: number,
    sumOfLeftFixedColumnsWidth: number,
    sumOfRightFixedColumnsWidth: number,
): number =>
    getOffsetForIndexAndAlignment(
        'column',
        props,
        index,
        align,
        scrollOffset,
        instanceProps,
        scrollbarSize,
        sumOfLeftFixedColumnsWidth,
        sumOfRightFixedColumnsWidth
    )

const getOffsetForRowAndAlignment = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    align: Align | undefined,
    scrollOffset: number,
    instanceProps: InstanceProps,
    scrollbarSize: number,
    sumOfLeftFixedColumnsWidth: number,
    sumOfRightFixedColumnsWidth: number,
): number =>
    getOffsetForIndexAndAlignment(
        'row',
        props,
        index,
        align,
        scrollOffset,
        instanceProps,
        scrollbarSize,
        sumOfLeftFixedColumnsWidth,
        sumOfRightFixedColumnsWidth
    )

const getRowOffset = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => getItemMetadata('row', props, index, instanceProps).offset;

const getRowHeightOrCalculate = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => getItemMetadata('row', props, index, instanceProps).size;

const getRowHeight = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => instanceProps.rowMetadataMap[index].size;

const getColumnWidth = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => instanceProps.columnMetadataMap[index].size;

const fixedRowClassName = "fixed-virtial-grid-row";
const fixedRowLeftColumnsClassName = "fixed-virtial-grid-row-left-columns";
const fixedRowRightColumnsClassName = "fixed-virtial-grid-row-right-columns";
const hasFixedLeftColumnClassName = "has-fixed-left-column";
const hasFixedRightColumnClassName = "has-fixed-right-column";

export type OnScrollProps = GridOnScrollProps;
export type OnScrollCallback = (props: OnScrollProps) => void;

export interface IGridState {
    isScrolling: boolean,
    scrollTop: number,
    scrollLeft: number,
}

export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    scrollbarSize?: number,
    itemData: readonly RecordType[],
    columnGetter: columnGetter<RecordType>,
}

export interface IItemStyle {
    position: React.CSSProperties['position'],
    left: number | undefined,
    right: number | undefined,
    top: number,
    height: number,
    width: number,
}

export interface IGrid<RecordType extends Record<any, any> = any> extends Omit<VariableSizeGrid<readonly RecordType[]>, 'props' | 'state'> {
    props: IGridProps<RecordType>;
    state: Readonly<IGridState>;
}

export interface IScrollToParams {
    scrollLeft?: number | undefined;
    scrollTop?: number | undefined;
}

export interface IScrollToItemParams {
    align?: Align | undefined;
    columnIndex?: number | undefined;
    rowIndex?: number | undefined;
}

export interface IResetAfterIndicesParams {
    columnIndex: number;
    rowIndex: number;
    shouldForceUpdate?: boolean | undefined;
}

export class Grid<RecordType extends Record<any, any> = any> extends VariableSizeGrid<readonly RecordType[]> {

    declare props: IGridProps<RecordType>;
    declare state: IGridState;

    declare private _instanceProps: InstanceProps;

    declare private _getHorizontalRangeToRender: () => [number, number];
    declare private _getVerticalRangeToRender: () => [number, number];
    declare private _getItemStyle: (rowIndex: number, columnIndex: number) => IItemStyle;
    declare private _outerRefSetter: (ref: any) => void;
    declare private _onScroll: (event: ScrollEvent) => void;

    private _leftFixedColumnsWidth = 0;
    private _rightFixedColumnsWidth = 0;
    private _lastLeftFixedColumn = 0;
    private _firstRightFixedColumn = 0;
    private _lastFixedRenderedContent: React.ReactElement[] | undefined;
    private _lastFixedRenderedRowStartIndex: number | undefined;
    private _lastFixedRenderedRowStopIndex: number | undefined

    constructor(props: IGridProps<RecordType>) {
        super(props);
        this._updateFixedColumnsVars();
    }

    private _updateFixedColumnsVars() {

        const { columnCount, columnGetter } = this.props;

        const columnStartIndex = 0;
        const columnStopIndex = columnCount;

        this._lastLeftFixedColumn = 0;
        this._firstRightFixedColumn = columnCount - 1;
        this._leftFixedColumnsWidth = 0;
        this._rightFixedColumnsWidth = 0;

        this._lastFixedRenderedContent = undefined;
        this._lastFixedRenderedRowStartIndex = undefined;
        this._lastFixedRenderedRowStopIndex = undefined;
        
        for (let columnIndex = columnStartIndex; columnIndex < columnStopIndex; columnIndex++) {

            let column = columnGetter(columnIndex);

            if (column.fixed === 'left' || column.fixed === true) {
                this._lastLeftFixedColumn++;
                this._leftFixedColumnsWidth += getColumnWidth(this.props, columnIndex, this._instanceProps);
                continue;
            }

            break;
        }

        for (let columnIndex = columnStopIndex - 1; columnIndex > -1; columnIndex--) {

            let column = columnGetter(columnIndex);

            if (column.fixed === 'right') {
                this._firstRightFixedColumn--;
                this._rightFixedColumnsWidth += getColumnWidth(this.props, columnIndex, this._instanceProps);
                continue;
            }

            break;
        }
    }

    _renderFixedColumns(rowStartIndex: number, rowStopIndex: number, update: boolean = false): React.ReactElement[] | undefined {

        if(update === false
        && this._lastFixedRenderedRowStartIndex === rowStartIndex
        && this._lastFixedRenderedRowStopIndex === rowStopIndex) {
            return this._lastFixedRenderedContent;
        }
        
        const { width, height, children, itemData, useIsScrolling, itemKey = defaultItemKey, scrollbarSize = getScrollbarSize(), } = this.props;
        const { isScrolling } = this.state;
    
        const estimatedTotalHeight = getEstimatedTotalHeight(
            this.props,
            this._instanceProps
        );
    
        const rows: React.ReactElement[] = [];
        const rowWidth = estimatedTotalHeight >= height ? width - scrollbarSize : width;
        const shownRowsCount = rowStopIndex - rowStartIndex + 1;
    
        if(this._leftFixedColumnsWidth > 0 || this._rightFixedColumnsWidth > 0) {
    
            for (let visibleRowIndex = 0; visibleRowIndex < shownRowsCount; visibleRowIndex++) {
    
                const rowLeftColumns: React.ReactElement[] = [];
                const rowRightColumns: React.ReactElement[] = [];
                const rowIndex = rowStartIndex + visibleRowIndex;
    
                const height = getRowHeight(this.props, rowIndex, this._instanceProps);
                const marginTop = visibleRowIndex === 0 ? getRowOffset(this.props, rowIndex, this._instanceProps) : undefined;
    
                for (let columnIndex = 0; columnIndex < this._lastLeftFixedColumn; columnIndex++) {
    
                    const width = getColumnWidth(this.props, columnIndex, this._instanceProps);
                    const item = createElement(children, {
                        key: itemKey({ columnIndex, data: itemData, rowIndex }),
                        rowIndex,
                        columnIndex,
                        data: itemData,
                        isScrolling: useIsScrolling ? isScrolling : undefined,
                        style: {
                            marginLeft: visibleRowIndex === 0 ? 0 : undefined,
                            marginTop: marginTop,
                            width: width,
                            height: height,
                        }
                    });
    
                    rowLeftColumns.push(item);
                }
    
                for (let columnIndex = 0; columnIndex > this._firstRightFixedColumn; columnIndex++) {
    
                    const width = getColumnWidth(this.props, columnIndex, this._instanceProps);
                    const item = createElement(children, {
                        key: itemKey({ columnIndex, data: itemData, rowIndex }),
                        rowIndex,
                        columnIndex,
                        data: itemData,
                        isScrolling: useIsScrolling ? isScrolling : undefined,
                        style: {
                            marginLeft: visibleRowIndex === 0 ? 0 : undefined,
                            marginTop: marginTop,
                            width: width,
                            height: height,
                        }
                    });
    
                    rowRightColumns.push(item);
                }
    
                if (rowLeftColumns.length > 0 || rowRightColumns.length > 0) {
    
                    rows.push((
                        <div
                            key={`fixed-row-${rowIndex}`}
                            row-index={rowIndex}
                            className={fixedRowClassName}
                            style={{
                                width: rowWidth,
                            }}
                        >
                            <div className={fixedRowLeftColumnsClassName}>
                                {rowLeftColumns}
                            </div>
                            <div className={fixedRowRightColumnsClassName}>
                                {rowRightColumns}
                            </div>
                        </div>
                    ));
                }
            }
        }
    
        this._lastFixedRenderedRowStartIndex = rowStartIndex;
        this._lastFixedRenderedRowStopIndex = rowStopIndex;
        this._lastFixedRenderedContent = rows;

        return this._lastFixedRenderedContent;
    }

    scrollToItem({ align, rowIndex, columnIndex }: IScrollToItemParams) {

        const { columnCount, height, rowCount, width } = this.props;
        const { scrollLeft, scrollTop } = this.state;
        const { scrollbarSize = getScrollbarSize() } = this.props;
    
        if (columnIndex !== undefined) {
            columnIndex = Math.max(0, Math.min(columnIndex, columnCount - 1));
        }
    
        if (rowIndex !== undefined) {
            rowIndex = Math.max(0, Math.min(rowIndex, rowCount - 1));
        }
    
        const estimatedTotalHeight = getEstimatedTotalHeight(
            this.props,
            this._instanceProps
        );
    
        const estimatedTotalWidth = getEstimatedTotalWidth(
            this.props,
            this._instanceProps
        );
    
        // The scrollbar size should be considered when scrolling an item into view,
        // to ensure it's fully visible.
        // But we only need to account for its size when it's actually visible.
        const horizontalScrollbarSize = estimatedTotalWidth > width ? scrollbarSize : 0;
        const verticalScrollbarSize   = estimatedTotalHeight > height ? scrollbarSize : 0;
    
        this.scrollTo({
            scrollLeft:
                columnIndex !== undefined
                    ? getOffsetForColumnAndAlignment(
                        this.props,
                        columnIndex,
                        align,
                        scrollLeft,
                        this._instanceProps,
                        verticalScrollbarSize,
                        this._leftFixedColumnsWidth,
                        this._rightFixedColumnsWidth,
                    )
                    : scrollLeft,
                scrollTop:
                    rowIndex !== undefined
                        ? getOffsetForRowAndAlignment(
                            this.props,
                            rowIndex,
                            align,
                            scrollTop,
                            this._instanceProps,
                            horizontalScrollbarSize,
                            this._leftFixedColumnsWidth,
                            this._rightFixedColumnsWidth,
                        )
                        : scrollTop,
        });
    }

    render() {

        const {
            children,
            className,
            columnCount,
            direction,
            height,
            innerRef,
            innerElementType,
            innerTagName,
            itemData,
            itemKey = defaultItemKey,
            outerElementType,
            outerTagName,
            rowCount,
            style,
            useIsScrolling,
            width,
            columnGetter
        } = this.props;
    
        const { isScrolling } = this.state;
    
        const [columnStartIndex, columnStopIndex, ] = this._getHorizontalRangeToRender();
        const [rowStartIndex, rowStopIndex] = this._getVerticalRangeToRender();
    
        const items: (React.ReactElement | React.ReactElement[])[] = [];

        if (columnCount > 0 && rowCount) {
    
            let newColumnStartIndex = columnStartIndex;
            let newColumnStopIndex = columnStopIndex;
    
            for (
                let columnIndex = columnStartIndex;
                columnIndex <= columnStopIndex;
                columnIndex++
            ) {
                let column = columnGetter(columnIndex);
                if (column.fixed === 'left' || column.fixed === true) {
                    newColumnStartIndex++;
                }
                else if (column.fixed === 'right') {
                    newColumnStopIndex--;
                }
            }
    
            for (
                let rowIndex = rowStartIndex;
                rowIndex <= rowStopIndex;
                rowIndex++
            ) {
                for (
                    let columnIndex = newColumnStartIndex;
                    columnIndex <= newColumnStopIndex;
                    columnIndex++
                ) {
                    items.push(
                        createElement(children, {
                            columnIndex,
                            data: itemData,
                            isScrolling: useIsScrolling ? isScrolling : undefined,
                            key: itemKey({ columnIndex, data: itemData!, rowIndex }),
                            rowIndex,
                            style: this._getItemStyle(rowIndex, columnIndex),
                        })
                    );
                }
            }
            
            const rows = this._renderFixedColumns(rowStartIndex, rowStopIndex);

            if(rows) {
                items.push(rows);
            }
        }
    
        // Read this value AFTER items have been created,
        // So their actual sizes (if variable) are taken into consideration.
        const estimatedTotalHeight = getEstimatedTotalHeight(
            this.props,
            this._instanceProps
        );
        const estimatedTotalWidth = getEstimatedTotalWidth(
            this.props,
            this._instanceProps
        );
    
        const hasFixedLeftColumn  = this._leftFixedColumnsWidth > 0;
        const hasFixedRightColumn = this._rightFixedColumnsWidth > 0;

        return createElement(
            outerElementType || outerTagName || 'div',
            {
                className: classNames(className, {
                    hasFixedLeftColumnClassName: hasFixedLeftColumn,
                    hasFixedRightColumnClassName: hasFixedRightColumn
                }),
                onScroll: this._onScroll,
                ref: this._outerRefSetter,
                style: {
                    position: 'relative',
                    height,
                    width,
                    overflow: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    willChange: 'transform',
                    direction,
                    ...style,
                },
            },
            createElement(innerElementType || innerTagName || 'div', {
                children: items,
                ref: innerRef,
                style: {
                    height: estimatedTotalHeight,
                    pointerEvents: isScrolling ? 'none' : undefined,
                    width: estimatedTotalWidth,
                },
            })
        );
    }

    componentDidUpdate(prevProps: IGridProps<RecordType>, prevState: IGridState, snapshot: any): void {

        // @ts-ignore
        super.componentDidUpdate(prevProps, prevState, snapshot);

        if(prevProps.columnGetter !== this.props.columnGetter
        || prevProps.columnCount !== this.props.columnCount
        || prevProps.columnWidth !== this.props.columnWidth) {
            this._updateFixedColumnsVars();
        }
    }
}