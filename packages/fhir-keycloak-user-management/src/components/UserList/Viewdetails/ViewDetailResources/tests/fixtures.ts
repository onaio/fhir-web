import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

/* eslint-disable no-template-curly-in-string */

export const practitionerDetailsBundle = {
  resourceType: 'Bundle',
  id: '993066c6-1fda-4f91-a30f-96ab57573e87',
  meta: {
    lastUpdated: '2023-10-30T14:30:12.383+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/practitioner-details/_search?keycloak-uuid=9f72c646-dc1e-4f24-98df-6f04373b9ec6',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/practitioner-details/3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad',
      resource: {
        resourceType: 'practitioner-details',
        id: '3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad',
        meta: {
          profile: ['http://hl7.org/fhir/profiles/custom-resource'],
        },
        fhir: {
          id: '3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad',
          teams: [
            {
              resourceType: 'Organization',
              id: '0d7ae048-9b84-4f0c-ba37-8d6c0b97dc84',
              meta: {
                versionId: '1',
                lastUpdated: '2023-10-13T09:59:23.717+00:00',
                source: '#b7fa59921069f37e',
              },
              identifier: [
                {
                  use: 'official',
                  value: '7712bfdd-83e3-43cf-b5f0-c8d6a99ed96b',
                },
              ],
              active: true,
              type: [
                {
                  coding: [
                    {
                      system: 'http://terminology.hl7.org/CodeSystem/organization-type',
                      code: 'team',
                    },
                  ],
                },
              ],
              name: 'e2e-corporation',
              alias: ['e2e-misty'],
            },
          ],
          practitionerRoles: [
            {
              resourceType: 'PractitionerRole',
              id: 'dea42f3c-7bc5-4a19-a398-d89f198558ad',
              meta: {
                versionId: '21',
                lastUpdated: '2023-10-13T09:59:24.990+00:00',
                source: '#0f75b3dadea9fe99',
              },
              identifier: [
                {
                  use: 'official',
                  value: 'dea42f3c-7bc5-4a19-a398-d89f198558ad',
                },
                {
                  use: 'secondary',
                  value: '9f72c646-dc1e-4f24-98df-6f04373b9ec6',
                },
              ],
              active: true,
              practitioner: {
                reference: 'Practitioner/3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad',
                display: 'test1147 1147',
              },
              organization: {
                reference: 'Organization/0d7ae048-9b84-4f0c-ba37-8d6c0b97dc84',
                display: 'e2e-corporation',
              },
              code: [
                {
                  coding: [
                    {
                      system: 'http://snomed.info/sct',
                      code: '405623001',
                      display: 'Assigned practitioner',
                    },
                  ],
                },
              ],
            },
          ],
          groups: [
            {
              resourceType: 'Group',
              id: '848abc05-33ea-45f7-b909-b3ce465c67da',
              meta: {
                versionId: '3',
                lastUpdated: '2023-08-29T09:21:06.420+00:00',
                source: '#046812ad18d6a6c3',
              },
              identifier: [
                {
                  use: 'official',
                  value: '848abc05-33ea-45f7-b909-b3ce465c67da',
                },
                {
                  use: 'secondary',
                  value: '9f72c646-dc1e-4f24-98df-6f04373b9ec6',
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
              name: 'test1147 1147',
              member: [
                {
                  entity: {
                    reference: 'Practitioner/3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad',
                  },
                },
              ],
            },
          ],
          practitioner: [
            {
              resourceType: 'Practitioner',
              id: '3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad',
              meta: {
                versionId: '4',
                lastUpdated: '2023-08-29T09:21:05.863+00:00',
                source: '#8886a1e2a6059631',
              },
              identifier: [
                {
                  use: 'official',
                  value: '3a801d6e-7bd3-4a5f-bc9c-64758fbb3dad',
                },
                {
                  use: 'secondary',
                  value: '9f72c646-dc1e-4f24-98df-6f04373b9ec6',
                },
              ],
              active: true,
              name: [
                {
                  use: 'official',
                  family: '1147',
                  given: ['test1147'],
                },
              ],
              telecom: [
                {
                  system: 'email',
                  value: 'mejay2303@gmail.com',
                },
              ],
            },
          ],
        },
      },
    },
  ],
} as unknown as IBundle;

export const user1147 = {
  id: '9f72c646-dc1e-4f24-98df-6f04373b9ec6',
  createdTimestamp: 1675179889477,
  username: '1147',
  enabled: true,
  totp: false,
  emailVerified: false,
  firstName: 'test1147',
  lastName: '1147',
  email: 'mejay2303@gmail.com',
  attributes: {
    fhir_core_app_id: ['ecbis'],
  },
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 1681810919,
  access: {
    manageGroupMembership: true,
    view: true,
    mapRoles: true,
    impersonate: true,
    manage: true,
  },
};

export const user1147ExtraFields = {
  id: '9f72c646-dc1e-4f24-98df-6f04373b9ec6',
  createdTimestamp: 1675179889477,
  username: '1147',
  enabled: true,
  totp: false,
  emailVerified: false,
  firstName: 'test1147',
  lastName: '1147',
  email: 'mejay2303@gmail.com',
  attributes: {
    fhir_core_app_id: ['giz'],
    nationalId: ['1234567891011121'],
    phoneNumber: ['0101345678'],
  },
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 1681810919,
  access: {
    manageGroupMembership: true,
    view: true,
    mapRoles: true,
    impersonate: true,
    manage: true,
  },
};

export const user1147Groups = [
  {
    id: 'b68e2590-c2ee-4b3c-9184-c4b35a69a271',
    name: 'SuperUser',
    path: '/SuperUser',
  },
];

export const user1147Roles = {
  realmMappings: [
    {
      id: '2637bf64-5b3b-4e63-8849-d5b876c4e661',
      name: 'POST_LOCATION',
      description: '',
      composite: false,
      clientRole: false,
      containerId: 'a9103f9f-4759-47a3-9c22-c2398f9f5e21',
    },
    {
      id: '2cf50188-55a6-4143-b293-f009bc25356f',
      name: 'GET_LOCATION',
      description: '',
      composite: false,
      clientRole: false,
      containerId: 'a9103f9f-4759-47a3-9c22-c2398f9f5e21',
    },
    {
      id: '674c5a60-9ed6-478f-9836-290945b40def',
      name: 'offline_access',
      description: '${role_offline-access}',
      composite: false,
      clientRole: false,
      containerId: 'a9103f9f-4759-47a3-9c22-c2398f9f5e21',
    },
  ],
  clientMappings: {
    'realm-management': {
      id: '9d9637dc-d86c-4669-bc0d-6600c22090f7',
      client: 'realm-management',
      mappings: [
        {
          id: '43218a35-baf4-45fd-b926-5923996e9eb7',
          name: 'manage-realm',
          description: '${role_manage-realm}',
          composite: false,
          clientRole: true,
          containerId: '9d9637dc-d86c-4669-bc0d-6600c22090f7',
        },
        {
          id: 'bcf4874f-760d-45d4-881e-eda109ecf033',
          name: 'manage-users',
          description: '${role_manage-users}',
          composite: false,
          clientRole: true,
          containerId: '9d9637dc-d86c-4669-bc0d-6600c22090f7',
        },
      ],
    },
    account: {
      id: '7b3904aa-2394-4940-8981-03262642f047',
      client: 'account',
      mappings: [
        {
          id: 'c0dcef4f-eb0d-49f0-9389-96dc4d7316a2',
          name: 'manage-account',
          description: '${role_manage-account}',
          composite: true,
          clientRole: true,
          containerId: '7b3904aa-2394-4940-8981-03262642f047',
        },
      ],
    },
  },
};
