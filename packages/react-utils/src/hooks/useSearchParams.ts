import { useHistory, useLocation, useRouteMatch } from 'react-router';

/**
 * Commit search param changes directly to history.
 * TODO: - can be replaced with useSearchParams equivalent once we update to react-router v6.4.0
 */
export function useSearchParams() {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();

  let nextUrl = match.path;
  const sParams = new URLSearchParams(location.search);

  const addParam = (queryKey: string, value?: string) => {
    if (!value) {
      return;
    }

    const keys = sParams.keys();
    const keysArray = Array.from(keys);

    if (keysArray.length > 2 || keysArray.length < 2) {
      sParams.delete(keysArray[keysArray.length - 1]);
    }

    sParams.append(queryKey, value);
    const newParams = sParams.toString();
    nextUrl = ''.concat(nextUrl, '?').concat(newParams.toString());
    history.push(nextUrl);
  };

  const removeParam = (queryKey: string) => {
    sParams.delete(queryKey);
    const newParams = sParams.toString();
    nextUrl = ''.concat(nextUrl, '?').concat(newParams.toString());
    history.push(nextUrl);
  };

  return {
    sParams,
    addParam,
    removeParam,
  };
}
