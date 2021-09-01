import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { TableProps } from '../TableLayout';
import { TABLE_PAGE, TABLE_PAGE_SIZE } from '../../constants';

export type PaginatedData<T> = { data: T; total?: number };
export type DataDictionary<T> = Dictionary<PaginatedData<T>>;

interface PaginateData<T, resp = T[]> {
  onSuccess?: (response: PaginatedData<resp>) => void;
  onError?: (error: unknown) => void;
  onSelect?: (response: resp) => T[];
  queryFn: (currentPage: number, pageSize: number) => Promise<resp>;
  queryid: string;
  currentPage?: number;
  pageSize?: number;
  total?: number | ((data: resp) => Promise<number> | number);
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
export function PaginateData<T extends object = Dictionary, Resp = T[]>(
  props: PaginateData<T, Resp>
) {
  const { total, onError, queryFn, queryid, onSuccess, onSelect, children } = props;

  const [{ currentPage, pageSize, prevdata }, setProps] = useState<{
    currentPage: number;
    pageSize: number;
    prevdata: PaginatedData<Resp>;
  }>({
    currentPage: props.currentPage ?? TABLE_PAGE,
    pageSize: props.pageSize ?? TABLE_PAGE_SIZE,
    prevdata: { data: ([] as unknown) as Resp, total: undefined },
  });

  const query = useInfiniteQuery(
    [queryid, pageSize],
    async ({ pageParam = currentPage }): Promise<PaginatedData<Resp>> => {
      const data = await queryFn(pageParam, pageSize);
      const totalval = typeof total === 'function' ? await total(data) : total;
      return { data: data, total: totalval };
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      onSuccess: (resp) => onSuccess?.(convertToDataRecord(resp)[currentPage]) ?? undefined,
      onError: onError,
    }
  );

  /**
   * Converts Data recieved from query to Dictionary of Data
   *
   * @param {InfiniteData} infdata - data from query
   * @returns {Dictionary} - converted Dictionary of Data
   */
  function convertToDataRecord(infdata: InfiniteData<PaginatedData<Resp>>) {
    return infdata.pages.reduce((acc: DataDictionary<Resp>, data, index): DataDictionary<Resp> => {
      const page = (infdata.pageParams[index] as number | undefined) ?? TABLE_PAGE;
      return { ...acc, [page]: data };
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

  const tabledata: PaginatedData<Resp> = useMemo(
    () => (data[currentPage] as PaginatedData<Resp> | undefined) ?? prevdata,
    [currentPage, data, prevdata]
  );

  return children({
    datasource: onSelect?.(tabledata.data) ?? ((tabledata.data as unknown) as T[]),
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
