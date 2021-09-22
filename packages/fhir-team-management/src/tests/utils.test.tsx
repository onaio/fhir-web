/* eslint-disable @typescript-eslint/camelcase */
import { team, practitioner102, practitioner116, practitionerrole, teamsdetail } from './fixtures';
import * as fhirCient from 'fhirclient';
import { loadTeamPractitionerInfo } from '../utils';

jest.mock('@opensrp/notifications', () => ({
  __esModule: true,
  ...Object.assign({}, jest.requireActual('@opensrp/notifications')),
}));

const fhirBaseURL = 'https://fhirBaseURL.com';
const fhir = jest.spyOn(fhirCient, 'client');
fhir.mockImplementation(
  jest.fn().mockImplementation(() => {
    return {
      request: jest.fn((url) => {
        if (url === 'Organization/') return Promise.resolve(team);
        else if (url === 'PractitionerRole/') return Promise.resolve(practitionerrole);
        else if (url === 'Practitioner/116') return Promise.resolve(practitioner116);
        else if (url === 'Practitioner/102') return Promise.resolve(practitioner102);
      }),
    };
  })
);

describe('utils', () => {
  it('test loadTeamPractitionerInfo load the correct data', async () => {
    const result = await loadTeamPractitionerInfo({
      fhirBaseURL: fhirBaseURL,
      team: team.entry[0].resource,
    });

    expect(result).toMatchObject(teamsdetail);
  });
});
