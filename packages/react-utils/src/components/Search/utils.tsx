import { trimStart } from 'lodash';
import queryString from 'querystring';
import { ChangeEvent } from 'react';
import { PathMatch, Location } from 'react-router';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

/** call handler function after this many milliseconds since when it was last invoked */
export const DEBOUNCE_HANDLER_MS = 1000;

/**
 * Get query params from URL
 *
 * @param {Location} location from props
 */
export const getQueryParams = (location: Location) => {
  return queryString.parse(trimStart(location.search, '?'));
};

/** function type for custom onChangeHandler functions */
export type OnChangeType = (event: ChangeEvent<HTMLInputElement>) => void;

/**
 * A callback helper to add filter text to url
 *
 * @param queryParam - the string to be used as the key when constructing searchParams
 * @param props - the component props; should include RouteComponentProps
 */
export const createChangeHandler = (queryParam: string, location: Location) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;
    console.log({location})

    const allQueryParams = getQueryParams(location);
    if (targetValue) {
      allQueryParams[queryParam] = targetValue;
    } else {
      delete allQueryParams[queryParam];
    }

    console.log(`${location.pathname}?${queryString.stringify(allQueryParams)}`);
    history.push(`${location.pathname}?${queryString.stringify(allQueryParams)}`);
  };
};
