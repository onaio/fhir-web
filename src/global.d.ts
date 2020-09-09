import { Dictionary } from '@onaio/utils';
/** declare globals interface */
declare global {
  const fetchMock: FetchMock;
  interface Window {
    fetchMock: FetchMock;
    fetch: FetchMock;
    __PRELOADED_STATE__: Dictionary;
  }
}
