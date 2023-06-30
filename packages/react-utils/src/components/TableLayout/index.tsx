import React, { useMemo, useState } from 'react';
import { Table as AntTable } from 'antd';
import type { TableProps as AntTableProps } from 'antd';
import {
  ColumnType,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
  FilterValue,
} from 'antd/lib/table/interface';
import { Dictionary } from '@onaio/utils';
import { TABLE_PAGE_SIZE, TABLE_PAGE_SIZE_OPTIONS, TABLE_ACTIONS_KEY } from '../../constants';
import { getConfig, TableState, setConfig } from '@opensrp/pkg-config';
import { Optional } from '../../helpers/utils';
import { useTranslation } from '../../mls';

// Options Must be of any Data type as the Data could be any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Options<T = any> = AntTableProps<T>;
type Action<T> = Optional<Column<T>, 'key' | 'dataIndex'>;
type TKey<T> = keyof T & React.Key;

export interface Column<T> extends ColumnType<T>, Dictionary {
  dataIndex?: TKey<T>;
  key?: TKey<T>;
}

interface Props<T> extends Omit<Options<T>, 'columns' | 'dataSource'> {
  datasource: T[];
  dataKeyAccessor?: keyof T;
  columns?: Column<T>[];
  actions?: Action<T>;
}

interface PersistState {
  id: string;
  persistState: boolean;
}

interface NoPersistState {
  id?: string;
  persistState?: never;
}

export type TableProps<T> = Props<T> & (PersistState | NoPersistState);

export type GenericWithKey = object & { key?: string | number };

/**
 * Table Layout Component used to render the table with default Settings
 *
 * @param props - Table settings
 * @returns - the component
 */
export function TableLayout<T extends GenericWithKey = Dictionary>(props: TableProps<T>) {
  const {
    id,
    columns,
    datasource,
    children,
    persistState,
    actions,
    dataKeyAccessor,
    pagination,
    ...restprops
  } = props;

  const { t } = useTranslation();

  const paginationDefaults = {
    showQuickJumper: true,
    showSizeChanger: true,
    defaultPageSize: getConfig('defaultTablesPageSize') ?? TABLE_PAGE_SIZE,
    pageSizeOptions: TABLE_PAGE_SIZE_OPTIONS,
  };

  const options: Options = {
    pagination: pagination === false ? false : { ...paginationDefaults, ...pagination },
    ...restprops,
  };
  const tablesState = getConfig('tablespref') ?? {};

  // Appends action column in the table column array
  const tablecolumn = useMemo(() => {
    if (columns && actions) {
      const actionsColumn: Column<T> = {
        key: TABLE_ACTIONS_KEY as TKey<T>,
        title: t('Actions'),
        ...actions,
      };
      return [...columns, actionsColumn];
    } else return columns;
  }, [columns, actions, t]);

  const [tableState, setTableState] = useState<TableState>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    id && tablesState[id] !== undefined ? tablesState[id] : {}
  );

  // auto append key into data if not provided
  const data: T[] = useMemo(() => {
    return datasource.map((e, index) => ({
      ...e,
      key: e.key ?? (dataKeyAccessor ? e[dataKeyAccessor as keyof T] : index),
    }));
  }, [dataKeyAccessor, datasource]);

  /**
   * Function Trigger on each change and is used to save state of the save on table props change
   *
   * @param pagination - Table Pagination if any
   * @param filters - Table Filters if any
   * @param sorter - Table Sorter if any
   * @param extra - Table Extra if any
   */
  function onChange(
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>
  ) {
    if (props.onChange) props.onChange(pagination, filters, sorter, extra);
    if (id && persistState) SaveTableState(pagination.current, pagination.pageSize);
  }

  /**
   * Function To update and save table State into GlobalState
   *
   * @param current - the current viewing Page number
   * @param pageSize - the no of rows to show in the table
   */
  function SaveTableState(current: number | undefined, pageSize: number | undefined) {
    const newstate: TableState = {
      ...tableState,
      pagination: { ...tableState, current, pageSize },
    };
    tablesState[id as string] = newstate;
    setConfig('tablespref', { ...tablesState });
    setTableState(newstate);
  }

  return (
    <AntTable
      {...{ ...options, ...tablesState }}
      onChange={onChange}
      dataSource={data}
      columns={tablecolumn}
    >
      {children}
    </AntTable>
  );
}

export default TableLayout;
