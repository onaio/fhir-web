import { eusmPlans } from '../../ducks/planDefinitions/tests/fixtures';
import { loadPlans } from '../dataLoaders';
import * as plansDux from '../../ducks/planDefinitions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const mockBaseURL = 'https://example.com/rest';

describe('dataLoading', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  it('loadPlans works correctly', async () => {
    fetch.once(JSON.stringify(eusmPlans));
    const creatorSpy = jest.spyOn(plansDux, 'fetchPlanDefinitions');
    loadPlans(mockBaseURL).catch((e) => {
      throw e;
    });
    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).toHaveBeenCalledWith(eusmPlans);
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restplans',
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

  it('no plans in api', async () => {
    // empty list
    fetch.once(JSON.stringify([]));
    const creatorSpy = jest.spyOn(plansDux, 'fetchPlanDefinitions');

    loadPlans(mockBaseURL).catch((e) => {
      expect(e.message).toEqual('No data found');
    });

    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).toHaveBeenCalled();
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restplans',
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
  it('api returns null response', async () => {
    fetch.once(JSON.stringify(null));
    const creatorSpy = jest.spyOn(plansDux, 'fetchPlanDefinitions');

    loadPlans(mockBaseURL).catch((e) => {
      expect(e.message).toEqual('No data found');
    });

    await new Promise((resolve) => setImmediate(resolve));

    expect(creatorSpy).not.toHaveBeenCalled();
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restplans',
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
});
