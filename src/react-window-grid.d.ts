import { VariableSizeGrid as OriginalVariableSizeGrid } from "react-window";
import { IGridProps, IGridState, IItemStyle, InstanceProps, ScrollEvent } from './grid';

export class VariableSizeGrid<RecordType extends Record<any, any> = any> extends OriginalVariableSizeGrid<readonly RecordType[]> {
    
    public props: IGridProps<RecordType>;
    public state: Readonly<IGridState>;

    protected _instanceProps: InstanceProps;

    protected _getHorizontalRangeToRender: () => [number, number];
    protected _getVerticalRangeToRender: () => [number, number];
    protected _getItemStyle: (rowIndex: number, columnIndex: number) => IItemStyle;
    protected _outerRefSetter: (ref: React.Ref<HTMLElement>) => void;
    protected _onScroll: (event: ScrollEvent) => void;
}

export default VariableSizeGrid