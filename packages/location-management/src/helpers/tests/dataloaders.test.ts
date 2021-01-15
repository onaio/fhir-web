import { loadHierarchy, loadJurisdictions } from '../dataLoaders';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('src/helpers/dataloaders', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('loadHierarchy', async () => {
    fetch.once(JSON.stringify([]));
    const mockRootId = 'mockRootId';
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadHierarchy(mockRootId, mockDispatcher, mockBaseUrl).catch((_: Error) => fail());

    await new Promise((resolve) => setImmediate(resolve));

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.comlocation/hierarchy/mockRootId?return_structure_count=false',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('loadHierarchy with default baseURL', async () => {
    fetch.once(JSON.stringify([]));
    const mockRootId = 'mockRootId';
    const mockDispatcher = jest.fn();

    loadHierarchy(mockRootId, mockDispatcher).catch((_: Error) => fail());

    await new Promise((resolve) => setImmediate(resolve));

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/mockRootId?return_structure_count=false',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('loadHierarchy returns response if dispatcher undefined', async () => {
    fetch.once(JSON.stringify([]));
    const mockRootId = 'mockRootId';
    const mockBaseUrl = 'https://example.com';

    loadHierarchy(mockRootId, undefined, mockBaseUrl)
      .then((res) => {
        expect(res).toEqual([]);
      })
      .catch((_: Error) => {
        fail();
      });

    await new Promise((resolve) => setImmediate(resolve));
  });

  it('loadHierarchy works with error', async () => {
    const errorMessage = 'Stuff hit the fan';
    fetch.mockReject(new Error(errorMessage));
    const mockRootId = 'mockRootId';
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadHierarchy(mockRootId, mockDispatcher, mockBaseUrl).catch((err: Error) =>
      expect(err.message).toEqual(errorMessage)
    );

    await new Promise((resolve) => setImmediate(resolve));
  });

  it('loadJurisdictions', async () => {
    fetch.once(JSON.stringify([]));
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadJurisdictions(mockDispatcher, mockBaseUrl).catch((_: Error) => fail());

    await new Promise((resolve) => setImmediate(resolve));

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.comlocation/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('loadJurisdictions with default baseURL', async () => {
    fetch.once(JSON.stringify([]));
    const mockDispatcher = jest.fn();

    loadJurisdictions(mockDispatcher).catch((_: Error) => fail());

    await new Promise((resolve) => setImmediate(resolve));

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer null',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('loadJurisdictions returns response if dispatcher undefined', async () => {
    fetch.once(JSON.stringify([]));
    const mockBaseUrl = 'https://example.com';

    loadJurisdictions(undefined, mockBaseUrl)
      .then((res) => {
        expect(res).toEqual([]);
      })
      .catch((_: Error) => fail());

    await new Promise((resolve) => setImmediate(resolve));
  });

  it('loadJurisdictions works with error', async () => {
    const errorMessage = 'Stuff hit the fan';
    fetch.mockReject(new Error(errorMessage));
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadJurisdictions(mockDispatcher, mockBaseUrl).catch((err: Error) =>
      expect(err.message).toEqual(errorMessage)
    );

    await new Promise((resolve) => setImmediate(resolve));
  });
});
