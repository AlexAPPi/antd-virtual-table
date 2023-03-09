import { VariableSizeGrid, VariableSizeGridProps } from "react-window";

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

export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    scrollbarSize?: number,
    itemData: readonly RecordType[],
    columnGetter: columnGetter<RecordType>,
}

export class HackedGrid<RecordType extends Record<any, any> = any> extends VariableSizeGrid<readonly RecordType[]> {
    
    declare props: IGridProps<RecordType>;
    declare state: IGridState;

    protected declare _instanceProps: InstanceProps;

    protected declare _getHorizontalRangeToRender: () => [number, number];
    protected declare _getVerticalRangeToRender: () => [number, number];
    protected declare _getItemStyle: (rowIndex: number, columnIndex: number) => IItemStyle;
    protected declare _outerRefSetter: (ref: React.Ref<HTMLElement>) => void;
    protected declare _onScroll: (event: ScrollEvent) => void;

    declare componentDidUpdate(prevProps: IGridProps<RecordType>, prevState: IGridState, snapshot: any);
}