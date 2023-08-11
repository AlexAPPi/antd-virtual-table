import { Align, VariableSizeGridProps } from "react-window";
import { columnGetter, Grid, InstanceProps, ItemMetadata, ItemMetadataMap, itemSizeGetter, ItemType } from "./grid";

export interface IGridProps<RecordType extends Record<any, any> = any> extends VariableSizeGridProps<readonly RecordType[]> {
    rerenderFixedColumnOnHorizontalScroll?: boolean,
    scrollbarSize?: number,
    itemData: readonly RecordType[],
    columnGetter: columnGetter<RecordType>,
}

export const getItemMetadata = <TRecord extends Record<any, any> = any,>(
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

export const getEstimatedTotalHeight = <TRecord extends Record<any, any> = any,>(
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

export const getEstimatedTotalWidth = <TRecord extends Record<any, any> = any,>(
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

    console.log(numUnmeasuredItems * estimatedColumnWidth, columnCount * estimatedColumnWidth);

    return totalSizeOfMeasuredRows + totalSizeOfUnmeasuredItems;
}

export const getOffsetForIndexAndAlignment = <TRecord extends Record<any, any> = any,>(
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

export const getOffsetForColumnAndAlignment = <TRecord extends Record<any, any> = any,>(
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

export const getOffsetForRowAndAlignment = <TRecord extends Record<any, any> = any,>(
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

export const getRowOffset = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => getItemMetadata('row', props, index, instanceProps).offset;

export const getRowHeightOrCalculate = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => getItemMetadata('row', props, index, instanceProps).size;

export const getRowHeight = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => instanceProps.rowMetadataMap[index].size;

export const getColumnWidth = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => instanceProps.columnMetadataMap[index].size;

export const getColumnWidthOrCalculate = <TRecord extends Record<any, any> = any,>(
    props: Grid<TRecord>['props'],
    index: number,
    instanceProps: InstanceProps
): number => getItemMetadata('column', props, index, instanceProps).size;