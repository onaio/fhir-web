import { store, makeAPIStateSelector } from '@opensrp/store';
import {
  getFetchOptions,
  OpenSRPService as GenericOpenSRPService,
  OPENSRP_API_BASE_URL,
} from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';

const sessionSelector = makeAPIStateSelector();

/** OpenSRP service Generic class */
export class OpenSRPService<T extends object = Dictionary> extends GenericOpenSRPService<T> {
  /**
   *
   * @param {string} endpoint - the OpenSRP endpoint
   * @param {string} baseURL - base OpenSRP API URL
   * @param {Function} fetchOptions - function to return options to be passed to request
   */
  constructor(
    endpoint: string,
    baseURL: string = OPENSRP_API_BASE_URL,
    fetchOptions: typeof getFetchOptions = getFetchOptions
  ) {
    const accessToken = sessionSelector(store.getState(), { accessToken: true });
    super(accessToken, baseURL, endpoint, fetchOptions);
  }
}
