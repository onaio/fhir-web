import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { TableProps } from '../TableLayout';

const defaultcurrentPage = 1;
const defaultpageSize = 5;

type Data<T> = { data: T; total?: number };
type DataRecord<T> = Dictionary<Data<T>>;

interface PaginateData<T> {
  onSuccess?: (response: Data<T[]>) => void;
  onError?: (error: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: (response?: any) => T[];
  queryFn: (currentPage: number, pageSize: number) => Promise<DataRecord<T[]>>;
  queryid: string;
  currentPage?: number;
  pageSize?: number;
  total?: number | ((data: DataRecord<T[]>) => Promise<number> | number);
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
    prevdata: Data<T[]>;
  }>({
    currentPage: props.currentPage ?? defaultcurrentPage,
    pageSize: props.pageSize ?? defaultpageSize,
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
    infdata: InfiniteData<{ data: DataRecord<T[]>; total: number | undefined }>
  ): DataRecord<T[]> {
    return infdata.pages.reduce((acc: DataRecord<T[]>, data, index) => {
      const page = (infdata.pageParams[index] as number | undefined) ?? defaultcurrentPage;
      return { ...acc, [page]: data } as DataRecord<T[]>;
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

  const tabledata: Data<T[]> = useMemo(
    () => (data[currentPage] as Data<T[]> | undefined) ?? prevdata,
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
        setTableprops({ currentPage: page, pageSize: pagesize ?? pageSize, prevdata: tabledata }),
    },
  });
}
