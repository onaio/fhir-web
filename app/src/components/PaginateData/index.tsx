import React, { useEffect, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { useQuery } from 'react-query';
import { TableLayout, TableProps } from '@opensrp/react-utils';
import { useTraceUpdate } from './Table';

type pram = {
  defaultValue?: number;
  pram: string;
};

type pram1 = {
  value: number;
  pram: string;
};

interface Props<T> {
  onSuccess?: (response: T[]) => any;
  OnError?: (error: unknown) => void;
  OnSelect?: (response?: any) => T[];
  queryFn: (currentPage: pram1, pageSize: pram1) => Promise<T[]>;
  url?: string;
  queryid?: string;
  currentPage: pram;
  pageSize: pram;
  total?: number | ((data: any) => number);
  children: (props: TableProps<T>) => JSX.Element;
}

/** Table Layout Component used to render the table with default Settings
 *
 * @param props - Table settings
 * @returns - the component
 */
export function PaginateData<T extends object = Dictionary>(props: Props<T>) {
  const {
    // url,
    total,
    OnError,
    // currentPage = { pram: '_count', defaultValue: 0 },
    queryFn,
    queryid,
    // pageSize = { pram: '_getpagesoffset', defaultValue: 5 },
    onSuccess,
    OnSelect,
    children,
  } = props;

  const [{ currentPage, pageSize }, setTableprops] = useState<{
    currentPage: pram1;
    pageSize: pram1;
  }>({
    currentPage: { ...props.currentPage, value: props.currentPage.defaultValue ?? 0 },
    pageSize: { ...props.pageSize, value: props.pageSize.defaultValue ?? 5 },
  });

  const query = useQuery(
    [queryid, currentPage.value, pageSize.value],
    () => queryFn(currentPage, pageSize),
    {
      keepPreviousData: true,
      onError: OnError,
      onSuccess: onSuccess,
    }
  );

  const selecteddata = OnSelect && query.data ? OnSelect(query.data) : query.data;

  return children({
    datasource: selecteddata ?? [],
    loading: query.isFetching,
    pagination: {
      total: typeof total === 'function' ? (query.data ? total(query.data) : undefined) : total,
      current: currentPage.value,
      onChange: (page, pagesize) => {
        setTableprops({
          currentPage: { ...currentPage, value: page },
          pageSize: { ...pageSize, value: pagesize ?? pageSize.value },
        });
      },
    },
  });
}
