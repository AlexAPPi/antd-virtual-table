import { VariableSizeGrid as OriginalVariableSizeGrid } from 'react-window';
import { IGridProps, IGridState, IItemStyle, InstanceProps, ScrollEvent } from './grid';

export class VariableSizeGrid<RecordType extends Record<any, any> = any> extends OriginalVariableSizeGrid<readonly RecordType[]> {
    
    declare public props: IGridProps<RecordType>;
    declare public state: Readonly<IGridState>;

    declare protected _instanceProps: InstanceProps;

    declare protected _getHorizontalRangeToRender: () => [number, number];
    declare protected _getVerticalRangeToRender: () => [number, number];
    declare protected _getItemStyle: (rowIndex: number, columnIndex: number) => IItemStyle;
    declare protected _outerRefSetter: (ref: React.Ref<HTMLElement>) => void;
    declare protected _onScroll: (event: ScrollEvent) => void;
}

export default VariableSizeGrid