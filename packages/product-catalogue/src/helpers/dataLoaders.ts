/** get the full product Catalogue
 */

import { store, makeAPIStateSelector } from '@opensrp/store';
import { OpenSRPService as GenericOpenSRPService } from '@opensrp/server-service';
import { OPENSRP_API_BASE_URL, OPENSRP_PRODUCT_CATALOGUE } from '../constants';
import { fetchProducts, ProductCatalogue } from '../ducks/productCatalogue';
import { Dictionary } from '@onaio/utils';

const sessionSelector = makeAPIStateSelector();

/** OpenSRP service */
export class OpenSRPService extends GenericOpenSRPService {
  constructor(endpoint: string, baseURL: string = OPENSRP_API_BASE_URL) {
    const accessToken = sessionSelector(store.getState(), { accessToken: true });
    super(accessToken, baseURL, endpoint);
  }
}

/**
 * @param {string} baseURL -  base url of api
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchProducts}actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function loadProductCatalogue(
  baseURL: string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchProducts = fetchProducts
) {
  const serve = new service(OPENSRP_PRODUCT_CATALOGUE, baseURL);
  return serve
    .list()
    .then((response: ProductCatalogue[]) => {
      actionCreator(response);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * @param {string} baseURL -  base url of api
 * @param {number | string} id - id of the product to be fetched
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchProducts}actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function loadSingleProduct(
  baseURL: string,
  id: number | string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchProducts = fetchProducts
) {
  const serve = new service(OPENSRP_PRODUCT_CATALOGUE, baseURL);
  return serve
    .read(id)
    .then((response: ProductCatalogue | {}) => {
      if (Object.keys(response).length === 0) {
        return Promise.reject(new Error('Product not found in the catalogue'));
      }
      actionCreator([response as ProductCatalogue]);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * @param {string} baseURL - base url of the api
 * @param {Dictionary} payload - the payload
 * @returns {Promise<void>}
 */
export async function postProduct(baseURL: string, payload: Dictionary) {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      data.append(key, value, value.name);
      return;
    }
    if (key === 'uniqueId') {
      return;
    }
    data.append(key, value);
  });
  const accessToken = sessionSelector(store.getState(), { accessToken: true });
  const bearer = `Bearer ${accessToken}`;
  const promise = fetch(`${baseURL}${OPENSRP_PRODUCT_CATALOGUE}`, {
    body: data,
    headers: { accept: 'application/json', authorization: bearer },
    method: 'POST',
  });
  return promise;
}

/**
 * @param {string} baseURL - base url of the api
 * @param {Dictionary} payload - the payload
 * @returns {Promise<void>}
 */
export async function putProduct(baseURL: string, payload: Dictionary) {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      data.append(key, value, value.name);
      return;
    }
    data.append(key, value);
  });
  const accessToken = sessionSelector(store.getState(), { accessToken: true });
  const bearer = `Bearer ${accessToken}`;
  const promise = fetch(`${baseURL}${OPENSRP_PRODUCT_CATALOGUE}`, {
    body: data,
    headers: {
      accept: 'application/json',
      authorization: bearer,
    },
    method: 'PUT',
  });
  return promise;
}
