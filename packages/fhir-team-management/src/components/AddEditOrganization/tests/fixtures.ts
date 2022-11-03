import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';

export const org105 = {
  resourceType: 'Organization',
  id: '105',
  meta: {
    versionId: '3',
    lastUpdated: '2021-06-25T21:04:16.588+00:00',
    source: '#7402a47da7a925c6',
  },
  identifier: [
    {
      use: 'official',
      value: '105',
    },
  ],
  active: true,
  name: 'OpenSRP web Test Organisation',
} as unknown as IOrganization;

export const allPractitioners = {
  resourceType: 'Bundle',
  id: '676cf621-e07e-4d75-af18-fea30ba41d89',
  meta: {
    lastUpdated: '2022-03-07T15:44:51.385+00:00',
  },
  type: 'searchset',
  total: 141,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner?_count=5&_format=json',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=676cf621-e07e-4d75-af18-fea30ba41d89&_getpagesoffset=5&_count=5&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/5123',
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
    {
      search: {
        mode: 'match',
      },
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/213',
      resource: {
        resourceType: 'Practitioner',
        id: '213',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-20T13:04:41.208+00:00',
          source: '#4cf80a4676be8184',
        },
        identifier: [
          {
            use: 'secondary',
            value: '7a714ee6-b59d-442e-a491-151be4423c2c',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'mapesa',
            given: ['Bobi'],
          },
        ],
        telecom: [
          {
            system: 'email',
            value: 'bobiwine@example.com',
          },
        ],
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/104',
      resource: {
        resourceType: 'Practitioner',
        id: '104',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-07T13:14:35.065+00:00',
          source: '#497f40b7dfa4047a',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">Ward Williams</div>',
        },
        identifier: [
          {
            use: 'official',
            value: '026467d1-5cf7-45ec-82d2-4a467b524278',
          },
          {
            use: 'secondary',
            value: '287aff05-ff9b-4b07-b525-8860c70377d0',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Williams',
            given: ['Ward', 'N'],
            suffix: ['MD'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '800-651-2242',
            use: 'home',
          },
          {
            system: 'phone',
            value: '800-471-8810',
            use: 'mobile',
          },
          {
            system: 'email',
            value: 'susan.williams@example.com',
          },
        ],
        address: [
          {
            use: 'home',
            line: ['27 South Ave'],
            city: 'Tulsa',
            state: 'OK',
            postalCode: '74126',
            country: 'USA',
          },
        ],
        gender: 'female',
        birthDate: '1996-11-22',
      },
      search: {
        mode: 'match',
      },
    },
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
          },
        ],
        active: false,
        name: [
          {
            use: 'official',
            family: 'Allan',
            given: ['Allay'],
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
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Practitioner/114',
      resource: {
        resourceType: 'Practitioner',
        id: '114',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T10:59:51.397+00:00',
          source: '#de8022ba85b18c8a',
        },
        identifier: [
          {
            use: 'secondary',
            value: 'fede58ef-4716-4ca8-8185-c04d8de77bcb',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'fhir',
            given: ['test'],
          },
        ],
        telecom: [
          {
            system: 'email',
            value: 'test_fhir@test.com',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
} as unknown as IBundle;

export const org105Practitioners = {
  resourceType: 'Bundle',
  id: '8cdbd777-6ffd-4cfc-99f1-f163fc065b5f',
  meta: {
    lastUpdated: '2022-03-08T18:06:07.340+00:00',
  },
  type: 'searchset',
  total: 7,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/PractitionerRole?_format=json&organization%3AOrganization=105',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/PractitionerRole/5124',
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
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/PractitionerRole/392',
      resource: {
        resourceType: 'PractitionerRole',
        id: '392',
        meta: {
          versionId: '2',
          lastUpdated: '2021-08-16T13:18:48.115+00:00',
          source: '#1543381bed80d1f5',
        },
        identifier: [
          {
            use: 'official',
            value: '94c29adc-c73f-4246-b44c-d10f3720c4ef',
          },
        ],
        active: true,
        practitioner: {
          reference: 'Practitioner/213',
          display: 'Bobi mapesa',
        },
        organization: {
          reference: 'Organization/105',
          display: 'OpenSRP web Test Organisation',
        },
      },
      search: {
        mode: 'match',
      },
    },
  ],
} as unknown as IBundle;

export const createdOrg = {
  resourceType: 'Organization',
  active: true,
  name: 'Seal team',
  id: '9b782015-8392-4847-b48c-50c11638656b',
  identifier: [{ value: '9b782015-8392-4847-b48c-50c11638656b', use: 'official' }],
  alias: ['ghosts'],
  type: [
    {
      coding: [{ code: 'team', system: 'http://terminology.hl7.org/CodeSystem/organization-type' }],
    },
  ],
};

export const editedOrg = {
  resourceType: 'Organization',
  active: false,
  name: 'Owls of Minerva',
  id: '105',
  identifier: [{ value: '105', use: 'official' }],
  alias: ['Ss'],
};

export const createdRole1 = {
  resourceType: 'PractitionerRole',
  active: true,
  id: '9b782015-8392-4847-b48c-50c11638656b',
  organization: { reference: 'Organization/105', display: 'Owls of Minerva' },
  practitioner: { reference: 'Practitioner/114', display: 'test fhir' },
  identifier: [{ use: 'official', value: '9b782015-8392-4847-b48c-50c11638656b' }],
};

export const createdRole2 = {
  resourceType: 'PractitionerRole',
  active: true,
  id: '9b782015-8392-4847-b48c-50c11638656b',
  organization: { reference: 'Organization/123', display: 'Seal team' },
  practitioner: { reference: 'Practitioner/206', display: 'Allay Allan' },
  identifier: [{ use: 'official', value: '9b782015-8392-4847-b48c-50c11638656b' }],
};
