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

    expect(creatorSpy).toHaveBeenCalledWith(products);
    creatorSpy.mockRestore();
  });

  it('no products in api', async () => {
    fetch.once(JSON.stringify([]));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');

    loadProductCatalogue().catch((e) => {
      expect(e.message).toEqual('No products found in the catalogue');
    });

    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).not.toHaveBeenCalled();
    creatorSpy.mockRestore();
  });

  it('load loadSingleProduct works correctly', async () => {
    fetch.once(JSON.stringify(product1));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');
    loadSingleProduct('1').catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).toHaveBeenCalledWith([product1]);
    creatorSpy.mockRestore();
  });

  it('postProduct works correctly', async () => {
    fetch.once(JSON.stringify({}));
    const sampleFile = new File(['dummy'], 'dummy.txt');
    const mockPayload = { name: 'Ghost', file: sampleFile, uniqueId: '1' };
    postProduct(mockPayload).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    const body = fetch.mock.calls[0][1].body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyObject = (Object as any).fromEntries(body);
    expect(bodyObject).toEqual({ name: 'Ghost', file: sampleFile });
  });

  it('putProduct works correctly', async () => {
    fetch.once(JSON.stringify({}));
    const sampleFile = new File(['dummy'], 'dummy.txt');
    const mockPayload = { name: 'Ghost', file: sampleFile };
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
