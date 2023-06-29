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

  const addParams = (keyValues: ParamKeyValuePairs) => {
    let nextUrl = match.path;
    for (const [key, value] of Object.entries(keyValues)) {
      if (value) {
        sParams.set(key, value);
      }
    }
    nextUrl = ''.concat(nextUrl, '?').concat(sParams.toString());
    history.push(nextUrl);
  };

  const removeParam = (queryKey: string) => {
    sParams.delete(queryKey);
    const newParams = sParams.toString();
    const nextUrl = ''.concat(match.path, '?').concat(newParams.toString());
    history.push(nextUrl);
  };

  return {
    sParams,
    addParam,
    addParams,
    removeParam,
  };
}
