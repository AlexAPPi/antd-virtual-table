import React from 'react';
import { VirtualTableItemProps } from './interfaces';
export declare const columnRowClassName = "virtial-grid-item";
export declare function VirtualTableItem<RecordType extends Record<any, any> = any>(props: VirtualTableItemProps<RecordType>): JSX.Element;
export declare const MemonableVirtualTableItem: React.MemoExoticComponent<typeof VirtualTableItem>;
