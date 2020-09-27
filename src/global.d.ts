import { Dictionary } from '@onaio/utils';
/** declare globals interface */
declare global {
  interface Window {
    __PRELOADED_STATE__: Dictionary;
    location: Location;
  }
}
