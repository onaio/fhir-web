import { trimStart } from 'lodash';
import queryString from 'querystring';
import { ChangeEvent } from 'react';
import { RouteComponentProps } from 'react-router';

// TODO - replace queryString(a node api) with an equivalent for the web. i.e URLSearchParams

/** call handler function after this many milliseconds since when it was last invoked */
export const DEBOUNCE_HANDLER_MS = 1000;

/**
 * Get query params from URL
 *
 * @param {Location} location from props
 */
export const getQueryParams = (location: RouteComponentProps['location']) => {
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
export const createChangeHandler = <T extends RouteComponentProps>(
  queryParam: string,
  props: T
) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;
    const allQueryParams = getQueryParams(props.location);
    if (targetValue) {
      allQueryParams[queryParam] = targetValue;
    } else {
      delete allQueryParams[queryParam];
    }

    props.history.push(`${props.match.url}?${queryString.stringify(allQueryParams)}`);
  };
};
