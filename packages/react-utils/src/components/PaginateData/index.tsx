import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { TableProps } from '../TableLayout';

const defaultcurrentPage = 1;
const defaultpageSize = 5;

interface PaginateData<T> {
  onSuccess?: (response: T[]) => void;
  onError?: (error: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/**
 * Loads Data in Paginated format
 *
 * @param {PaginateData} props - component props
 * @returns {Element} - component
 */
export function PaginateData<T extends object = Dictionary>(props: PaginateData<T>) {
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
  function convertToDataRecord(infdata: InfiniteData<T[]>): Dictionary<T[]> {
    return infdata.pages.reduce((acc: Dictionary<T[]>, data, index) => {
      const page = (infdata.pageParams[index] as number | undefined) ?? defaultcurrentPage;
      return { ...acc, [page]: data } as Dictionary<T[]>;
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

  const tabledata = useMemo(() => (data[currentPage] as T[] | undefined) ?? prevdata, [
    currentPage,
    data,
    prevdata,
  ]);

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
