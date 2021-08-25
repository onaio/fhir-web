import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { TableProps } from '@opensrp/react-utils';

const defaultcurrentPage = 1;
const defaultpageSize = 5;
type DataRecord<T> = Dictionary<T>;

interface Props<T> {
  onSuccess?: (response: T[]) => void;
  onError?: (error: unknown) => void;
  onSelect?: (response?: any) => T[];
  queryFn: (currentPage: number, pageSize: number) => Promise<T[]>;
  queryid: string;
  currentPage?: number;
  pageSize?: number;
  total?: number | ((data: T[]) => number);
  children: (
    props: TableProps<T> & {
      fetchNextPage: Function;
      fetchPreviousPage: Function;
    }
  ) => JSX.Element;
}

export function PaginateData<T extends object = Dictionary>(props: Props<T>) {
  const { total, onError, queryFn, queryid, onSuccess, onSelect, children } = props;

  const [{ currentPage, pageSize, prevdata }, setTableprops] = useState<{
    currentPage: number;
    pageSize: number;
    prevdata: T[];
  }>({
    currentPage: props.currentPage ?? defaultcurrentPage,
    pageSize: props.pageSize ?? defaultpageSize,
    prevdata: [],
  });

  const query = useInfiniteQuery(
    [queryid, pageSize],
    async ({ pageParam = currentPage }) => await queryFn(pageParam, pageSize),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      onSuccess: (resp) => onSuccess && onSuccess(convertToDataRecord(resp)[currentPage]),
      onError: onError,
    }
  );

  function convertToDataRecord(infdata: InfiniteData<T[]>): DataRecord<T[]> {
    return infdata?.pages.reduce((acc: DataRecord<T[]>, data, index) => {
      const page = (infdata.pageParams[index] as number) ?? defaultcurrentPage;
      return { ...acc, [page]: data } as DataRecord<T[]>;
    }, {});
  }

  const data = query.data ? convertToDataRecord(query.data) : {};

  const fetchPage = useCallback(
    (page = currentPage) => {
      if (!query.isFetchingNextPage) query.fetchNextPage({ pageParam: page, throwOnError: true });
    },
    [query, currentPage]
  );

  useEffect(() => {
    if (data[currentPage] === undefined) fetchPage();
  }, [currentPage, data, fetchPage]);

  const tabledata = useMemo(() => data[currentPage] ?? prevdata, [currentPage, data, prevdata]);

  return children({
    datasource: onSelect ? onSelect(tabledata) : tabledata,
    loading: query.isFetching,
    fetchNextPage: () => fetchPage(currentPage + 1),
    fetchPreviousPage: () => fetchPage(currentPage - 1),
    pagination: {
      total: typeof total === 'function' ? total(tabledata) : total,
      current: currentPage,
      onChange: (page, pagesize) =>
        setTableprops({ currentPage: page, pageSize: pagesize ?? pageSize, prevdata: tabledata }),
    },
  });
}
