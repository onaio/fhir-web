import React, { useState } from 'react';
import { Table as AntTable } from 'antd';
import { ColumnType, TableProps as AntTableProps } from 'antd/lib/table';
import { Dictionary } from '@onaio/utils';
import { TABLE_PAGE_SIZE, TABLE_PAGE_SIZE_OPTIONS } from '../../constants';
import { getConfig, TableState, setConfig } from '@opensrp/pkg-config';

type TKey<T> = keyof T & React.Key;

export interface Column<T> extends ColumnType<T>, Dictionary {
  dataIndex?: TKey<T>;
  key?: TKey<T>;
}

// Options Must be of any Data type as the Data could be any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Options<T = any> = AntTableProps<T>;

export const defaults: Options = {
  pagination: {
    hideOnSinglePage: true,
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: TABLE_PAGE_SIZE,
    pageSizeOptions: TABLE_PAGE_SIZE_OPTIONS,
  },
};

interface Props<T> extends Omit<Options<T>, 'columns' | 'dataSource'> {
  datasource: T[];
  columns?: Column<T>[];
}

interface PersistState {
  id: string;
  persistState?: boolean;
}

interface NoPersistState {
  id?: never;
  persistState?: never;
}

export type TableProps<T> = Props<T> & (PersistState | NoPersistState);

/** Table Layout Component used to render the table with default Settings
 *
 * @param props - Table settings
 * @returns - the component
 */
export function TableLayout<T extends object = Dictionary>(props: TableProps<T>) {
  const { id, columns, datasource, children, persistState, ...restprops } = props;

  const options: Options = { ...defaults, ...restprops };
  const tablesState = getConfig('TablesState');

  const [tableState, setTableState] = useState<TableState>(
    id && tablesState[id] !== undefined ? tablesState[id] : {}
  );

  const tableprops: Options = {
    ...options,
    ...tablesState,
    // bind change event to pagination only if  table is uniquely identifable /and have to persistState
    // instead of table onchange bind it to pagination onchange so that table change event will be free to use for user at will
    ...(id &&
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      persistState && {
        pagination: {
          ...options.pagination,
          ...tableState?.pagination,
          onChange: paginationChange,
        },
      }),
  };

  /** Table Layout Component used to render the table with default Settings
   *
   * @param page - the current viewing Page number
   * @param pageSize - the no of rows to show in the table
   */
  function paginationChange(page: number, pageSize?: number) {
    // if table is uniquely identifable and have to persistState then Save Pagination to pkg-config store
    if (id && persistState) {
      const newstate: TableState = {
        ...tableState,
        pagination: { ...tableState, current: page, pageSize: pageSize },
      };
      tablesState[id] = newstate;
      setConfig('TablesState', { ...tablesState });
      setTableState(newstate);
    }
  }

  return (
    <AntTable<T> dataSource={datasource} columns={columns} {...tableprops}>
      {children}
    </AntTable>
  );
}

export default TableLayout;
