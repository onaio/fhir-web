import React from 'react';
import { Table as AntTable } from 'antd';
import { ColumnType, TableProps } from 'antd/lib/table';

declare type TKey<T> = keyof T & string;
export interface Column<T> extends ColumnType<T>, Record<string, any> {
  dataIndex?: TKey<T> | TKey<T>[];
  key?: TKey<T>;
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
  Object.assign(defaultoptions, props);
  const { columns, datasource, children } = props;

  return (
    <AntTable<T> dataSource={datasource} columns={columns} {...props}>
      {children}
    </AntTable>
  );
}

export default TableLayout;
