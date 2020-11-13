/** get the full product Catalogue
 */

import { store, makeAPIStateSelector } from '@opensrp/store';
import { OpenSRPService as GenericOpenSRPService } from '@opensrp/server-service';
import { OPENSRP_PRODUCT_CATALOGUE } from '../constants';
import { fetchProducts, ProductCatalogue } from '../ducks/productCatalogue';
import { Dictionary } from '@onaio/utils';

const sessionSelector = makeAPIStateSelector();
const OPENSRP_API_BASE_URL = '';
const accessToken = sessionSelector(store.getState(), { accessToken: true });
const PRODUCT_CATALOGUE_ENDPOINT = 'rest/product-catalogue';

/** OpenSRP service */
export class OpenSRPService extends GenericOpenSRPService {
  constructor(endpoint: string, baseURL: string = OPENSRP_API_BASE_URL) {
    super(accessToken, baseURL, endpoint);
  }
}

/**
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchProducts}actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function loadProductCatalogue(
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchProducts = fetchProducts
) {
  const serve = new service(OPENSRP_PRODUCT_CATALOGUE);
  return serve
    .list()
    .then((response: ProductCatalogue[] | null) => {
      if (response === null || response.length === 0) {
        return Promise.reject(new Error('No products found in the catalogue'));
      }
      actionCreator(response);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * @param {number | string} id - id of the product to be fetched
 * @param {OpenSRPService} service - the opensrp service
 * @param {fetchProducts}actionCreator - Action creator; creates actions thad adds products to the store
 *
 * @returns {Promise<void>}
 */
export async function loadSingleProduct(
  id: number | string,
  service: typeof OpenSRPService = OpenSRPService,
  actionCreator: typeof fetchProducts = fetchProducts
) {
  const serve = new service(OPENSRP_PRODUCT_CATALOGUE);
  return serve
    .read(id)
    .then((response: ProductCatalogue | {}) => {
      if (Object.keys(response).length === 0) {
        return Promise.reject(new Error('No products found in the catalogue'));
      }
      actionCreator([response as ProductCatalogue]);
    })
    .catch((err: Error) => {
      throw err;
    });
}

/**
 * @param {Dictionary} payload - the payload
 * @returns {Promise<void>}
 */
export async function postProduct(payload: Dictionary) {
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
  const bearer = `Bearer ${accessToken}`;
  const promise = fetch(`${OPENSRP_API_BASE_URL}${PRODUCT_CATALOGUE_ENDPOINT}`, {
    body: data,
    headers: {
      Authorization: bearer,
    },
    method: 'POST',
  });
  return promise;
}

/**
 * @param {Dictionary} payload - the payload
 * @returns {Promise<void>}
 */
export async function putProduct(payload: Dictionary) {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      data.append(key, value, value.name);
      return;
    }
    data.append(key, value);
  });
  const bearer = `Bearer ${accessToken}`;
  const promise = fetch(`${OPENSRP_API_BASE_URL}${PRODUCT_CATALOGUE_ENDPOINT}`, {
    body: data,
    headers: {
      Authorization: bearer,
    },
    method: 'PUT',
  });
  return promise;
}
