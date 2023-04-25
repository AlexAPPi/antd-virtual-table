import React, { createElement } from "react";
import { Align, VariableSizeGridProps, GridOnScrollProps } from "react-window";
import { getScrollbarSize } from "./dom-helpers";
import { classNames, isFunction } from "./helpers";
import { defaultItemKey } from "./cell";
import { ColumnType } from "./table";
import { getEstimatedTotalHeight, getEstimatedTotalWidth, getOffsetForColumnAndAlignment, getOffsetForRowAndAlignment } from './grid-helpers';

export type columnGetter<TRecord extends Record<any, any> = any> = (index: number) => ColumnType<TRecord>;
export type itemSizeGetter = (index: number) => number;
export type ItemType = 'column' | 'row';

export type ScrollEvent = React.SyntheticEvent<ScrollEvent>;

export type ItemMetadata = {
    offset: number,
    size: number,
}

export type ItemMetadataMap = { [index: number]: ItemMetadata }

export type InstanceProps = {
    columnMetadataMap: ItemMetadataMap,
    estimatedColumnWidth: number,
    estimatedRowHeight: number,
    lastMeasuredColumnIndex: number,
    lastMeasuredRowIndex: number,
    rowMetadataMap: ItemMetadataMap,
}

export interface IItemStyle extends React.CSSProperties {
    position: React.CSSProperties['position'],
    left: number,
    right: number,
    top: number,
    height: number,
    width: number,
}

const defaultRowClassName = "virtial-grid-row";
const defaultFixedRowClassName = "fixed-virtial-grid-row-columns";
const defaultFixedRowLeftColumnsClassName = "fixed-virtial-grid-row-left-columns";
const defaultFixedRowRightColumnsClassName = "fixed-virtial-grid-row-right-columns";
const defaultHasFixedLeftColumnClassName = "has-fixed-left-column";
const defaultHasFixedRightColumnClassName = "has-fixed-right-column";

export type OnScrollProps = GridOnScrollProps;
export type OnScrollCallback = (props: OnScrollProps) => void;

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

export interface IGridState {
    isScrolling: boolean,
    scrollTop: number,
    scrollLeft: number,
}

export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    rowClassName?: (record: RecordType, index: number) => string,
    onRow?: (record: RecordType, index: number) => React.HTMLAttributes<HTMLDivElement>;
    rowKey?: string | ((record: RecordType) => string), 
    scrollbarSize?: number,
    itemData: readonly RecordType[],
    columnGetter: columnGetter<RecordType>,
}

/*#if _BUILDLIB*/
//import { VariableSizeGrid } from './react-window-grid-d';
//#else*/
import { VariableSizeGrid } from './react-window-grid.js';
//#endif

export class Grid<RecordType extends Record<any, any> = any> extends VariableSizeGrid<RecordType> {

    private _leftFixedColumnsWidth = 0;
    private _rightFixedColumnsWidth = 0;

    private _firstUnFixedColumn = 0;

    /** может быть равен <b>props.columnCount</b>, когда нет фиксированных колонок справо */
    private _firstRightFixedColumn = 0;

    private _lastFixedRenderedContent: Record<number | string, [React.ReactElement[], React.ReactElement[]]> | undefined;
    private _lastFixedRenderedRowStartIndex: number | undefined;
    private _lastFixedRenderedRowStopIndex: number | undefined

    constructor(props: IGridProps<RecordType>) {
        super(props);
        this._updateFixedColumnsVars();
    }

