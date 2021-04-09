import React from 'react';
import { Table as AntTable } from 'antd';
import { ColumnType, TableProps } from 'antd/lib/table';

export interface Column<T> extends ColumnType<T>, Record<string, any> {
  dataIndex?: React.Key | React.Key[];
  key?: React.Key;
}

const defaultoptions: TableProps<any> = {
  pagination: {
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: 5,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
  },
};

export interface Props<T> extends Omit<TableProps<T>, 'columns' | 'dataSource'> {
  datasource: T[];
  columns?: Column<T>[];
}

export function TableLayout<T extends object = Record<string, any>>(props: Props<T>) {
  const { columns, datasource, children } = props;
  const options = { ...defaultoptions, ...props };

  return (
    <AntTable<T> dataSource={datasource} columns={columns} {...options}>
      {children}
    </AntTable>
  );
}

export default TableLayout;
