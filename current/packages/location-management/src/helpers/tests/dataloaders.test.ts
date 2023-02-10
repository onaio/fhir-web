import {
  loadHierarchy,
  loadJurisdiction,
  loadJurisdictions,
  loadLocationTags,
  loadSettings,
  postPutLocationUnit,
} from '../dataLoaders';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import flushPromises from 'flush-promises';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

describe('src/helpers/dataloaders', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });
  afterEach(() => {
    fetch.resetMocks();
  });

  it('loadHierarchy', async () => {
    fetch.once(JSON.stringify([]));
    const mockRootId = 'mockRootId';
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadHierarchy(mockRootId, mockDispatcher, mockBaseUrl).catch((_: Error) => fail());

    await flushPromises();

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.comlocation/hierarchy/mockRootId?return_structure_count=false',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
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

    await flushPromises();

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/hierarchy/mockRootId?return_structure_count=false',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
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

    await flushPromises();
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

    await flushPromises();
  });

  it('loadJurisdictions', async () => {
    fetch.once(JSON.stringify([]));
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadJurisdictions(mockDispatcher, mockBaseUrl).catch((_: Error) => fail());

    await flushPromises();

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.comlocation/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('loadJurisdictions with adhoc endpoint', async () => {
    const sampleEndpoint = 'someLocationEndpoint';
    fetch.once(JSON.stringify([]));
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadJurisdictions(mockDispatcher, mockBaseUrl, {}, {}, sampleEndpoint).catch((_: Error) =>
      fail()
    );

    await flushPromises();

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.comsomeLocationEndpoint?',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
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

    await flushPromises();

    expect(mockDispatcher).toHaveBeenCalledWith([]);

    expect(fetch.mock.calls).toEqual([
      [
        'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
            'content-type': 'application/json;charset=UTF-8',
          },
          method: 'GET',
        },
      ],
    ]);
  });

  it('loadJurisdictions works with parentId url param', async () => {
    fetch.once(JSON.stringify([]));
    const mockBaseUrl = 'https://example.com/';
    const mockDispatcher = jest.fn();

    loadJurisdictions(
      mockDispatcher,
      mockBaseUrl,
      undefined,
      undefined,
      undefined,
      true // set filterByParentId
    ).catch((_: Error) => fail());

    await flushPromises();

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.com/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,parentId:null',
        {
          headers: {
            accept: 'application/json',
            authorization: 'Bearer sometoken',
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

    await flushPromises();
  });

  it('loadJurisdictions works with error', async () => {
    const errorMessage = 'Stuff hit the fan';
    fetch.mockReject(new Error(errorMessage));
    const mockDispatcher = jest.fn();
    const mockBaseUrl = 'https://example.com';

    loadJurisdictions(mockDispatcher, mockBaseUrl).catch((err: Error) =>
      expect(err.message).toEqual(errorMessage)
    );

    await flushPromises();
  });

  it('load jurisdiction dispatches when dispatcher and response', async () => {
    fetch.once(JSON.stringify({}));

    const mockDispatcher = jest.fn();
    loadJurisdiction('id', mockDispatcher).catch((_) => fail());

    await flushPromises();

    expect(mockDispatcher).toHaveBeenCalledWith({});
  });

  it('post put errors', async () => {
    const errorMessage = 'coughid';
    fetch.mockReject(new Error(errorMessage));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockPayload = {} as any;
    postPutLocationUnit(mockPayload, undefined, undefined, true).catch((err) => {
      expect(err.message).toEqual(errorMessage);
    });
    postPutLocationUnit(mockPayload, undefined, undefined, false).catch((err) => {
      expect(err.message).toEqual(errorMessage);
    });

    await flushPromises();
  });

  it('load location tags', async () => {
    const errorMessage = 'coughid';
    fetch.mockReject(new Error(errorMessage));

    const mockURL = '';
    loadLocationTags(mockURL).catch((err) => {
      expect(err.message).toEqual(errorMessage);
    });

    await flushPromises();
  });

  it('load settings uses callback only when present', async () => {
    fetch.mockResponse(JSON.stringify({}));

    const mockURL = '';
    loadSettings('settings endpoint', mockURL).catch((_) => {
      fail();
    });
    // no assertion here intentionally, we cannot check that a callback that
    // was not provided was called

    await flushPromises();
  });
});
