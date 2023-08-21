import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { ChangeEvent } from 'react';
import { Location, PathMatch } from 'react-router';

export const pageSizeQuery = 'pageSize';
export const pageQuery = 'page';
export const searchQuery = 'search';
export const viewDetailsQuery = 'viewDetails';

/**
 * get a string search param from url
 *
 * @param location - route information
 * @param paramKey - search param key
 */
export const getStringParam = (location: Location, paramKey: string) => {
  const sParams = new URLSearchParams(location.search);
  return sParams.get(paramKey);
};

/**
 * get a search param that's of Number from url
 *
 * @param location -  route information
 * @param paramKey - search param key
 * @param fallback - fallback if key not found, or malformed
 */
export const getNumberParam = (
  location: Location,
  paramKey: string,
  fallback: number | null = null
) => {
  const sParams = new URLSearchParams(location.search);
  const rawParamVal = sParams.get(paramKey);
  const paramVal = rawParamVal ? Number(rawParamVal) : NaN;
  return isNaN(paramVal) ? fallback : paramVal;
};

/** default page number when paginating client and server-side */
export const startingPage = 1;
/** default page size used when paginating client and server-side */
export const startingPageSize = 20;

/**
 * generates the next url after a search input
 *
 * @param event - the search event
 * @param location - location object
 * @param match - information on the matched url
 */
export const getNextUrlOnSearch = (
  event: ChangeEvent<HTMLInputElement>,
  location: Location,
  match: PathMatch
) => {
  const searchText = event.target.value;
  let nextUrl = match.pathname;
  const currentSParams = new URLSearchParams(location.search);

  if (searchText) {
    currentSParams.set(searchQuery, searchText);
    currentSParams.set(pageQuery, startingPage.toString());
    currentSParams.set(pageSizeQuery, startingPageSize.toString());
  } else {
    currentSParams.delete(searchQuery);
  }

  nextUrl = ''.concat(nextUrl, '?').concat(currentSParams.toString());
  return nextUrl;
};

/**
 * how should objects be matched against the search string
 *
 * @param obj - resource payload
 * @param search - the search string
 */
export const matchesOnName = <T extends IResource>(obj: T, search: string) => {
  const name = (obj as { name?: string }).name;
  if (name === undefined) {
    return false;
  }
  return name.toLowerCase().includes(search.toLowerCase());
};
