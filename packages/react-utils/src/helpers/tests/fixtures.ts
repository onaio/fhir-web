/* eslint-disable @typescript-eslint/camelcase */
export const userAuthData = {
  roles: ['ROLE_OPENMRS'],
  email: null,
  username: 'superset-user',
  user_id: '301faf1d-6cfb-4ed1-997c-46b44146ab05',
  preferred_name: 'Superset User',
  family_name: 'User',
  given_name: 'Superset',
  email_verified: false,
  oAuth2Data: {
    access_token: '12356',
    expires_in: 3600,
    refresh_expires_in: 2592000,
    refresh_token: 'eyJhbGciOiJI',
    token_type: 'bearer',
    'not-before-policy': 1595266243,
    session_state: 'c273b697-72e9-4026-854d-d088655ac467',
    scope: 'profile email',
    token_expires_at: '2021-01-02T14:11:20.102Z',
    refresh_expires_at: '2021-02-02T14:10:20.102Z',
  },
};

export const refreshTokenResponse = {
  gatekeeper: {
    success: true,
    result: {},
  },
  session: {
    authenticated: true,
    extraData: {
      ...userAuthData,
      oAuth2Data: {
        ...userAuthData.oAuth2Data,
        access_token: 'refreshed-i-feel-new',
      },
    },
    user: {
      email: '',
      gravatar: '',
      name: '',
      username: 'superset-user',
    },
  },
};

export const careTeams = {
  resourceType: 'Bundle',
  id: '1439f945-5b56-4266-8b77-275b4064c41f',
  meta: {
    lastUpdated: '2021-06-16T16:41:07.075+00:00',
  },
  type: 'searchset',
  total: 6,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/CareTeam/?_format=json',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/308',
      resource: {
        resourceType: 'CareTeam',
        id: '308',
        meta: {
          versionId: '1',
          lastUpdated: '2021-05-26T17:01:25.732+00:00',
          source: '#6bff87efcf99dd47',
        },
        identifier: [
          {
            use: 'official',
            value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
          },
        ],
        status: 'active',
        name: 'Care Team One',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/103',
            },
          },
          {
            member: {
              reference: 'Practitioner/103',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/325',
      resource: {
        resourceType: 'CareTeam',
        id: '325',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-15T10:36:55.950+00:00',
          source: '#591451bd58b50292',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        status: 'active',
        name: 'Care Team Three',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/206',
            },
          },
          {
            member: {
              reference: 'Practitioner/213',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/327',
      resource: {
        resourceType: 'CareTeam',
        id: '327',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-16T07:30:52.596+00:00',
          source: '#35008db18c465048',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        status: 'active',
        name: 'Care Team Five',
        subject: {
          reference: 'Group/307',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/104',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/330',
      resource: {
        resourceType: 'CareTeam',
        id: '330',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-16T10:00:25.773+00:00',
          source: '#7b8049d36db19777',
        },
        identifier: [
          {
            use: 'official',
            value: '42174efd-6d78-486d-8202-937207e91e6a',
          },
        ],
        status: 'active',
        name: 'test 33',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/213',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/328',
      resource: {
        resourceType: 'CareTeam',
        id: '328',
        meta: {
          versionId: '4',
          lastUpdated: '2021-06-16T11:40:25.092+00:00',
          source: '#8a2ef39038f9ea59',
        },
        identifier: [
          {
            use: 'official',
            value: 'c6d3dfb3-750f-4fc8-9426-774ac2a04cf9',
          },
        ],
        status: 'active',
        name: 'Care Team Six',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/104',
            },
          },
          {
            member: {
              reference: 'Practitioner/115',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/326',
      resource: {
        resourceType: 'CareTeam',
        id: '326',
        meta: {
          versionId: '2',
          lastUpdated: '2021-06-16T16:25:42.857+00:00',
          source: '#ecd5a0cf910e949b',
        },
        identifier: [
          {
            use: 'official',
            value: '42c338c1-382d-4a5a-9070-80ea41cb85df',
          },
        ],
        status: 'active',
        name: 'Care Team Four',
        subject: {
          reference: 'Group/306',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/118',
            },
          },
          {
            member: {
              reference: 'Practitioner/104',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const careTeam1 = {
  resourceType: 'CareTeam',
  id: '308',
  meta: {
    versionId: '4',
    lastUpdated: '2021-06-18T06:07:29.649+00:00',
    source: '#9bf085bac3f61473',
  },
  identifier: [
    {
      use: 'official',
      value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
    },
  ],
  status: 'active',
  name: 'Care Team One',
  subject: {
    reference: 'Group/306',
  },
  participant: [
    {
      member: {
        reference: 'Practitioner/206',
      },
    },
    {
      member: {
        reference: 'Practitioner/103',
      },
    },
  ],
};
