import React from 'react';
import { Table as AntTable } from 'antd';
import { ColumnType, TableProps } from 'antd/lib/table';
import { Dictionary } from '@onaio/utils';
import { TABLE_PAGE_SIZE, TABLE_PAGE_SIZE_OPTIONS } from '../../constants';

type TKey<T> = keyof T & React.Key;

export interface Column<T> extends ColumnType<T>, Dictionary {
  dataIndex?: TKey<T>;
  key?: TKey<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultoptions: TableProps<any> = {
  pagination: {
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: TABLE_PAGE_SIZE,
    pageSizeOptions: TABLE_PAGE_SIZE_OPTIONS,
  },
};

export interface Props<T> extends Omit<TableProps<T>, 'columns' | 'dataSource'> {
  datasource: T[];
  columns?: Column<T>[];
}

/** Table Layout Component used to render the table with default Settings
 *
 * @param props - Table settings
 * @returns - the component
 */
export function TableLayout<T extends object = Dictionary>(props: Props<T>) {
  const { columns, datasource, children } = props;
  const options = { ...defaultoptions, ...props };

  return (
    <AntTable<T> dataSource={datasource} columns={columns} {...options}>
      {children}
    </AntTable>
  );
}

export default TableLayout;
