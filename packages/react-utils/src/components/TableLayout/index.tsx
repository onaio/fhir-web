import React from 'react';
import { Table as AntTable } from 'antd';
import { TableProps } from 'antd/lib/table';

const defaultoptions: TableProps<any> = {
  pagination: {
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 5,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
  },
};

export function TableLayout<T extends object = Record<string, any>>(props: TableProps<T>) {
  const { columns, dataSource, children } = props;
  const options = { ...defaultoptions, ...props };

  return (
    <AntTable<T> dataSource={dataSource} columns={columns} {...options}>
      {children}
    </AntTable>
  );
}

export default TableLayout;
