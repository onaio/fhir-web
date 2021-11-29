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

export const PractitionerBundle = {
  resourceType: 'Bundle',
  id: 'ae66a2fa-050f-47ec-94b4-65b8b6d757a5',
  meta: {
    lastUpdated: '2021-11-25T13:28:14.429+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url:
        'http://fhir.labs.smartregister.org/fhir/Practitioner/_search?identifier=b85bdf78-288f-4ab5-9ddb-a9f5427cd809',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/5123',
      resource: {
        resourceType: 'Practitioner',
        id: '5123',
        meta: {
          versionId: '1',
          lastUpdated: '2021-11-24T11:44:27.239+00:00',
          source: '#434b9e3bcfcca8ad',
        },
        identifier: [
          {
            use: 'official',
            value: 'c6af6238-288d-4db4-97d4-32fa673c07f0',
          },
          {
            use: 'secondary',
            value: 'b85bdf78-288f-4ab5-9ddb-a9f5427cd809',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Practitioner',
            given: ['Demo'],
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

export const PractitionerRoleBundle = {
  resourceType: 'Bundle',
  id: '5d14c029-acaf-4682-bc5b-ae003a25ecb2',
  meta: {
    lastUpdated: '2021-11-25T13:35:12.170+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/PractitionerRole/_search?practitioner=5123',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/PractitionerRole/5124',
      resource: {
        resourceType: 'PractitionerRole',
        id: '5124',
        meta: {
          versionId: '2',
          lastUpdated: '2021-11-24T12:00:37.023+00:00',
          source: '#80059dcbe285ce4d',
        },
        active: true,
        practitioner: {
          reference: 'Practitioner/5123',
          display: 'Demo Practitioner',
        },
        organization: {
          reference: 'Organization/105',
          display: 'OpenSRP web Test Organisation',
        },
        code: [
          {
            coding: [
              {
                system: 'http://hl7.org/fhir/uv/cpg/CodeSystem/cpg-common-persona',
                code: '2222',
                display: 'Nursing professional',
              },
            ],
            text: 'Nursing professional',
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '(03) 5555 6473',
            use: 'work',
          },
        ],
        availableTime: [
          {
            daysOfWeek: ['mon', 'tue', 'wed'],
            availableStartTime: '09:00:00',
            availableEndTime: '16:30:00',
          },
          {
            daysOfWeek: ['thu', 'fri'],
            availableStartTime: '09:00:00',
            availableEndTime: '12:00:00',
          },
        ],
        notAvailable: [
          {
            description: 'Nurse will be on extended leave during May 2017',
            during: {
              start: '2017-05-01',
              end: '2017-05-20',
            },
          },
        ],
        availabilityExceptions:
          'Nurse is generally unavailable on public holidays and during the Christmas/New Year break',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const CareTeamBundle = {
  resourceType: 'Bundle',
  id: '2f48621e-8edb-4fde-8f3e-e2180e479e3b',
  meta: {
    lastUpdated: '2021-11-25T14:49:54.774+00:00',
  },
  type: 'searchset',
  total: 2,
  link: [
    {
      relation: 'self',
      url:
        'http://fhir.labs.smartregister.org/fhir/CareTeam/_search?participant%3Apractitioner=5105',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/test',
      resource: {
        resourceType: 'CareTeam',
        id: 'test',
        meta: {
          versionId: '5',
          lastUpdated: '2021-11-25T13:55:41.626+00:00',
          source: '#c937e8606de1470f',
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
          display: 'ANC patients',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/126',
              display: 'John Ceno',
            },
          },
          {
            member: {
              reference: 'Practitioner/5105',
              display: 'totaly unique',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/CareTeam/1085',
      resource: {
        resourceType: 'CareTeam',
        id: '1085',
        meta: {
          versionId: '2',
          lastUpdated: '2021-11-25T13:54:47.777+00:00',
          source: '#3f3e75a0fcc786a6',
        },
        identifier: [
          {
            use: 'official',
            value: '8b6ffc09-0df4-470f-82a6-2e707685a7eb',
          },
        ],
        status: 'active',
        name: 'Demo FHIR Care team',
        subject: {
          reference: 'Group/1084',
          display: 'Demo FHIR Groups',
        },
        participant: [
          {
            member: {
              reference: 'Practitioner/103',
              display: 'Ward N Williams MD',
            },
          },
          {
            member: {
              reference: 'Practitioner/5105',
              display: 'totaly unique',
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
