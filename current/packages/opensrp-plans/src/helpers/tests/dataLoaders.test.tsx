import { eusmPlans } from '../../ducks/planDefinitions/tests/fixtures';
import {
  loadOrganizations,
  loadPlans,
  putJurisdictionsToPlan,
  OpenSRPService,
  updateAssignments,
  loadJurisdictions,
  retireAssignmentsByJur,
  getSingleJurisdictionPayload,
  loadAssignments,
} from '../dataLoaders';
import * as plansDux from '../../ducks/planDefinitions';
import { helperRawAssignment1, helperRawAssignment2, helperRawAssignment3 } from './fixtures';
import MockDate from 'mockdate';
import { processRawAssignments } from '@opensrp/team-assignment';
import flushPromises from 'flush-promises';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require('jest-fetch-mock');

const mockBaseURL = 'https://example.com/rest';

MockDate.set('12/30/2019');

describe('dataLoading', () => {
  afterEach(() => {
    fetch.resetMocks();
  });

  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'sometoken', state: 'abcde' } }
      )
    );
  });

  it('loadPlans works correctly', async () => {
    fetch.once(JSON.stringify(eusmPlans));
    const creatorSpy = jest.spyOn(plansDux, 'fetchPlanDefinitions');
    loadPlans(mockBaseURL).catch((e) => {
      throw e;
    });
    await flushPromises();

    expect(creatorSpy).toHaveBeenCalledWith(eusmPlans);
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restplans',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
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

    await flushPromises();

    expect(creatorSpy).toHaveBeenCalled();
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restplans',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
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

    await flushPromises();

    expect(creatorSpy).not.toHaveBeenCalled();
    creatorSpy.mockRestore();
    expect(fetch.mock.calls[0]).toEqual([
      'https://example.com/restplans',
      {
        headers: {
          accept: 'application/json',
          authorization: 'Bearer sometoken',
          'content-type': 'application/json;charset=UTF-8',
        },
        method: 'GET',
      },
    ]);
  });

  it('load assignment handles errors', async () => {
    const errMessage = 'An error has happened';
    fetch.mockReject(new Error(errMessage));

    loadAssignments(mockBaseURL, 'planId', undefined, undefined, (t) => t).catch((e) => {
      expect(e.message).toEqual(errMessage);
    });
    await flushPromises();

    fetch.resetMocks();
    fetch.mockResponse(JSON.stringify(null));
    loadAssignments(mockBaseURL, 'planId', undefined, undefined, (t) => t).catch((e) => {
      expect(e.message).toEqual('Could not load assignments');
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

    await flushPromises();
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
    await flushPromises();
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
    await flushPromises();
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

  it('Load jurisdictions still works when error', async () => {
    const errMessage = 'An error has happened';
    fetch.mockReject(new Error(errMessage));

    loadJurisdictions(mockBaseURL, 2).catch((e) => {
      expect(e.message).toEqual(errMessage);
    });
    await flushPromises();

    expect(fetch.mock.calls).toEqual([
      [
        'https://example.com/restlocation/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:2',
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
});

describe('helpers/dataLoaders.assignmentsPayloadCreation-retireAssignmentsByJur', () => {
  it('retiredAssignments payload where plan is different', () => {
    // existing assignments has an assignment that should be retired
    const selectedJurisdictions = ['0f38856a-6e0f', 'bf3c-a2ad8a53210'];
    const initialJurisdictions = ['0f38856a-6e0f', '9b5dd829-89de-45a5-98f2-fd37787ae949'];
    const planId = 'notExist';
    const existingAssignments = processRawAssignments([helperRawAssignment1, helperRawAssignment3]);
    const response = retireAssignmentsByJur(
      selectedJurisdictions,
      initialJurisdictions,
      existingAssignments,
      [],
      planId
    );
    // no assignment created de to the planId
    expect(response).toEqual([]);
  });

  it('retiredAssignments payload where plan and selected orgs are defined', () => {
    // existing assignments has an assignment that should be retired
    const selectedJurisdictions = ['0f38856a-6e0f', 'bf3c-a2ad8a53210'];
    const initialJurisdictions = ['0f38856a-6e0f', '9b5dd829-89de-45a5-98f2-fd37787ae949'];
    const planId = 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b';
    const existingAssignments = processRawAssignments([helperRawAssignment1, helperRawAssignment3]);
    const response = retireAssignmentsByJur(
      selectedJurisdictions,
      initialJurisdictions,
      existingAssignments,
      ['a2ad8a53210d'],
      planId
    );
    // no assignment created since selectedOrgs was defined but the orgId is not assigned to the removed jurisdiction
    expect(response).toEqual([]);
  });

  it('test payload creation for retired assignments due to jurisdictions', () => {
    // existing assignments has an assignment that should be retired
    const selectedJurisdictions = ['0f38856a-6e0f', 'bf3c-a2ad8a53210'];
    const initialJurisdictions = ['0f38856a-6e0f', '9b5dd829-89de-45a5-98f2-fd37787ae949'];
    const existingAssignments = processRawAssignments([helperRawAssignment1, helperRawAssignment3]);
    const response = retireAssignmentsByJur(
      selectedJurisdictions,
      initialJurisdictions,
      existingAssignments
    );
    // expect assignments with 9b5dd829-89de-45a5-98f2-fd37787ae949' to be retired, payload is one object
    expect(response).toEqual([
      {
        fromDate: '2020-12-15T22:00:00+00:00',
        jurisdiction: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        organization: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
        plan: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
        toDate: '2019-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('retiring assignments where removed jurs has several assignments', () => {
    // existing assignments has an assignment that should be retired
    const selectedJurisdictions = ['0f38856a-6e0f', 'bf3c-a2ad8a53210'];
    const initialJurisdictions = ['0f38856a-6e0f', '9b5dd829-89de-45a5-98f2-fd37787ae949'];
    const existingAssignments = processRawAssignments([
      helperRawAssignment1,
      helperRawAssignment2,
      helperRawAssignment3,
    ]);
    const response = retireAssignmentsByJur(
      selectedJurisdictions,
      initialJurisdictions,
      existingAssignments
    );
    // expect assignments with 9b5dd829-89de-45a5-98f2-fd37787ae949' to be retired, payload is two objects
    expect(response).toEqual([
      {
        fromDate: '2020-12-15T22:00:00+00:00',
        jurisdiction: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        organization: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
        plan: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
        toDate: '2019-12-30T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-15T22:00:00+00:00',
        jurisdiction: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        organization: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        plan: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
        toDate: '2019-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('retiring assignments where removed jurs has several assignments for specific org', () => {
    // existing assignments has an assignment that should be retired
    const selectedJurisdictions = ['0f38856a-6e0f', 'bf3c-a2ad8a53210'];
    const initialJurisdictions = ['0f38856a-6e0f', '9b5dd829-89de-45a5-98f2-fd37787ae949'];
    const existingAssignments = processRawAssignments([
      helperRawAssignment1,
      helperRawAssignment2,
      helperRawAssignment3,
    ]);
    const response = retireAssignmentsByJur(
      selectedJurisdictions,
      initialJurisdictions,
      existingAssignments,
      ['0f38856a-6e0f-5e31-bf3c-a2ad8a53210d']
    );
    // expect assignments with 9b5dd829-89de-45a5-98f2-fd37787ae949' to be retired, payload is two objects
    expect(response).toEqual([
      {
        fromDate: '2020-12-15T22:00:00+00:00',
        jurisdiction: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        organization: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
        plan: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
        toDate: '2019-12-30T00:00:00+00:00',
      },
    ]);
  });

  it('test payload creation for retired assignments where no assignments exist', () => {
    // existing assignments has an assignment that should be retired

    const selectedJurisdictions = ['0f38856a-6e0f', 'bf3c-a2ad8a53210'];
    const initialJurisdictions = ['0f38856a-6e0f', '9b5dd829-89de-45a5-98f2-fd37787ae949'];
    const response = retireAssignmentsByJur(selectedJurisdictions, initialJurisdictions, []);
    // expect empty array
    expect(response).toEqual([]);
  });
});

describe('helpers/dataLoaders.assignmentsPayloadCreation-getSingleJurisdictionPayload', () => {
  it('repeated selected organizations', () => {
    // existing assignments has an assignment that should be retired
    const selectedOrgs = ['0f38856a-6e0f', '0f38856a-6e0f', '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d'];
    const mockPlan = {
      identifier: 'planId',
      effectivePeriod: { start: '2020-12-16', end: '2021-01-05' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const selectedJurisdiction = 'jurisdictionId';
    const existingAssignments = processRawAssignments([helperRawAssignment1, helperRawAssignment3]);
    const response = getSingleJurisdictionPayload(
      selectedOrgs,
      mockPlan,
      selectedJurisdiction,
      ['0f38856a-6e0f-5e31-bf3c-a2ad8a53210d'],
      existingAssignments
    );

    expect(response).toEqual([
      {
        fromDate: '2019-12-30T00:00:00+00:00',
        jurisdiction: 'jurisdictionId',
        organization: '0f38856a-6e0f',
        plan: 'planId',
        toDate: '2021-01-05T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-15T22:00:00+00:00',
        jurisdiction: 'jurisdictionId',
        organization: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
        plan: 'planId',
        toDate: '2021-01-05T00:00:00+00:00',
      },
    ]);
  });

  it('retiring deselected organizations', () => {
    // existing assignments has an assignment that should be retired
    const selectedOrgs = ['0f38856a-6e0f'];
    const mockPlan = {
      identifier: 'planId',
      effectivePeriod: { start: '2020-12-16', end: '2021-01-05' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const selectedJurisdiction = 'jurisdictionId';
    const existingAssignments = processRawAssignments([helperRawAssignment1, helperRawAssignment3]);
    const response = getSingleJurisdictionPayload(
      selectedOrgs,
      mockPlan,
      selectedJurisdiction,
      ['0f38856a-6e0f-5e31-bf3c-a2ad8a53210d', '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d'],
      existingAssignments
    );

    // the first is an assignment, the second is an un-assignment
    expect(response).toEqual([
      {
        fromDate: '2019-12-30T00:00:00+00:00',
        jurisdiction: 'jurisdictionId',
        organization: '0f38856a-6e0f',
        plan: 'planId',
        toDate: '2021-01-05T00:00:00+00:00',
      },
      {
        fromDate: '2020-12-15T22:00:00+00:00',
        jurisdiction: 'jurisdictionId',
        organization: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
        plan: 'planId',
        toDate: '2019-12-30T00:00:00+00:00',
      },
    ]);
  });
});
