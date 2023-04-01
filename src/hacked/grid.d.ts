import { VariableSizeGrid } from "react-window";
import { IGridProps, IGridState, IItemStyle, InstanceProps, ScrollEvent } from '../grid';

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