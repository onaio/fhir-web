import { eusmPlans } from '../../ducks/planDefinitions/tests/fixtures';
import {
  loadAssignments,
  loadOrganizations,
  loadPlans,
  putJurisdictionsToPlan,
  OpenSRPService,
  updateAssignments,
  loadJurisdictions,
} from '../dataLoaders';
import * as plansDux from '../../ducks/planDefinitions';
import { COULD_NOT_LOAD_ASSIGNMENTS } from '../../lang';

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

  it('load assignment handles errors', () => {
    const errMessage = 'An error has happened';
    fetch.mockReject(new Error(errMessage));

    loadAssignments(mockBaseURL, 'planId').catch((e) => {
      expect(e.message).toEqual(errMessage);
    });
    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify(null));
    loadAssignments(mockBaseURL, 'planId').catch((e) => {
      expect(e.message).toEqual(COULD_NOT_LOAD_ASSIGNMENTS);
    });
  });

  it('load organizations handles errors', () => {
    const errMessage = 'An error has happened';
    fetch.mockReject(new Error(errMessage));

    loadOrganizations(mockBaseURL).catch((e) => {
      expect(e.message).toEqual(errMessage);
    });
  });

  it('load organization where response is null', async () => {
    fetch.once(JSON.stringify(null));
    const mockCreator = jest.fn();

    loadOrganizations(mockBaseURL, OpenSRPService, mockCreator).catch((e) => {
      throw e;
    });

    await new Promise((resolve) => setImmediate(resolve));
    expect(mockCreator).not.toHaveBeenCalled();
  });

  it('put jurisdiction to plan works correctly', async () => {
    fetch.mockResponse(JSON.stringify({}));
    // with jurisdictions
    const mockPlan = { jurisdiction: [{ code: 'code1' }] };
    const mockPlanCreator = jest.fn();
    putJurisdictionsToPlan(
      mockBaseURL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPlan as any,
      ['code2'],
      true,
      OpenSRPService,
      mockPlanCreator
    ).catch(() => {
      return;
    });
    await new Promise((resolve) => setImmediate(resolve));
    let expectedMockedPlan = {
      ...mockPlan,
      jurisdiction: [{ code: 'code1' }, { code: 'code2' }],
    };
    expect(mockPlanCreator).toHaveBeenCalledWith([expectedMockedPlan]);

    jest.resetAllMocks();
    putJurisdictionsToPlan(
      mockBaseURL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPlan as any,
      ['code2'],
      false,
      OpenSRPService,
      mockPlanCreator
    ).catch(() => {
      return;
    });
    await new Promise((resolve) => setImmediate(resolve));
    expectedMockedPlan = {
      ...mockPlan,
      jurisdiction: [{ code: 'code2' }],
    };
    expect(mockPlanCreator).toHaveBeenCalledWith([expectedMockedPlan]);

    jest.resetAllMocks();
    fetch.resetMocks();
    const errMessage = 'An error has happened';
    fetch.mockReject(new Error(errMessage));

    putJurisdictionsToPlan(
      mockBaseURL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockPlan as any,
      ['code2']
    ).catch((e) => {
      expect(e.message).toEqual(errMessage);
    });
  });

  it('Update assignment still works when error', () => {
    const errMessage = 'An error has happened';
    fetch.mockReject(new Error(errMessage));

    updateAssignments(mockBaseURL, []).catch((e) => {
      expect(e.message).toEqual(errMessage);
    });
  });

  it('Load jurisdictions still works when error', () => {
    const errMessage = 'An error has happened';
    fetch.mockReject(new Error(errMessage));

    loadJurisdictions(mockBaseURL, 2).catch((e) => {
      expect(e.message).toEqual(errMessage);
    });

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.com/restlocation/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:2',
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
});
