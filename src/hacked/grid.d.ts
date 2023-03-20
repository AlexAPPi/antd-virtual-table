import { VariableSizeGrid, VariableSizeGridProps } from "react-window";
import { ColumnType } from '../interfaces';

export type columnGetter<TRecord extends Record<any, any> = any> = (index: number) => ColumnType<TRecord>;
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

export interface IItemStyle {
    position: React.CSSProperties['position'],
    left: number | undefined,
    right: number | undefined,
    top: number,
    height: number,
    width: number,
}

export interface IGridState {
    isScrolling: boolean,
    scrollTop: number,
    scrollLeft: number,
}

export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    scrollbarSize?: number,
    itemData: readonly RecordType[],
    columnGetter: columnGetter<RecordType>,
}

export class HackedGrid<RecordType extends Record<any, any> = any> extends VariableSizeGrid<readonly RecordType[]> {
    
    public props: IGridProps<RecordType>;
    public state: Readonly<IGridState>;

    protected _instanceProps: InstanceProps;

    protected _getHorizontalRangeToRender: () => [number, number];
    protected _getVerticalRangeToRender: () => [number, number];
    protected _getItemStyle: (rowIndex: number, columnIndex: number) => IItemStyle;
    protected _outerRefSetter: (ref: React.Ref<HTMLElement>) => void;
    protected _onScroll: (event: ScrollEvent) => void;
}