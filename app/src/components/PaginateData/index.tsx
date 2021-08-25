import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { useInfiniteQuery } from 'react-query';
import { TableProps } from '@opensrp/react-utils';

const defaultcurrentPage = 1;
const defaultpageSize = 5;
type DataRecord<T> = Dictionary<T>;

interface Props<T> {
  onSuccess?: (response: DataRecord<T[]>) => void;
  onError?: (error: unknown) => void;
  onSelect?: (response?: any) => T[];
  queryFn: (currentPage: number, pageSize: number) => Promise<T[]>;
  url?: string;
  queryid: string;
  currentPage: { defaultValue?: number; pram: string } | number;
  pageSize: { defaultValue?: number; pram: string } | number;
  total?: number | ((data: T[]) => number);
  children: (
    props: TableProps<T> & {
      fetchNextPage: Function;
      fetchPreviousPage: Function;
    }
  ) => JSX.Element;
}

export function PaginateData<T extends object = Dictionary>(props: Props<T>) {
  const {
    // url,
    total,
    onError,
    queryFn,
    queryid,
    onSuccess,
    onSelect,
    children,
  } = props;

  const [{ currentPage, pageSize, prevdata }, setTableprops] = useState<{
    currentPage: number;
    pageSize: number;
    prevdata: T[];
  }>({
    currentPage:
      typeof props.currentPage === 'number'
        ? props.currentPage
        : typeof props.currentPage === 'object'
        ? props.currentPage.defaultValue ?? defaultcurrentPage
        : defaultcurrentPage,
    pageSize:
      typeof props.pageSize === 'number'
        ? props.pageSize
        : typeof props.pageSize === 'object'
        ? props.pageSize.defaultValue ?? defaultpageSize
        : defaultpageSize,
    prevdata: [],
  });

  const query = useInfiniteQuery(
    [queryid, pageSize],
    async ({ pageParam = currentPage }) => await queryFn(pageParam, pageSize),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      onSuccess: (resp) => onSuccess && onSuccess((resp as unknown) as DataRecord<T[]>),
      onError: onError,
    }
  );

  const data = query.data
    ? query.data?.pages.reduce((acc: DataRecord<T[]>, data, index) => {
        const page = (query.data.pageParams[index] as number) ?? defaultcurrentPage;
        return { ...acc, [page]: data } as DataRecord<T[]>;
      }, {})
    : {};

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
