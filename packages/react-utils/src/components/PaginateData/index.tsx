import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { TableProps } from '../TableLayout';
import { TABLE_PAGE, TABLE_PAGE_SIZE } from '../../constants';

type PaginatedData<T> = { data: T; total?: number };
type DataDictionary<T> = Dictionary<PaginatedData<T>>;

interface PaginateData<T> {
  onSuccess?: (response: PaginatedData<T[]>) => void;
  onError?: (error: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: (response?: any) => T[];
  queryFn: (currentPage: number, pageSize: number) => Promise<DataDictionary<T[]>>;
  queryid: string;
  currentPage?: number;
  pageSize?: number;
  total?: number | ((data: DataDictionary<T[]>) => Promise<number> | number);
  children: (
    props: TableProps<T> & {
      fetchNextPage: Function;
      fetchPreviousPage: Function;
    }
  ) => JSX.Element;
}

/**
 * Loads Data in Paginated format
 *
 * @param {PaginateData} props - component props
 * @returns {Element} - component
 */
export function PaginateData<T extends object = Dictionary>(props: PaginateData<T>) {
  const { total, onError, queryFn, queryid, onSuccess, onSelect, children } = props;

  const [{ currentPage, pageSize, prevdata }, setProps] = useState<{
    currentPage: number;
    pageSize: number;
    prevdata: PaginatedData<T[]>;
  }>({
    currentPage: props.currentPage ?? TABLE_PAGE,
    pageSize: props.pageSize ?? TABLE_PAGE_SIZE,
    prevdata: { data: [], total: undefined },
  });

  const query = useInfiniteQuery(
    [queryid, pageSize],
    async ({ pageParam = currentPage }) => {
      const data = await queryFn(pageParam, pageSize);
      const totalval = typeof total === 'function' ? await total(data) : total;
      return { data, total: totalval };
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      onSuccess: (resp) =>
        onSuccess ? onSuccess(convertToDataRecord(resp)[currentPage]) : undefined,
      onError: onError,
    }
  );

  /**
   * Converts Data recieved from query to Dictionary of Data
   *
   * @param {InfiniteData} infdata - data from query
   * @returns {Dictionary} - converted Dictionary of Data
   */
  function convertToDataRecord(
    infdata: InfiniteData<{ data: DataDictionary<T[]>; total: number | undefined }>
  ): DataDictionary<T[]> {
    return infdata.pages.reduce((acc: DataDictionary<T[]>, data, index) => {
      const page = (infdata.pageParams[index] as number | undefined) ?? TABLE_PAGE;
      return { ...acc, [page]: data } as DataDictionary<T[]>;
    }, {});
  }

  const data = query.data ? convertToDataRecord(query.data) : {};

  const fetchPage = useCallback(
    (page = currentPage) => {
      if (!query.isFetchingNextPage)
        query.fetchNextPage({ pageParam: page, throwOnError: true }).catch(onError);
    },
    [currentPage, query, onError]
  );

  useEffect(() => {
    if (data[currentPage] === undefined) fetchPage();
  }, [currentPage, data, fetchPage]);

  const tabledata: PaginatedData<T[]> = useMemo(
    () => (data[currentPage] as PaginatedData<T[]> | undefined) ?? prevdata,
    [currentPage, data, prevdata]
  );

  return children({
    datasource: onSelect ? onSelect(tabledata.data) : tabledata.data,
    loading: query.isFetching,
    fetchNextPage: () => fetchPage(currentPage + 1),
    fetchPreviousPage: () => fetchPage(currentPage - 1),
    pagination: {
      total: tabledata.total,
      current: currentPage,
      onChange: (page, pagesize) =>
        setProps({ currentPage: page, pageSize: pagesize ?? pageSize, prevdata: tabledata }),
    },
  });
}
