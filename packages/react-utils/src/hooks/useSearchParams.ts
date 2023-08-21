import { useNavigate, useLocation, useMatch } from 'react-router';
import { deprecate } from 'util';

export type ParamKeyValuePairs = Record<string, string | undefined>;
/**
 * Commit search param changes directly to history.
 * TODO: - can be replaced with useSearchParams equivalent once we update to react-router v6.4.0
 */
export function useSearchParams() {
  const location = useLocation();
  const navigate = useNavigate();
  const match = useMatch(location.pathname);

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
    let nextUrl = match?.pathname;
    for (const [key, value] of Object.entries(keyValues)) {
      if (value) {
        sParams.set(key, value);
      }
    }
    nextUrl = ''.concat(nextUrl as string, '?').concat(sParams.toString());
    navigate(nextUrl);
  };

  const removeParam = (queryKey: string) => {
    sParams.delete(queryKey);
    const newParams = sParams.toString();
    const nextUrl = ''.concat((match?.pathname) as string, '?').concat(newParams.toString());
    navigate(nextUrl);
  };

  return {
    sParams,
    addParam,
    addParams,
    removeParam,
  };
}
