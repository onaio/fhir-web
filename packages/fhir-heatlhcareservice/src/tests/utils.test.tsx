/* eslint-disable @typescript-eslint/camelcase */
import {
  team,
  healthcareservice313,
  healthcareservice,
  healthcareservice323,
  team366,
  team319,
} from './fixtures';
import * as fhirCient from 'fhirclient';
import { loadHealthcareOrganization } from '../utils';
import { store } from '@opensrp/store';
import { authenticateUser } from '@onaio/session-reducer';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');
fhir.mockImplementation(
  jest.fn().mockImplementation(() => ({
    request: jest.fn((url) => {
      if (url === 'Organization') return Promise.resolve(team);
      if (url === 'Organization/319') return Promise.resolve(team319);
      if (url === 'Organization/366') return Promise.resolve(team366);
      else if (url === 'HealthcareService') return Promise.resolve(healthcareservice);
      else if (url === 'HealthcareService/323') return Promise.resolve(healthcareservice323);
      else if (url === 'HealthcareService/313') return Promise.resolve(healthcareservice313);
      else {
        // eslint-disable-next-line no-console
        console.error('response not found', url);
      }
    }),
  }))
);

describe('utils', () => {
  beforeAll(() => {
    store.dispatch(
      authenticateUser(
        true,
        {
          email: 'bob@example.com',
          name: 'Bobbie',
          username: 'RobertBaratheon',
        },
        // eslint-disable-next-line @typescript-eslint/camelcase
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

  it('test loadTeamPractitioner load the correct data', async () => {
    const result = await loadHealthcareOrganization(fhirBaseURL, healthcareservice313);

    expect(result).toMatchObject({
      resourceType: 'HealthcareService',
      id: '313',
      meta: {
        versionId: '5',
        lastUpdated: '2021-06-16T20:30:54.480+00:00',
        source: '#555f2c7540f52c91',
      },
      identifier: [{ use: 'official', value: '313' }],
      active: true,
      providedBy: { reference: 'Organization/319' },
      name: 'ANC Service',
      comment: 'ANC Service',
      extraDetails: 'ANC Service',
      organization: {
        resourceType: 'Organization',
        id: '319',
        meta: {
          versionId: '5',
          lastUpdated: '2021-06-25T20:22:48.045+00:00',
          source: '#e42cc8297d93f07a',
        },
        identifier: [
          {
            use: 'official',
            value: '319',
          },
        ],
        active: true,
        name: 'testing ash123',
      },
    });
  });

  it('test loadTeamPractitioner load data even if the organiztion is not present', async () => {
    const result = await loadHealthcareOrganization(fhirBaseURL, {
      ...healthcareservice313,
      providedBy: undefined,
    });

    expect(result).toMatchObject({
      resourceType: 'HealthcareService',
      id: '313',
      meta: {
        versionId: '5',
        lastUpdated: '2021-06-16T20:30:54.480+00:00',
        source: '#555f2c7540f52c91',
      },
      identifier: [{ use: 'official', value: '313' }],
      active: true,
      providedBy: undefined,
      name: 'ANC Service',
      comment: 'ANC Service',
      extraDetails: 'ANC Service',
    });
  });
});