    private _updateFixedColumnsVars() {

        const { columnCount, columnGetter, columnWidth } = this.props;

        this._firstUnFixedColumn = 0;
        this._firstRightFixedColumn = columnCount;
        this._leftFixedColumnsWidth = 0;
        this._rightFixedColumnsWidth = 0;

        this._lastFixedRenderedContent = undefined;
        this._lastFixedRenderedRowStartIndex = undefined;
        this._lastFixedRenderedRowStopIndex = undefined;

        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {

            let column = columnGetter(columnIndex);

            if (column.fixed === 'left' || column.fixed === true) {
                this._firstUnFixedColumn++;
                this._leftFixedColumnsWidth += columnWidth(columnIndex);
                continue;
            }

            break;
        }

        for (let columnIndex = columnCount - 1; columnIndex > -1; columnIndex--) {

            let column = columnGetter(columnIndex);

            if (column.fixed === 'right') {
                this._firstRightFixedColumn--;
                this._rightFixedColumnsWidth += columnWidth(columnIndex);
                continue;
            }

            break;
        }
    }

    _renderFixedColumns(rowStartIndex: number, rowStopIndex: number, update: boolean = false) {

        const { rerenderFixedColumnOnHorizontalScroll, columnWidth, rowHeight } = this.props;

        if(rerenderFixedColumnOnHorizontalScroll === false
        && update === false
        && this._lastFixedRenderedRowStartIndex === rowStartIndex
        && this._lastFixedRenderedRowStopIndex === rowStopIndex
        && this._lastFixedRenderedContent) {
            return this._lastFixedRenderedContent;
        }
        
        const { children, itemData, columnCount, useIsScrolling, itemKey = defaultItemKey } = this.props;
        const { isScrolling } = this.state;

        const rows: typeof this._lastFixedRenderedContent = {};
        const shownRowsCount = rowStopIndex - rowStartIndex + 1;
    
        // нет смысла рендерить скрытые колонки
        if(this._leftFixedColumnsWidth > 0
        || this._rightFixedColumnsWidth > 0) {
    
            for (
                let visibleRowIndex = 0;
                visibleRowIndex < shownRowsCount;
                visibleRowIndex++
            ) {
                const rowLeftColumns: React.ReactElement[] = [];
                const rowRightColumns: React.ReactElement[] = [];
                const rowIndex = rowStartIndex + visibleRowIndex;
                const height = rowHeight(rowIndex);

                const renderFixedColumn = (columnIndex: number) => {

                    const width = columnWidth(columnIndex);
                    return createElement(children, {
                        key: itemKey({ columnIndex, data: itemData, rowIndex }),
                        rowIndex,
                        columnIndex,
                        data: itemData,
                        isScrolling: useIsScrolling ? isScrolling : undefined,
                        style: {
                            width: width,
                            height: height,
                        }
                    });
                }

                for (
                    let columnIndex = 0;
                    columnIndex < this._firstUnFixedColumn;
                    columnIndex++
                ) {
                    const item = renderFixedColumn(columnIndex);
                    rowLeftColumns.push(item);
                }

                for (
                    let columnIndex = this._firstRightFixedColumn;
                    columnIndex < columnCount;
                    columnIndex++
                ) {
                    const item = renderFixedColumn(columnIndex);
                    rowRightColumns.push(item);
                }
    
                if (rowLeftColumns.length > 0 || rowRightColumns.length > 0) {
                    rows[rowIndex] = [rowLeftColumns, rowRightColumns];
                }
            }
        }
    
        this._lastFixedRenderedRowStartIndex = rowStartIndex;
        this._lastFixedRenderedRowStopIndex = rowStopIndex;
        this._lastFixedRenderedContent = rows;

        return rows;
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
            className,
            columnCount,
            height,
            innerRef,
            innerElementType,
            innerTagName,
            outerElementType,
            outerTagName,
            rowCount,
            direction,
            style,
            width,
            useIsScrolling,
            itemData,
            rowClassName,
            onRow,
            children,
            rowKey,
            itemKey = defaultItemKey,

        } = this.props;

        const { isScrolling } = this.state;
    
        const rowsColumns: Record<number | string, Record<number | string, React.ReactElement>> = {};
        const rowsElementProps: Record<number | string, React.HTMLAttributes<HTMLDivElement> & { key: string }> = {};

        let rowsFixedColumns: typeof this._lastFixedRenderedContent;

