import React from "react";
import { Align, VariableSizeGrid, VariableSizeGridProps, GridOnScrollProps } from "react-window";
import { ColumnType } from "./interfaces";
export type columnGetter<TRecord extends Record<any, any> = any> = (index: number) => ColumnType<TRecord>;
export type itemSizeGetter = (index: number) => number;
export type ItemType = 'column' | 'row';
export type ScrollEvent = React.SyntheticEvent<ScrollEvent>;
export type ItemMetadata = {
    offset: number;
    size: number;
};
export type ItemMetadataMap = {
    [index: number]: ItemMetadata;
};
export type InstanceProps = {
    columnMetadataMap: ItemMetadataMap;
    estimatedColumnWidth: number;
    estimatedRowHeight: number;
    lastMeasuredColumnIndex: number;
    lastMeasuredRowIndex: number;
    rowMetadataMap: ItemMetadataMap;
};
export interface IItemStyle {
    position: React.CSSProperties['position'];
    left: number | undefined;
    right: number | undefined;
    top: number;
    height: number;
    width: number;
}
export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean;
    scrollbarSize?: number;
    itemData: readonly RecordType[];
    columnGetter: columnGetter<RecordType>;
}
export type OnScrollProps = GridOnScrollProps;
export type OnScrollCallback = (props: OnScrollProps) => void;
export interface IGridState {
    isScrolling: boolean;
    scrollTop: number;
    scrollLeft: number;
}
export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean;
    scrollbarSize?: number;
    itemData: readonly RecordType[];
    columnGetter: columnGetter<RecordType>;
}
export interface IItemStyle {
    position: React.CSSProperties['position'];
    left: number | undefined;
    right: number | undefined;
    top: number;
    height: number;
    width: number;
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
export declare class Grid<RecordType extends Record<any, any> = any> extends VariableSizeGrid<readonly RecordType[]> {
    props: IGridProps<RecordType>;
    state: Readonly<IGridState>;
    private _instanceProps;
    private _getHorizontalRangeToRender;
    private _getVerticalRangeToRender;
    private _getItemStyle;
    private _outerRefSetter;
    private _onScroll;
    private _leftFixedColumnsWidth;
    private _rightFixedColumnsWidth;
    private _firstUnFixedColumn;
    /** ?????????? ???????? ?????????? <b>props.columnCount</b>, ?????????? ?????? ?????????????????????????? ?????????????? ???????????? */
    private _firstRightFixedColumn;
    private _lastFixedRenderedContent;
    private _lastFixedRenderedRowStartIndex;
    private _lastFixedRenderedRowStopIndex;
    constructor(props: IGridProps<RecordType>);
    private _updateFixedColumnsVars;
    _renderFixedColumns(rowStartIndex: number, rowStopIndex: number, update?: boolean): React.ReactElement[] | undefined;
    scrollToItem({ align, rowIndex, columnIndex }: IScrollToItemParams): void;
    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    componentDidUpdate(prevProps: IGridProps<RecordType>, prevState: IGridState, snapshot: any): void;
}
//# sourceMappingURL=grid.d.ts.map