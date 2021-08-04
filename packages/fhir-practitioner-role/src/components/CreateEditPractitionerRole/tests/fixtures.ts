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

export const practitioners = {
  resourceType: 'Bundle',
  id: '5db4aa7e-eca6-432d-a544-d0a8279d8103',
  meta: {
    lastUpdated: '2021-06-21T12:07:11.330+00:00',
  },
  type: 'searchset',
  total: 18,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Practitioner?_format=json',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/102',
      resource: {
        resourceType: 'Practitioner',
        id: '102',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-06T14:20:36.221+00:00',
          source: '#06ab911873541fd2',
          tag: [
            {
              system: 'https://smarthealthit.org/tags',
              code: 'smart-7-2017',
            },
          ],
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">Ward Williams</div>',
        },
        identifier: [
          {
            use: 'official',
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/identifier-type',
                  code: 'SB',
                  display: 'Social Beneficiary Identifier',
                },
              ],
              text: 'US Social Security Number',
            },
            system: 'http://hl7.org/fhir/sid/us-ssn',
            value: '000-00-0002',
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
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/103',
      resource: {
        resourceType: 'Practitioner',
        id: '103',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-06T14:23:33.833+00:00',
          source: '#6410e3946e34d533',
          tag: [
            {
              system: 'https://fhir.labs.smartregister.org/tags',
              code: 'ona-7-2017',
            },
          ],
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">Ward Williams</div>',
        },
        identifier: [
          {
            use: 'official',
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/identifier-type',
                  code: 'SB',
                  display: 'Social Beneficiary Identifier',
                },
              ],
              text: 'US Social Security Number',
            },
            system: 'http://hl7.org/fhir/sid/us-ssn',
            value: '000-00-0002',
          },
          {
            use: 'secondary',
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/identifier-type',
                  code: 'KUID',
                  display: 'Keycloak user ID',
                },
              ],
              text: 'Keycloak user ID',
            },
            system: 'http://hl7.org/fhir/sid/us-ssn',
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
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/104',
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
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/114',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/115',
      resource: {
        resourceType: 'Practitioner',
        id: '115',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T13:36:21.538+00:00',
          source: '#2e122066aaaac2b6',
        },
        identifier: [
          {
            use: 'secondary',
            value: 'd4b326e4-d0f5-488e-b736-f847cb81ff3a',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/116',
      resource: {
        resourceType: 'Practitioner',
        id: '116',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T13:37:07.748+00:00',
          source: '#e1b88aa8694170cb',
        },
        identifier: [
          {
            use: 'secondary',
            value: 'a9d5934b-6a04-41a4-a4da-0bcd5fe162cd',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/117',
      resource: {
        resourceType: 'Practitioner',
        id: '117',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T13:48:24.039+00:00',
          source: '#acbaf47323550140',
        },
        identifier: [
          {
            use: 'secondary',
            value: '3964e0e0-dc2c-43b0-a353-bb901b820799',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/118',
      resource: {
        resourceType: 'Practitioner',
        id: '118',
        meta: {
          versionId: '2',
          lastUpdated: '2021-04-13T14:28:05.929+00:00',
          source: '#844bab628b7f3baf',
        },
        identifier: [
          {
            use: 'secondary',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/119',
      resource: {
        resourceType: 'Practitioner',
        id: '119',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T14:29:24.054+00:00',
          source: '#76c17cc39a8bb9c6',
        },
        identifier: [
          {
            use: 'secondary',
            value: '094722fd-079c-42f9-a89b-5569259d6366',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/120',
      resource: {
        resourceType: 'Practitioner',
        id: '120',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T14:31:36.464+00:00',
          source: '#5613e1b0935986a8',
        },
        identifier: [
          {
            use: 'secondary',
            value: '4aadf68f-8eab-4b96-b315-8d6fbb381b56',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/121',
      resource: {
        resourceType: 'Practitioner',
        id: '121',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T14:32:57.619+00:00',
          source: '#f89683ce57d8f084',
        },
        identifier: [
          {
            use: 'secondary',
            value: '9f4cacd1-2cbf-401a-94af-701f5af10539',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/122',
      resource: {
        resourceType: 'Practitioner',
        id: '122',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T14:33:41.790+00:00',
          source: '#46d38bf40a233772',
        },
        identifier: [
          {
            use: 'secondary',
            value: '5f86da1f-601d-4f1d-aac5-1d3c6ea88473',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/123',
      resource: {
        resourceType: 'Practitioner',
        id: '123',
        meta: {
          versionId: '2',
          lastUpdated: '2021-04-13T14:42:16.760+00:00',
          source: '#ab5a01efc6b116b5',
        },
        identifier: [
          {
            use: 'secondary',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/124',
      resource: {
        resourceType: 'Practitioner',
        id: '124',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T14:44:15.038+00:00',
          source: '#59bb309e0d383ccb',
        },
        identifier: [
          {
            use: 'secondary',
            value: '8225af14-be1b-4878-bea0-5709a0d26c48',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/125',
      resource: {
        resourceType: 'Practitioner',
        id: '125',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-13T14:51:22.686+00:00',
          source: '#634cba62744c9078',
        },
        identifier: [
          {
            use: 'secondary',
            value: 'fd4a8d91-89c2-4ff1-950d-8699df608bb0',
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
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/126',
      resource: {
        resourceType: 'Practitioner',
        id: '126',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-15T07:07:01.826+00:00',
          source: '#bd5a8a00fe231ef9',
        },
        identifier: [
          {
            use: 'secondary',
            value: '592fdd25-e36a-4184-9a3c-4a55bd4df291',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: ['Ceno'],
            given: ['John'],
            prefix: 'Mr.',
          },
        ],
        telecom: [
          {
            system: 'email',
            value: 'jcena@example.com',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/206',
      resource: {
        resourceType: 'Practitioner',
        id: '206',
        meta: {
          versionId: '1',
          lastUpdated: '2021-04-20T07:00:53.598+00:00',
          source: '#85ea6b68103eba2b',
        },
        identifier: [
          {
            use: 'secondary',
            value: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Allan',
            given: ['Allay'],
            prefix: ['Mr.'],
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
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Practitioner/213',
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
      search: {
        mode: 'match',
      },
    },
  ],
};

export const groups = {
  resourceType: 'Bundle',
  id: '758af2f5-0d4e-40e3-9f0e-b39239e18b11',
  meta: {
    lastUpdated: '2021-06-21T12:04:30.775+00:00',
  },
  type: 'searchset',
  total: 3,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Group?_format=json',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Group/306',
      resource: {
        resourceType: 'Group',
        id: '306',
        meta: {
          versionId: '1',
          lastUpdated: '2021-05-26T16:31:30.444+00:00',
          source: '#0d2306dfa4b90412',
        },
        identifier: [
          {
            use: 'official',
            value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
          },
        ],
        active: true,
        name: 'ANC patients',
        quantity: 1,
        member: [
          {
            entity: {
              reference: 'Patient/3',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Group/307',
      resource: {
        resourceType: 'Group',
        id: '307',
        meta: {
          versionId: '1',
          lastUpdated: '2021-05-26T16:33:33.242+00:00',
          source: '#e7e82348904840a4',
        },
        identifier: [
          {
            use: 'official',
            value: '93bc9c3d-6321-41b0-9b93-1275d7114e34',
          },
        ],
        active: true,
        name: 'ANC patients',
        quantity: 1,
        member: [
          {
            entity: {
              reference: 'Patient/3',
            },
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Group/329',
      resource: {
        resourceType: 'Group',
        id: '329',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-16T07:47:27.192+00:00',
          source: '#c01df7e48153edb1',
        },
        identifier: [
          {
            use: 'official',
            value: '98828c48-a0c7-42c0-9802-48c525a916d6',
          },
        ],
        active: true,
        name: 'TEST group ',
        quantity: 1,
        member: [
          {
            entity: {
              reference: 'Patient/3',
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

export const formValues = {
  uuid: '',
  id: '',
  name: 'Care Team Seven',
  status: 'active',
  practitionersId: ['103'],
  groupsId: '329',
};