        if(columnCount > 0
        && rowCount > 0) {

            const [columnStartIndex, columnStopIndex, ] = this._getHorizontalRangeToRender();
            const [rowStartIndex, rowStopIndex] = this._getVerticalRangeToRender();

            rowsFixedColumns = this._renderFixedColumns(rowStartIndex, rowStopIndex);

            for (
                let rowIndex = rowStartIndex;
                rowIndex <= rowStopIndex;
                rowIndex++
            ) {
                const record = itemData[rowIndex];
                const className = rowClassName
                                ? rowClassName(record, rowIndex)
                                : undefined;
                
                const divProps = onRow
                               ? onRow(record, rowIndex)
                               : undefined;
            
                const key = isFunction(rowKey)
                          ? rowKey(record)
                          : rowKey ?? `${rowIndex}`;
                
                const firstItemStyle = this._getItemStyle(rowIndex, this._firstUnFixedColumn);
                const firstUnFixedColumn = this._firstUnFixedColumn;
                const firstRightFixedColumn = this._firstRightFixedColumn;
                const rowColumns: Record<number, React.ReactElement> = [];

                for (
                    let columnIndex = columnStartIndex;
                    columnIndex <= columnStopIndex;
                    columnIndex++
                ) {
                    
                    if(columnIndex < firstUnFixedColumn
                    || columnIndex > firstRightFixedColumn - 1) {
                        continue;
                    }
            
                    const key = itemKey({ columnIndex, data: itemData, rowIndex });
                    const style = this._getItemStyle(rowIndex, columnIndex);

                    rowColumns[columnIndex] = createElement(children, {
                        columnIndex,
                        data: itemData,
                        isScrolling: useIsScrolling ? isScrolling : undefined,
                        key: key,
                        rowIndex,
                        style: style,
                    });
                }
                
                rowsColumns[rowIndex] = rowColumns;
                rowsElementProps[rowIndex] = {
                    ...divProps,
                    key: key,
                    style: {
                        ...divProps?.style,
                        top: firstItemStyle.top
                    },
                    className: classNames(
                        defaultRowClassName,
                        className,
                        divProps?.className
                    )
                }
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

        const scrollBarSize = getScrollbarSize();
        const rows = Object.entries(rowsElementProps).map(([rowIndex, props]) => {
            
            const { top, left } = props.style || {};
            const rowFixedColumns = rowsFixedColumns ? rowsFixedColumns[rowIndex] : [];
            const fixedLeftColumns = rowFixedColumns[0];
            const fixedRightColumns = rowFixedColumns[1];
            const columns = Object.values(rowsColumns[rowIndex]);

            return (
                <div
                    {...props}
                >
                    {columns}
                    <div
                        className={defaultFixedRowClassName}
                        style={{
                            top: top,
                            left: left,
                            width: estimatedTotalWidth
                        }}
                    >
                        {fixedLeftColumns && fixedLeftColumns.length > 0 &&
                        <div className={defaultFixedRowLeftColumnsClassName}>
                            {fixedLeftColumns}
                        </div>}
                        {fixedRightColumns && fixedRightColumns.length > 0 &&
                        <div className={defaultFixedRowRightColumnsClassName}>
                            {fixedRightColumns}
                        </div>}
                    </div>
                </div>
            );
        });

        const hasFixedLeftColumn  = this._leftFixedColumnsWidth > 0;
        const hasFixedRightColumn = this._rightFixedColumnsWidth > 0;

        return createElement(
            outerElementType || outerTagName || 'div',
            {
                className: classNames(className, {
                    [defaultHasFixedLeftColumnClassName]: hasFixedLeftColumn,
                    [defaultHasFixedRightColumnClassName]: hasFixedRightColumn
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
                children: rows,
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

        if(prevProps.columnGetter !== this.props.columnGetter
        || prevProps.columnCount !== this.props.columnCount
        || prevProps.columnWidth !== this.props.columnWidth) {
            this._updateFixedColumnsVars();
        }

        // @ts-ignore
        super.componentDidUpdate(prevProps, prevState, snapshot);
    }
}