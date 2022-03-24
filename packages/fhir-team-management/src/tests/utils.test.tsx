<<<<<<< HEAD
/* eslint-disable @typescript-eslint/camelcase */
import { team, practitioner102, practitioner116, practitionerrole, teamsdetail } from './fixtures';
import * as fhirCient from 'fhirclient';
import { loadTeamPractitionerInfo } from '../utils';
=======
/* eslint-disable @typescript-eslint/naming-convention */
import { team, practitioner102, practitioner116, practitionerRole, teamsDetail } from './fixtures';
import * as fhirCient from 'fhirclient';
import { loadTeamPractitionerInfo } from '../utils';
import { authenticateUser } from '@onaio/session-reducer';
import { store } from '@opensrp/store';
>>>>>>> master

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
<<<<<<< HEAD
        if (url === 'Organization/') return Promise.resolve(team);
        else if (url === 'PractitionerRole/') return Promise.resolve(practitionerrole);
=======
        if (url === 'Organization/_search?_count=500&_getpagesoffset=0')
          return Promise.resolve(team);
        else if (url === 'PractitionerRole/_search?_count=500&_getpagesoffset=0')
          return Promise.resolve(practitionerRole);
>>>>>>> master
        else if (url === 'Practitioner/116') return Promise.resolve(practitioner116);
        else if (url === 'Practitioner/102') return Promise.resolve(practitioner102);
      }),
    };
  })
);

describe('utils', () => {
<<<<<<< HEAD
=======
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
        { api_token: 'hunter2', oAuth2Data: { access_token: 'hunter2', state: 'abcde' } }
      )
    );
  });

>>>>>>> master
  it('test loadTeamPractitionerInfo load the correct data', async () => {
    const result = await loadTeamPractitionerInfo({
      fhirBaseURL: fhirBaseURL,
      team: team.entry[0].resource,
    });

<<<<<<< HEAD
    expect(result).toMatchObject(teamsdetail);
=======
    expect(result).toMatchObject(teamsDetail);
>>>>>>> master
  });
});
