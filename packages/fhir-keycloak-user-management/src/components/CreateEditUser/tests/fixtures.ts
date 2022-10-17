export const userGroup = [
  { id: '283c5d6e-9b83-4954-9f3b-4c2103e4370c', name: 'Admin', path: '/Admin', subGroups: [] },
  { id: 'a55f0b02-950f-4c6a-9857-667ffbba1dd5', name: 'Admin 2', path: '/Admin 2', subGroups: [] },
  {
    id: '4dd15e66-7132-429b-8939-d1e601611464',
    name: 'New Group',
    path: '/New Group',
    subGroups: [],
  },
  {
    id: '580c7fbf-c201-4dad-9172-1df9faf24936',
    name: 'Super User',
    path: '/Super User',
    subGroups: [],
  },
  {
    id: '2fffbc6a-528d-4cec-aa44-97ef65b9bba2',
    name: 'Test User Group',
    path: '/Test User Group',
    subGroups: [],
  },
];

export const keycloakUser = {
  id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
  createdTimestamp: 1600156317992,
  username: 'opensrp',
  enabled: true,
  totp: false,
  emailVerified: false,
  firstName: 'Demo',
  lastName: 'kenya',
  email: 'test@onatest.com',
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 0,
  access: {
    manageGroupMembership: true,
    view: true,
    mapRoles: true,
    impersonate: false,
    manage: true,
  },
};

export const practitioner = {
  resourceType: 'Bundle',
  id: '30c8715d-c661-4c58-b7f1-303f6e6251c6',
  meta: {
    lastUpdated: '2022-04-05T08:45:53.640+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/_search?_format=json&identifier=c1d36d9a-b771-410b-959e-af2c04d132a2',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/206',
      resource: {
        resourceType: 'Practitioner',
        id: '206',
        meta: {
          versionId: '2',
          lastUpdated: '2021-09-14T07:37:31.213+00:00',
          source: '#74cc383a67268f33',
        },
        identifier: [
          {
            use: 'official',
            value: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
          },
          {
            use: 'secondary',
            value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
          },
        ],
        active: false,
        name: [
          {
            use: 'official',
            family: 'Demo',
            given: ['Kenya'],
          },
        ],
        telecom: [
          {
            system: 'email',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const updatedPractitioner = {
  resourceType: 'Practitioner',
  id: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
  identifier: [
    { use: 'official', value: 'c1d36d9a-b771-410b-959e-af2c04d132a2' },
    { use: 'secondary', value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b' },
  ],
  active: true,
  name: [{ use: 'official', family: 'kenyaplotus', given: ['Demoflotus', ''] }],
  telecom: [{ system: 'email', value: 'test@onatest.comflotus@plotus.duck' }],
};

export const group = {
  resourceType: 'Bundle',
  id: 'f20c0276-8364-4e31-ae99-e4bcdb3813ce',
  meta: {
    lastUpdated: '2022-10-14T01:43:51.928+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Group/_search?identifier=cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Group/acb9d47e-7247-448f-be93-7a193a5312da',
      resource: {
        resourceType: 'Group',
        id: 'acb9d47e-7247-448f-be93-7a193a5312da',
        meta: {
          versionId: '2',
          lastUpdated: '2022-10-14T01:40:59.365+00:00',
          source: '#9a5be796c77bd270',
        },
        identifier: [
          {
            use: 'official',
            value: 'acb9d47e-7247-448f-be93-7a193a5312da',
          },
          {
            use: 'secondary',
            value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
          },
        ],
        active: true,
        type: 'practitioner',
        actual: true,
        code: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '405623001',
              display: 'Assigned practitioner',
            },
          ],
        },
        name: 'Demoflotus kenyaplotus',
        member: [
          {
            entity: {
              reference: 'Practitioner/206',
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

export const updatedGroup = {
  resourceType: 'Group',
  id: 'acb9d47e-7247-448f-be93-7a193a5312da',
  identifier: [
    {
      use: 'official',
      value: 'acb9d47e-7247-448f-be93-7a193a5312da',
    },
    {
      use: 'secondary',
      value: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    },
  ],
  active: true,
  type: 'practitioner',
  actual: true,
  code: {
    coding: [
      {
        system: 'http://snomed.info/sct',
        code: '405623001',
        display: 'Assigned practitioner',
      },
    ],
  },
  name: 'Demoflotus kenyaplotus',
  member: [
    {
      entity: {
        reference: 'Practitioner/c1d36d9a-b771-410b-959e-af2c04d132a2',
      },
    },
  ],
};
