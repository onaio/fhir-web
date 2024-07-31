import { ChangeEvent, useCallback, useState } from 'react';
import { getQueryParams } from '../components/Search/utils';
import { getResourcesFromBundle } from '../helpers/utils';
import { useQuery } from 'react-query';
import { getConfig } from '@opensrp/pkg-config';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { URLParams } from '@opensrp/server-service';
import {
  getNextUrlOnSearch,
  getNumberParam,
  getStringParam,
  loadResources,
  pageQuery,
  pageSizeQuery,
  searchQuery,
  startingPage,
  startingPageSize,
} from './utils';
import { SortOrder } from 'antd/es/table/interface';

export type ExtraParams = URLParams | ((search: string | null) => URLParams);

export type ExtractResources = <T>(bundle: IBundle) => T[];

const defaultGetExtraParams = (search: string | null) => {
  if (search) {
    return { 'name:contains': search };
  }
  return {};
};

export interface SortParamState {
  [dataIndex: string]: { paramAccessor: string; order: SortOrder } | undefined;
}
export interface FilterParamState {
  [dataIndex: string]: { paramAccessor: string; rawValue: unknown; paramValue: string } | undefined;
} // TODO - know the unknown

function SortParamsToSearchParams(sortState: SortParamState) {
  const sortString = Object.entries(sortState).reduce(
    (accumulator, [dataIndex, sortDescription], currIdx, fullArray) => {
      if (!sortDescription) {
        return accumulator;
      }
      const direction = sortDescription.order === 'descend' ? '-' : '';
      const sep = currIdx === fullArray.length - 1 ? '' : ',';
      accumulator += `${direction}${sortDescription.paramAccessor}${sep}`;
      return accumulator;
    },
    ''
  );
  if (sortString) {
    return {
      _sort: sortString,
    };
  } else {
    return {};
  }
}

function filterParamstoSearchParams(filterState: FilterParamState) {
  const filterParam = Object.entries(filterState).reduce(
    (accumulator, [dataIndex, filterDescription]) => {
      if (!filterDescription) {
        return accumulator;
      }
      accumulator[filterDescription.paramAccessor] = filterDescription.paramValue;
      return accumulator;
    },
    {} as URLParams
  );
  return filterParam;
}

/**
 * Re-usable hook that abstracts search and table pagination for usual list view component
 * Should only be used when getting data from a server that follows the hapi FHIR spec
 *
 * @param fhirBaseUrl - fhir server baser url
 * @param resourceType - resource type as endpoint
 * @param extraParams - further custom search param filters during api requests
 * @param extractResources - function to get desired resources
 */
export function useSimpleTabularView<T extends Resource>(
  fhirBaseUrl: string,
  resourceType: string,
  extraParams: URLParams | ((search: string | null) => URLParams) = defaultGetExtraParams,
  extractResources: ExtractResources = getResourcesFromBundle,
  defaultSortState: SortParamState = {},
  defaultFilterState: FilterParamState = {}
) {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const [sortState, setSortState] = useState<SortParamState>(defaultSortState);
  const [filterState, setFilterState] = useState<FilterParamState>(defaultFilterState);

  const page = getNumberParam(location, pageQuery, startingPage) as number;
  const search = getStringParam(location, searchQuery);
  const defaultPageSize =
    (getConfig('defaultTablesPageSize') as number | undefined) ?? startingPageSize;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize) as number;

  type TRQuery = [string, URLParams];
  type QueryKeyType = { queryKey: TRQuery };

  // curate filter search params
  let otherParams: URLParams =
    typeof extraParams === 'function' ? extraParams(search) : extraParams;
  otherParams = {
    ...otherParams,
    ...SortParamsToSearchParams(sortState),
    ...filterParamstoSearchParams(filterState),
    _total: 'accurate',
    _getpagesoffset: (page - 1) * pageSize,
    _count: pageSize,
  };

  const queryFn = useCallback(
    async ({ queryKey: [_, otherParams] }: QueryKeyType) => {
      return loadResources(fhirBaseUrl, resourceType, otherParams).then((res) => {
        return res;
      });
    },
    [fhirBaseUrl, resourceType]
  );

  const rQuery = {
    queryKey: [resourceType, otherParams] as TRQuery,
    queryFn,
    select: (data: IBundle) => {
      return {
        records: extractResources<T>(data),
        total: data.total ?? 0,
      };
    },
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };
  const { data, ...restQueryValues } = useQuery(rQuery);

  const searchFormProps = {
    wrapperClassName: 'elongate-search-bar',
    defaultValue: getQueryParams(location)[searchQuery],
    onChangeHandler: function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
      const nextUrl = getNextUrlOnSearch(event, location, match);
      history.push(nextUrl);
    },
  };

  const tablePaginationProps = {
    current: page,
    pageSize,
    total: data?.total,
    defaultPageSize,
    onChange: (current: number, pageSize?: number) => {
      if (current && pageSize) {
        const newSParams = new URLSearchParams(location.search);
        newSParams.set(pageSizeQuery, pageSize.toString());
        newSParams.set(pageQuery, current.toString());
        history.push(`${match.url}?${newSParams.toString()}`);
      }
    },
  };

  const sanitizeParams = (
    origState: SortParamState | FilterParamState,
    state: SortParamState | FilterParamState
  ) => {
    const newSortState = { ...origState, ...state };
    const sanitizedState: SortParamState | FilterParamState = {};
    for (const dataIdx in newSortState) {
      if (newSortState[dataIdx]) {
        sanitizedState[dataIdx] = newSortState[dataIdx];
      }
    }
    return sanitizedState;
  };

  const updateSortParams = useCallback(
    (state: SortParamState) => {
      const sanitized = sanitizeParams(sortState, state) as SortParamState;
      setSortState(sanitized);
    },
    [setSortState]
  );

  const updateFilterParams = useCallback(
    (state: FilterParamState) => {
      const sanitized = sanitizeParams(filterState, state) as FilterParamState;
      setFilterState(sanitized);
    },
    [setFilterState]
  );

  const getControlledSortProps = (dataIndex: string) => {
    const sortColumnProps = sortState[dataIndex];
    if (sortColumnProps) {
      return {
        sortOrder: sortState[dataIndex]?.order,
        sortDirections: ['ascend' as const, 'descend' as const],
      };
    } else {
      return {};
    }
  };

  return {
    tablePaginationProps,
    sortOptions: {
      updateSortParams,
      getControlledSortProps,
      currentParams: otherParams,
      sortState,
    },
    filterOptions: { updateFilterParams, currentFilters: filterState, currentParams: otherParams },
    queryValues: {
      data,
      ...restQueryValues,
    },
    searchFormProps,
  };
}

const useServerSideActionsDataGrid = useSimpleTabularView;
export { useServerSideActionsDataGrid };
