import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { deprecate } from 'util';

export type ParamKeyValuePairs = Record<string, string | undefined>;
/**
 * Commit search param changes directly to history.
 * TODO: - can be replaced with useSearchParams equivalent once we update to react-router v6.4.0
 */
export function useSearchParams() {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  const sParams = new URLSearchParams(location.search);

  const addParam = deprecate((queryKey: string, value?: string) => {
    if (!value) {
      return;
    }
    const params = {
      [queryKey]: value,
    };
    addParams(params);
  }, 'addParam is now deprecated, and will be removed in the future, consider using addParams');

  const addParamsBase = (keyValues: ParamKeyValuePairs, nextUrl: string) => {
    for (const [key, value] of Object.entries(keyValues)) {
      if (value) {
        sParams.set(key, value);
      }
    }
    nextUrl = ''.concat(nextUrl, '?').concat(sParams.toString());
    history.push(nextUrl);
  };

  const addParams = (keyValues: ParamKeyValuePairs) => {
    return addParamsBase(keyValues, match.path);
  };

  /**
   * similar to addParams but considers router params
   * Maybe this should be the addParams
   * Should test out if this is used instead could break anything
   *
   * @param keyValues - an object of url params to add
   */
  const addParamsToURL = (keyValues: ParamKeyValuePairs) => {
    return addParamsBase(keyValues, location.pathname);
  };

  const removeParamBase = (queryKey: string, baseUrl: string) => {
    sParams.delete(queryKey);
    const newParams = sParams.toString();
    const nextUrl = ''.concat(baseUrl, '?').concat(newParams.toString());
    history.push(nextUrl);
  };

  const removeParam = (queryKey: string) => {
    return removeParamBase(queryKey, match.path);
  };

  const removeURLParam = (queryKey: string) => {
    return removeParamBase(queryKey, location.pathname);
  };

  return {
    sParams,
    addParam,
    addParams,
    removeParam,
    addParamsToURL,
    removeURLParam,
  };
}
