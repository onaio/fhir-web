import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { UseInfiniteQueryOptions } from 'react-query/react';
import { TableProps } from '../TableLayout';
import { TABLE_PAGE, TABLE_PAGE_SIZE } from '../../constants';

export type PaginatedData<T> = { data: T; total?: number };
export type DataDictionary<T> = Dictionary<PaginatedData<T>>;

export interface PaginateData<Data, Response = Data[], Error = unknown> {
  onSuccess?: (response: PaginatedData<Response>) => void;
  onError?: (error: Error) => void;
  onSelect?: (response: Response) => Data[];
  queryFn: (
    currentPage: number,
    pageSize: number,
    queryString?: string
  ) => Promise<Response> | Response;
  queryOptions?: Omit<
    UseInfiniteQueryOptions<
      PaginatedData<Response>,
      Error,
      PaginatedData<Response>,
      PaginatedData<Response>,
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
        data: Response,
        page: number,
        pageSize: number,
        queryString?: string
      ) => Promise<number> | number);
  children: (
    props: TableProps<Data> & {
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
export function PaginateData<Data extends object = Dictionary, Response = Data[]>(
  props: PaginateData<Data, Response>
) {
  const { total, onError, queryFn, queryid, onSuccess, onSelect, children, queryOptions } = props;

  const [{ currentPage, pageSize, prevdata, queryPram }, setProps] = useState<{
    currentPage: number;
    pageSize: number;
    prevdata: PaginatedData<Response>;
    queryPram?: Dictionary;
  }>({
    currentPage: props.currentPage ?? TABLE_PAGE,
    pageSize: props.pageSize ?? TABLE_PAGE_SIZE,
    prevdata: { data: ([] as unknown) as Response, total: undefined },
    queryPram: props.queryPram,
  });

  const query = useInfiniteQuery(
    [queryid, pageSize, queryPram],
    async ({ pageParam = currentPage }): Promise<PaginatedData<Response>> => {
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
      onSuccess: (resp) => onSuccess?.(convertToDataRecord(resp)[currentPage]),
      onError,
      ...queryOptions,
    }
  );

  /**
   * Converts Data recieved from query to Dictionary of Data
   *
   * @param {InfiniteData} infiniteData - data from query
   * @returns {Dictionary} - converted Dictionary of Data
   */
  function convertToDataRecord(infiniteData: InfiniteData<PaginatedData<Response>>) {
    return infiniteData.pages.reduce(
      (acc: DataDictionary<Response>, data, index): DataDictionary<Response> => {
        const page =
          (infiniteData.pageParams[index] as number | undefined) ?? props.currentPage ?? TABLE_PAGE;
        return { ...acc, [page]: data };
      },
      {}
    );
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

  const tabledata: PaginatedData<Response> = useMemo(
    () => (data[currentPage] as PaginatedData<Response> | undefined) ?? prevdata,
    [currentPage, data, prevdata]
  );

  return children({
    datasource: onSelect?.(tabledata.data) ?? ((tabledata.data as unknown) as Data[]),
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
