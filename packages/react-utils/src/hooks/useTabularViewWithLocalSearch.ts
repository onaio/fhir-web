import { ChangeEvent, useCallback } from 'react';
import { getQueryParams } from '../components/Search/utils';
import { getResourcesFromBundle } from '../helpers/utils';
import { useQuery } from 'react-query';
import { getConfig } from '@opensrp/pkg-config';
import { useNavigate, useLocation, useMatch, useMatches, PathMatch } from 'react-router';
import type { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/resource';
import { URLParams } from '@opensrp/server-service';
import { loadAllResources } from '../helpers/fhir-utils';
import {
  getNextUrlOnSearch,
  getNumberParam,
  getStringParam,
  matchesOnName,
  pageQuery,
  pageSizeQuery,
  searchQuery,
  startingPage,
  startingPageSize,
} from './utils';

/**
 * Re-usable hook that abstracts search and table pagination for usual list view component
 * Should only be used when getting data from a server that follows the hapi FHIR spec
 *
 * @param fhirBaseUrl - fhir server baser url
 * @param resourceType - resource type as endpoint
 * @param extraParams - further custom search param filters during api requests
 * @param matchesSearch -  function that computes whether a resource payload should be matched by search
 */
export function useTabularViewWithLocalSearch<T extends Resource>(
  fhirBaseUrl: string,
  resourceType: string,
  extraParams: URLParams | ((search: string | null) => URLParams) = {},
  matchesSearch: (obj: T, search: string) => boolean = matchesOnName
) {
  const location = useLocation();
  console.log({ location})
  const navigate = useNavigate();
  // const match = useMatch(location);

  // console.log(match)

  const page = getNumberParam(location, pageQuery, startingPage) as number;
  const search = getStringParam(location, searchQuery);
  console.log({ searchQuery })
  console.log({ page, search })
  const defaultPageSize =
    (getConfig('defaultTablesPageSize') as number | undefined) ?? startingPageSize;
  const pageSize = getNumberParam(location, pageSizeQuery, defaultPageSize) as number;

  type TRQuery = [string, URLParams];
  type QueryKeyType = { queryKey: TRQuery };

  const queryFn = useCallback(
    async ({ queryKey: [_, extraParams] }: QueryKeyType) => {
      return loadAllResources(fhirBaseUrl, resourceType, extraParams);
    },
    [fhirBaseUrl, resourceType]
  );

  const rQuery = {
    queryKey: [resourceType, extraParams] as TRQuery,
    queryFn,
    select: (data: IBundle) => getResourcesFromBundle<T>(data),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  };

  const { data, ...restQueryValues } = useQuery(rQuery);
  let filteredData = data;
  if (search) {
    filteredData = data?.filter((obj) => {
      return matchesSearch(obj, search);
    });
  }

  const searchFormProps = {
    defaultValue: getQueryParams(location)[searchQuery],
    onChangeHandler: function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
      const nextUrl = getNextUrlOnSearch(event, location);
      navigate(nextUrl);
    },
  };

  const tablePaginationProps = {
    current: page,
    pageSize,
    total: filteredData?.length,
    defaultPageSize,
    onChange: (current: number, pageSize?: number) => {
      if (current && pageSize) {
        const newSParams = new URLSearchParams(location.search);
        newSParams.set(pageSizeQuery, pageSize.toString());
        newSParams.set(pageQuery, current.toString());
        console.log(`${location.pathname}?${newSParams.toString()}`);
        navigate(`${location.pathname}?${newSParams.toString()}`);
      }
    },
  };

  return {
    tablePaginationProps,
    queryValues: {
      data: filteredData,
      ...restQueryValues,
    },
    searchFormProps,
  };
}
