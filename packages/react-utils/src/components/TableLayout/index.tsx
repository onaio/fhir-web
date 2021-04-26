import React from 'react';
import { Table as AntTable } from 'antd';
import { ColumnType, TableProps } from 'antd/lib/table';
import { Dictionary } from '@onaio/utils';

export interface Column<T> extends ColumnType<T>, Dictionary {
  dataIndex?: React.Key | React.Key[];
  key?: React.Key;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
