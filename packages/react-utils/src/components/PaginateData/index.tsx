import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { UseInfiniteQueryOptions } from 'react-query/react';
import { TableProps } from '../TableLayout';
import { TABLE_PAGE, TABLE_PAGE_SIZE } from '../../constants';

export type PaginatedData<T> = { data: T; total?: number; queryPram?: Dictionary };
export type DataDictionary<T> = Dictionary<PaginatedData<T>>;

interface PaginateData<T, resp = T[]> {
  onSuccess?: (response: PaginatedData<resp>) => void;
  onError?: (error: unknown) => void;
  onSelect?: (response: resp) => T[];
  queryFn: (currentPage: number, pageSize: number, queryString?: string) => Promise<resp> | resp;
  queryOptions?: UseInfiniteQueryOptions<PaginatedData<resp>>;
  queryid: string;
  currentPage?: number;
  pageSize?: number;
  queryPram?: Dictionary;
  total?:
    | number
    | ((
        data: resp,
        page: number,
        pageSize: number,
        queryString?: string
      ) => Promise<number> | number);
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
  const {
    total,
    onError,
    queryFn,
    queryid,
    onSuccess,
    onSelect,
    children,
    queryOptions,
    queryPram,
  } = props;

  const [{ currentPage, pageSize, prevdata }, setProps] = useState<{
    currentPage: number;
    pageSize: number;
    prevdata: PaginatedData<Resp>;
  }>({
    currentPage: props.currentPage ?? TABLE_PAGE,
    pageSize: props.pageSize ?? TABLE_PAGE_SIZE,
    prevdata: { data: ([] as unknown) as Resp, total: undefined, queryPram: props.queryPram },
  });

  const query = useInfiniteQuery(
    [queryid, pageSize, queryPram],
    async ({ pageParam = currentPage }): Promise<PaginatedData<Resp>> => {
      const queryString =
        queryPram &&
        Object.entries(queryPram).reduce(
          (acc, [key, val]) => acc + (val || val === 0 ? `&${key}=${val}` : ''),
          ''
        );
      const data = await queryFn(pageParam, pageSize, queryString);
      const totalval =
        typeof total === 'function' ? await total(data, currentPage, pageSize, queryString) : total;
      return { data, total: totalval, queryPram };
    },
    {
      onSuccess: (resp) => onSuccess?.(convertToDataRecord(resp)[currentPage]) ?? undefined,
      onError: onError,
      ...queryOptions,
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
      const page =
        (infdata.pageParams[index] as number | undefined) ?? props.currentPage ?? TABLE_PAGE;
      return { ...acc, [page]: data };
    }, {});
  }

  const data = query.data ? convertToDataRecord(query.data) : {};

  const fetchPage = useCallback(
    (page = currentPage) => {
      if (!query.isFetchingNextPage && !query.isFetching && !query.isError)
        query.fetchNextPage({ pageParam: page, throwOnError: true }).catch(onError);
    },
    [currentPage, query, onError]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setProps((prev) => ({ ...prev, currentPage: 1 })), [JSON.stringify(queryPram)]);

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
      pageSize,
      total: tabledata.total,
      current: currentPage,
      onChange: (page, pagesize) =>
        setProps({ currentPage: page, pageSize: pagesize ?? pageSize, prevdata: tabledata }),
    },
  });
}
