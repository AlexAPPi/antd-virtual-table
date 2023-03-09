import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { VirtualTable } from './table';
import { ColumnsType, ColumnType } from './interfaces';

import './style.css';

type RecordType = {value: string | number};

const render: ColumnType<RecordType>['render']  = (value, itemData, index, isScrolling) => {
    const data = itemData?.value;
    return <div style={{background: '#fff'}}>{data}</div>
}

const defaultColumns: ColumnsType<RecordType> = [
    {
        key: '1',
        width: 40,
        fixed: true,
        render
    },
    {
        key: '2',
        width: 40,
        fixed: true,
        render
    },
];

for(var i = 3; i < 100; i++) {
    defaultColumns.push({
        key: i,
        width: 40,
        render
    });
}

/*
defaultColumns.push(...[{
    key: 101,
    width: 200,
    fixed: 'right' as const,
    render
},
{
    key: 102,
    width: 200,
    fixed: 'right' as const,
    render
}]);
*/

const dataSource: RecordType[] = [
    {value: '123'},
    {value: '333'},
    {value: '444'},
    {value: '555'},
    {value: '666'},
    {value: '777'}
]

for(var i = 0; i < 10000; i++) {
    dataSource.push({value: i});
}

function Sample() {

    const [columns, setColumns] = useState(defaultColumns);
    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(() => {

        function updateSize() {
            setWindowSize([window.innerWidth, window.innerHeight]);
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
        <VirtualTable<RecordType>
            scroll={{x: windowSize[0], y: windowSize[1]}}
            rowHeight={50}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
        />
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