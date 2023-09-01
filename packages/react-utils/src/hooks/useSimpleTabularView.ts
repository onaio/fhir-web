import { ChangeEvent, useCallback } from 'react';
import { FHIRServiceClass } from '../helpers/dataLoaders';
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
  pageQuery,
  pageSizeQuery,
  searchQuery,
  startingPage,
  startingPageSize,
} from './utils';

export interface FhirApiFilter {
  page: number;
  pageSize: number;
  search: string | null;
}

export type ExtraParams = URLParams | ((search: string | null) => URLParams);

const defaultGetExtraParams = (search: string | null) => {
  if (search) {
    return { 'name:contains': search };
  }
  return {};
};

/**
 * Unified function that gets a list of FHIR resources from a FHIR hapi server
 *
 * @param baseUrl - base url
 * @param resourceType - resource type as endpoint
 * @param params - our params
 * @param extraParams - any extra user-defined params
 */
const loadResources = async (
  baseUrl: string,
  resourceType: string,
  params: FhirApiFilter,
  extraParams: ExtraParams
) => {
  const { page, pageSize, search } = params;
  let filterParams: URLParams = {};

  let otherParams = extraParams;
  if (typeof extraParams === 'function') {
    otherParams = extraParams(search);
  }

  filterParams = {
    _total: 'accurate',
    ...filterParams,
    ...otherParams,
    _getpagesoffset: (page - 1) * pageSize,
    _count: pageSize,
  };
  const service = new FHIRServiceClass<IBundle>(baseUrl, resourceType);
  const res = await service.list(filterParams).catch((err) => {
    const isNameFilterErr = err.message.includes('HAPI-0524: Unknown search parameter');
    if (isNameFilterErr) {
      throw Error(
        `Name is not a natively supported filter for ${resourceType},\n please ask support to update SearchParameters to enable searching using 'name' filter.\n https://github.com/opensrp/web/issues/1249#issuecomment-1702701518 `
      );
    }
    throw err;
  });
  if (res.total === undefined) {
    // patient endpoint does not include total after _search response like other resource endpoints do
    const countFilter = {
      ...filterParams,
      _summary: 'count',
    };
    const { total } = await service.list(countFilter);
    res.total = total;
    return res;
  }
  return res;
};

/**
 * Re-usable hook that abstracts search and table pagination for usual list view component
 * Should only be used when getting data from a server that follows the hapi FHIR spec
 *
 * @param fhirBaseUrl - fhir server baser url
 * @param resourceType - resource type as endpoint
 * @param extraParams - further custom search param filters during api requests
 */
export function useSimpleTabularView<T extends Resource>(
  fhirBaseUrl: string,
  resourceType: string,
  extraParams: URLParams | ((search: string | null) => URLParams) = defaultGetExtraParams
) {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const page = getNumberParam(location, pageQuery, startingPage) as number;
  const search = getStringParam(location, searchQuery);
  const defaultPageSize =
    (getConfig('defaultTablesPageSize') as number | undefined) ?? startingPageSize;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize) as number;

  type TRQuery = [string, number, number, string, URLParams];
  type QueryKeyType = { queryKey: TRQuery };

  const queryFn = useCallback(
    async ({ queryKey: [_, page, pageSize, search, extraParams] }: QueryKeyType) => {
      return loadResources(fhirBaseUrl, resourceType, { page, pageSize, search }, extraParams);
    },
    [fhirBaseUrl, resourceType]
  );

  const rQuery = {
    queryKey: [resourceType, page, pageSize, search, extraParams] as TRQuery,
    queryFn,
    select: (data: IBundle) => ({
      records: getResourcesFromBundle<T>(data),
      total: data.total ?? 0,
    }),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };
  const { data, ...restQueryValues } = useQuery(rQuery);

  const searchFormProps = {
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

  return {
    tablePaginationProps,
    queryValues: {
      data,
      ...restQueryValues,
    },
    searchFormProps,
  };
}
