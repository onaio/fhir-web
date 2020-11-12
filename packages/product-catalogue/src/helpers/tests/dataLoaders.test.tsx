import { product1, products } from '../../ducks/productCatalogue/tests/fixtures';
import { loadProductCatalogue, loadSingleProduct, postProduct, putProduct } from '../dataLoaders';
import * as catalogueDux from '../../ducks/productCatalogue';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('dataLoading', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('load loadProductCatalogue works correctly', async () => {
    fetch.once(JSON.stringify(products));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');
    loadProductCatalogue().catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    // calls the correct endpoint
    expect(creatorSpy).toHaveBeenCalledWith(products);
    creatorSpy.mockRestore();
  });

  it('load loadSingleProduct works correctly', async () => {
    fetch.once(JSON.stringify(product1));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');
    loadSingleProduct('1').catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    // calls the correct endpoint
    expect(creatorSpy).toHaveBeenCalledWith([product1]);
    creatorSpy.mockRestore();
  });

  it('postProduct works correctly', async () => {
    fetch.once(JSON.stringify({}));
    const mockPayload = { name: 'Ghost' };
    postProduct(mockPayload).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    const body = fetch.mock.calls[0][1].body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyObject = (Object as any).fromEntries(body);
    expect(bodyObject).toEqual(mockPayload);
  });

  it('putProduct works correctly', async () => {
    fetch.once(JSON.stringify({}));
    const mockPayload = { name: 'Ghost' };
    putProduct(mockPayload).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    const body = fetch.mock.calls[0][1].body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyObject = (Object as any).fromEntries(body);
    expect(bodyObject).toEqual(mockPayload);
  });
});
