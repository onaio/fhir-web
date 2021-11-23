import { useCallback, useEffect, useMemo, useState } from 'react';
import { Dictionary } from '@onaio/utils';
import { InfiniteData, useInfiniteQuery } from 'react-query';
import { UseInfiniteQueryOptions } from 'react-query/react';
import { TableProps } from '../TableLayout';
import { TABLE_PAGE, TABLE_PAGE_SIZE } from '../../constants';

export type PaginatedData<T> = { data: T; total?: number };
export type DataDictionary<T> = Dictionary<PaginatedData<T>>;
export type TotalSizeGetterFun<TResponse> = (
  data: TResponse,
  page: number,
  pageSize: number,
  queryString?: string
) => Promise<number> | number;
export type TotalSize<TResponse> = number | TotalSizeGetterFun<TResponse>;

/** type for the children render props */
export type ChildrenRPPropsType<T> = TableProps<T> & {
  fetchNextPage: Function;
  fetchPreviousPage: Function;
};
export type ChildrenRPType<T> = (props: ChildrenRPPropsType<T>) => JSX.Element;

export interface PaginateData<T, TResp = T[]> {
  onSuccess?: (response: PaginatedData<TResp>) => void;
  onError?: (error: unknown) => void;
  onSelect?: (response: TResp) => T[];
  queryFn: (currentPage: number, pageSize: number, queryString?: string) => Promise<TResp> | TResp;
  queryOptions?: UseInfiniteQueryOptions<PaginatedData<TResp>>;
  queryId: string;
  currentPage?: number;
  pageSize?: number;
  queryPram?: Dictionary;
  total?: TotalSize<TResp>;
  children: ChildrenRPType<T>;
}

interface PaginateDataState<TResponse> {
  currentPage: number;
  pageSize: number;
  prevData: PaginatedData<TResponse>;
  queryPram?: Dictionary;
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
    queryId,
    onSuccess,
    onSelect,
    children,
    queryOptions,
    pageSize,
    queryKeys,
  } = props;
  const [currentPage, updateCurrentPage] = useState<number>(0);

  // const [paginationState, setPaginationState] = useState<PaginateDataState<Resp>>({
  //   e: props.currentPage ?? TABLE_PAGE,
  //   // pageSize: props.pageSize ?? TABLE_PAGE_SIZE,
  //   // prevData: { data: ([] as unknown) as Resp, total: undefined },
  //   // queryPram: props.queryPram,
  // });
  // const { currentPage, pageSize, prevData, queryPram } = paginationState;

  const query = useInfiniteQuery(
    [...queryKeys, pageSize],
    async ({ pageParam = currentPage }): Promise<PaginatedData<Resp>> => {
      // const queryString =
      //   queryPram &&
      //   Object.entries(queryPram).reduce(
      //     (acc, [key, val]) => acc + (val !== '' && val !== undefined ? `&${key}=${val}` : ''),
      //     ''
      //   );
      const data = await queryFn({ currentPage: pageParam, pageSize });
      const totalVal =
        typeof total === 'function' ? await total(data, currentPage, pageSize) : total;
      return { data, total: totalVal };
    },
    {
      onSuccess: (resp) => onSuccess?.(convertToDataRecord(resp)[currentPage]) ?? undefined, // this can be merged into single props
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
      setPaginationState((prev) => ({ ...prev, currentPage: 1, queryPram: props.queryPram }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(props.queryPram)]);

  useEffect(() => {
    if (data[currentPage] === undefined) fetchPage();
  }, [currentPage, data, fetchPage]);

  const tabledata: PaginatedData<Resp> = useMemo(
    () => (data[currentPage] as PaginatedData<Resp> | undefined) ?? prevData,
    [currentPage, data]
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
        setPaginationState((prev) => ({
          ...prev,
          currentPage: page,
          pageSize: pagesize ?? pageSize,
          prevdata: tabledata,
        })),
    },
  });
}
