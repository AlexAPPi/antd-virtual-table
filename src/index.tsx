import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { VirtualTable } from './table';
import { ColumnsType, ColumnType } from './interfaces';
import { ConfigProvider } from 'antd';

import ru from 'antd/locale/ru_RU';

import './style.css';

type RecordType = {value: string | number};

const render: ColumnType<RecordType>['render']  = (value, itemData, index, isScrolling) => {
    const data = itemData?.value;
    return <div style={{background: '#fff'}}>{data}</div>
}

const defaultColumns: ColumnsType<RecordType> = [
    {
        title: 1,
        key: '1',
        width: 40,
        fixed: 'left',
        render
    },
    {
        title: 2,
        key: '2',
        width: 40,
        fixed: 'left',
        render
    },
];

for(var i = 3; i < 101; i++) {
    defaultColumns.push({
        title: i,
        key: i,
        width: 40,
        render
    });
}

const dataSource: RecordType[] = []

for(var i = 0; i < 100; i++) {
    dataSource.push({value: i});
}

defaultColumns.push({
    title: 101,
    key: 101,
    width: 200,
    fixed: 'right',
    render
},
{
    title: 102,
    key: 102,
    width: 220,
    fixed: 'right',
    render
});

function Sample() {

    const [columns, setColumns] = useState(defaultColumns);
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {

        function updateSize() {
            setWindowSize([window.innerWidth, window.innerHeight]);
            return;
            setTimeout(() => {
                setColumns(columns => {
                    const newColumns = [...columns];
                    newColumns.push({
                        key: columns.length,
                        width: 40,
                        render
                    });

                    return newColumns;
                });
            }, 3000);
        }

        const handler = updateSize;
        window.addEventListener('resize', handler, { passive: true });
        return () => window.removeEventListener('resize', handler);

    }, [setWindowSize]);

    return (
        <div
            style={{
                position: 'relative',
                width: windowSize[0] - 100
            }}
        >
            <ConfigProvider
                //renderEmpty={() => '5555'}
                locale={ru}
            >
                <VirtualTable<RecordType>
                    scroll={{x: windowSize[0] - 100, y: windowSize[1] - 500}}
                    //locale={{
                    //    emptyText: "321"
                    //}}
                    rowHeight={50}
                    columns={columns}
                    dataSource={dataSource}
                    //dataSource={[]}
                    pagination={false}
                    bordered
                />
            </ConfigProvider>
        </div>
    )
}

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Sample />
    </React.StrictMode>
);