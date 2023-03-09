import { ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router';

export const pageSizeQuery = 'pageSize';
export const pageQuery = 'page';
export const searchQuery = 'search';

/**
 * get a string search param from url
 *
 * @param location - route information
 * @param paramKey - search param key
 */
export const getStringParam = (location: RouteComponentProps['location'], paramKey: string) => {
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
  location: RouteComponentProps['location'],
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
  location: RouteComponentProps['location'],
  match: RouteComponentProps['match']
) => {
  const searchText = event.target.value;
  let nextUrl = match.url;
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
