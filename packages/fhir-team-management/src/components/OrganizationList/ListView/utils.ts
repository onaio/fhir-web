import { Dictionary } from '@onaio/utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { RouteComponentProps } from 'react-router';
import { FHIRServiceClass } from '@opensrp/react-utils';

/**
 * get a number value from search params
 *
 * @param location -  the location object
 * @param paramKey - the search param key
 * @param fallback - if missing value
 */
export const getNumberSearchParam = (
  location: RouteComponentProps['location'],
  paramKey: string,
  fallback: number
) => {
  const sParams = new URLSearchParams(location.search);
  const rawParamVal = sParams.get(paramKey);
  const paramVal = rawParamVal ? Number(rawParamVal) : NaN;
  return isNaN(paramVal) ? fallback : paramVal;
};

/**
 * get value from search params
 *
 * @param location -  the location object
 * @param paramKey - the search param key
 */
export const getStringSearchParam = (
  location: RouteComponentProps['location'],
  paramKey: string
) => {
  const sParams = new URLSearchParams(location.search);
  return sParams.get(paramKey);
};

interface LoadResourceParams {
  page: number;
  pageSize: number;
  search: string | null;
}

/**
 * generically fetch a list of resources from fhir
 *
 * @param baseUrl - fhir server base url
 * @param resourceType - resource type as endpoint
 * @param params - addition filter and search params
 */
export const listDataFetcher = (
  baseUrl: string,
  resourceType: string,
  params: LoadResourceParams
) => {
  const { page, pageSize, search } = params;
  const filterParams: Dictionary = {
    _getpagesoffset: (page - 1) * pageSize,
    _count: pageSize,
  };
  if (search !== null) {
    filterParams['name:contains'] = search;
  }
  return new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(
    filterParams
  ) as Promise<IBundle>;
};
