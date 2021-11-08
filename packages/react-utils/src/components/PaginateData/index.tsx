import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { UseInfiniteQueryOptions } from 'react-query/react';
import { TableProps } from '../TableLayout';
import { TABLE_PAGE, TABLE_PAGE_SIZE } from '../../constants';

export type PaginatedData<T> = { data: T; total?: number };
export type DataDictionary<T> = Dictionary<PaginatedData<T>>;

export interface PaginateData<T, resp = T[], Error = unknown> {
  onSuccess?: (response: PaginatedData<resp>) => void;
  onError?: (error: Error) => void;
  onSelect?: (response: resp) => T[];
  queryFn: (currentPage: number, pageSize: number, queryString?: string) => Promise<resp> | resp;
  queryOptions?: Omit<
    UseInfiniteQueryOptions<
      PaginatedData<resp>,
      Error,
      PaginatedData<resp>,
      PaginatedData<resp>,
      (string | number | Dictionary | undefined)[]
    >,
    'queryKey' | 'queryFn' | 'onSelect'
  >;
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
  const { total, onError, queryFn, queryid, onSuccess, onSelect, children, queryOptions } = props;

  const [{ currentPage, pageSize, prevdata, queryPram }, setProps] = useState<{
    currentPage: number;
    pageSize: number;
    prevdata: PaginatedData<Resp>;
    queryPram?: Dictionary;
  }>({
    currentPage: props.currentPage ?? TABLE_PAGE,
    pageSize: props.pageSize ?? TABLE_PAGE_SIZE,
    prevdata: { data: ([] as unknown) as Resp, total: undefined },
    queryPram: props.queryPram,
  });

  const query = useInfiniteQuery(
    [queryid, pageSize, queryPram],
    async ({ pageParam = currentPage }): Promise<PaginatedData<Resp>> => {
      const queryString =
        queryPram &&
        Object.entries(queryPram).reduce(
          (acc, [key, val]) => acc + (val !== '' && val !== undefined ? `&${key}=${val}` : ''),
          ''
        );
      const data = await queryFn(pageParam, pageSize, queryString);
      const totalval =
        typeof total === 'function' ? await total(data, currentPage, pageSize, queryString) : total;
      return { data, total: totalval };
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

  useEffect(() => {
    if (queryPram !== props.queryPram)
      setProps((prev) => ({ ...prev, currentPage: 1, queryPram: props.queryPram }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.queryPram)]);

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
        setProps((prev) => ({
          ...prev,
          currentPage: page,
          pageSize: pagesize ?? pageSize,
          prevdata: tabledata,
        })),
    },
  });
}
