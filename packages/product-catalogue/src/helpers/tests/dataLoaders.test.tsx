import { product1, products } from '../../ducks/productCatalogue/tests/fixtures';
import { loadProductCatalogue, loadSingleProduct, postProduct, putProduct } from '../dataLoaders';
import * as catalogueDux from '../../ducks/productCatalogue';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const mockBaseURL = 'https://example.com/rest';

describe('dataLoading', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('load loadProductCatalogue works correctly', async () => {
    fetch.once(JSON.stringify(products));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');
    loadProductCatalogue(mockBaseURL).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).toHaveBeenCalledWith(products);
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restproduct-catalogue',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
  });

  it('no products in api', async () => {
    fetch.once(JSON.stringify([]));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');

    loadProductCatalogue(mockBaseURL).catch((e) => {
      expect(e.message).toEqual('No products found in the catalogue');
    });

    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).not.toHaveBeenCalled();
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restproduct-catalogue',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
  });

  it('load loadSingleProduct works correctly', async () => {
    fetch.once(JSON.stringify(product1));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');
    loadSingleProduct(mockBaseURL, '1').catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).toHaveBeenCalledWith([product1]);
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restproduct-catalogue/1',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
  });

  it('load loadSingleProduct behaves when error', async () => {
    fetch.once(JSON.stringify({}));
    const creatorSpy = jest.spyOn(catalogueDux, 'fetchProducts');
    loadSingleProduct(mockBaseURL, '1').catch((e) => {
      expect(e.message).toEqual('No products found in the catalogue');
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).not.toHaveBeenCalled();
    creatorSpy.mockRestore();
  });

  it('postProduct works correctly', async () => {
    fetch.once(JSON.stringify({}));
    const sampleFile = new File(['dummy'], 'dummy.txt');
    const mockPayload = { name: 'Ghost', file: sampleFile, uniqueId: '1' };
    postProduct(mockBaseURL, mockPayload).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(fetch.mock.calls[0]).toMatchObject([
      'https://example.com/restproduct-catalogue',
      {
        body: expect.any(FormData),
        headers: {
          accept: 'application/json',
          authorization: 'Bearer null',
        },
        method: 'POST',
      },
    ]);

    const body = fetch.mock.calls[0][1].body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyObject = (Object as any).fromEntries(body);
    expect(bodyObject).toEqual({ name: 'Ghost', file: sampleFile });
  });

  it('putProduct works correctly', async () => {
    fetch.once(JSON.stringify({}));
    const sampleFile = new File(['dummy'], 'dummy.txt');
    const mockPayload = { name: 'Ghost', file: sampleFile };
    putProduct(mockBaseURL, mockPayload).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    const body = fetch.mock.calls[0][1].body;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bodyObject = (Object as any).fromEntries(body);
    expect(bodyObject).toEqual(mockPayload);
  });
});
