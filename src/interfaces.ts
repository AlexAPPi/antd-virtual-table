import { ColumnType as AntdColumnType } from 'antd/lib/table';
import { GridChildComponentProps as InternalGridChildComponentProps } from 'react-window';

export interface ScrollViewSize {
    x: number,
    y: number
}

export interface ScrollConfig extends ScrollViewSize {
    scrollToFirstRowOnChange?: boolean;
}

export interface ColumnType<RecordType extends Record<any, any> = any> extends Omit<AntdColumnType<RecordType>, "width" | "shouldCellUpdate" | "onCell" | "render"> {
    overlap?: number,
    width: number,
    onCell?: (data: RecordType | undefined, index?: number, isScrolling?: boolean) => React.HTMLAttributes<any> | React.TdHTMLAttributes<any>;
    render?: (value: any, record: RecordType | undefined, index: number, isScrolling?: boolean) => React.ReactNode;
    shouldCellUpdate?: (record: RecordType | undefined, prevRecord: RecordType | undefined, isScrolling?: boolean) => boolean;
}

export interface Row<RecordType extends Record<any, any> = any> {
    height?: number | (() => number)
}

export type ColumnsType<RecordType extends Record<any, any> = any> = ColumnType<RecordType>[];

export interface GridChildComponentProps<RecordType extends Record<any, any> = any> extends InternalGridChildComponentProps<readonly RecordType[]> {
}

export interface VirtualTableItemProps<RecordType extends Record<any, any> = any> extends GridChildComponentProps<RecordType> {
    originalColumnIndex: number,
    column: ColumnType<RecordType>
}