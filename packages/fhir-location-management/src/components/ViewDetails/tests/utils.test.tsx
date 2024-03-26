import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';
import nock from 'nock';
import { cleanup } from '@testing-library/react';
import { locationResourceType } from '@opensrp/fhir-helpers';
import {
  centralProvinceInclude,
  kiambuCountyInclude,
  rootFhirLocationInclude,
  trueKenyaInclude,
} from './fixtures';
import { getLocationsAncestors } from '../utils';

jest.mock('fhirclient', () => {
  return jest.requireActual('fhirclient/lib/entry/browser');
});

const props = {
  fhirRootLocationId: 'eff94f33-c356-4634-8795-d52340706ba9',
  fhirBaseURL: 'http://test.server.org',
};

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

jest.setTimeout(10000);

nock.disableNetConnect();

describe('location-management/src/components/LocationUnitList', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  afterEach(() => {
    nock.cleanAll();
    cleanup();
  });

  test('get location path works correctly(location,parent pairs resolve evenly)', async () => {
    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({ _id: kiambuCountyInclude.entry[0].resource.id, _include: 'Location:partof' })
      .reply(200, kiambuCountyInclude);

    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({ _id: trueKenyaInclude.entry[0].resource.id, _include: 'Location:partof' })
      .reply(200, trueKenyaInclude);

    const response = await getLocationsAncestors(
      props.fhirBaseURL,
      kiambuCountyInclude.entry[0].resource.id
    );
    const match = response.map((res) => ({ id: res.id, name: res.name }));
    expect(match).toEqual([
      { id: '2252', name: 'Root FHIR Location' },
      { id: 'fe9e549b-a427-4db6-aad9-edade11b6e6a', name: 'True Kenya' },
      { id: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334', name: 'Central Province' },
      { id: '46bb8a3f-cf50-4cc2-b421-fe4f77c3e75d', name: 'Kiambu County' },
    ]);
    expect(nock.isDone()).toBeTruthy();
  });

  test('get location path (location,parent pairs resolve oddly)', async () => {
    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({ _id: centralProvinceInclude.entry[0].resource.id, _include: 'Location:partof' })
      .reply(200, centralProvinceInclude);

    nock(props.fhirBaseURL)
      .get(`/${locationResourceType}/_search`)
      .query({ _id: rootFhirLocationInclude.entry[0].resource.id, _include: 'Location:partof' })
      .reply(200, rootFhirLocationInclude);

    const response = await getLocationsAncestors(
      props.fhirBaseURL,
      centralProvinceInclude.entry[0].resource.id
    );
    const match = response.map((res) => ({ id: res.id, name: res.name }));
    expect(match).toEqual([
      { id: '2252', name: 'Root FHIR Location' },
      { id: 'fe9e549b-a427-4db6-aad9-edade11b6e6a', name: 'True Kenya' },
      { id: 'd9d7aa7b-7488-48e7-bae8-d8ac5bd09334', name: 'Central Province' },
    ]);
    expect(nock.isDone()).toBeTruthy();
  });
});
