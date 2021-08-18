export const practitionerRole1 = {
  resourceType: 'PractitionerRole',
  id: '388',
  meta: {
    versionId: '2',
    lastUpdated: '2021-08-16T13:18:24.126+00:00',
    source: '#1e274683ed9d3c54',
  },
  identifier: [
    {
      use: 'official',
      value: 'b3046485-1591-46b4-959f-02db30a2f622',
    },
  ],
  active: true,
  practitioner: {
    reference: 'Practitioner/206',
    display: 'Allay Allan',
  },
  organization: {
    reference: 'Organization/105',
    display: 'OpenSRP web Test Organisation',
  },
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

export const organizations = {
  resourceType: 'Bundle',
  id: '06413076-5906-4c52-876d-2a696f98d119',
  meta: {
    lastUpdated: '2021-08-18T06:05:40.935+00:00',
  },
  type: 'searchset',
  total: 30,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Organization?_format=json',
    },
    {
      relation: 'next',
      url:
        'http://fhir.labs.smartregister.org/fhir?_getpages=06413076-5906-4c52-876d-2a696f98d119&_getpagesoffset=20&_count=20&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/212',
      resource: {
        resourceType: 'Organization',
        id: '212',
        meta: {
          versionId: '3',
          lastUpdated: '2021-06-29T02:17:11.870+00:00',
          source: '#4f714be1049b0986',
        },
        identifier: [
          {
            use: 'official',
            value: '212',
          },
        ],
        active: false,
        name: 'My Team',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/205',
      resource: {
        resourceType: 'Organization',
        id: '205',
        meta: {
          versionId: '2',
          lastUpdated: '2021-06-22T08:43:41.801+00:00',
          source: '#e4f4daada5b65d9b',
        },
        identifier: [
          {
            use: 'official',
            value: '205',
          },
        ],
        active: true,
        name: 'test 345',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/361',
      resource: {
        resourceType: 'Organization',
        id: '361',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T12:53:05.997+00:00',
          source: '#8617d3c21781d9a5',
        },
        identifier: [
          {
            use: 'official',
            value: 'a741cd5e-5737-4731-908b-957afa91878d',
          },
        ],
        active: true,
        name: 'Test Team One',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/362',
      resource: {
        resourceType: 'Organization',
        id: '362',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:00:54.421+00:00',
          source: '#30a45deb81923db9',
        },
        identifier: [
          {
            use: 'official',
            value: '6202b7b2-e45e-4616-b690-6d5d40fb8cc5',
          },
        ],
        active: true,
        name: 'Test Team 3',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/363',
      resource: {
        resourceType: 'Organization',
        id: '363',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:08:22.510+00:00',
          source: '#3dc5c6e011022d8a',
        },
        identifier: [
          {
            use: 'official',
            value: '3255cf21-d2e2-4917-b780-02edefc18e5d',
          },
        ],
        active: true,
        name: 'Test Team 4',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/364',
      resource: {
        resourceType: 'Organization',
        id: '364',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:15:30.534+00:00',
          source: '#a2daabb58f6bbbd5',
        },
        identifier: [
          {
            use: 'official',
            value: 'e91fb7fd-5dd2-4edc-980f-2a8a47afabc0',
          },
        ],
        active: true,
        name: 'Test Team 5',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/365',
      resource: {
        resourceType: 'Organization',
        id: '365',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:15:36.882+00:00',
          source: '#ffb40bf381017dad',
        },
        identifier: [
          {
            use: 'official',
            value: 'a330d973-f144-42b4-b608-b5118ed21f4d',
          },
        ],
        active: true,
        name: 'Test Team 5',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/366',
      resource: {
        resourceType: 'Organization',
        id: '366',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:35:11.315+00:00',
          source: '#87395375150eac4b',
        },
        identifier: [
          {
            use: 'official',
            value: '7b83dd9c-ae06-4e1e-b45f-719e6d6af376',
          },
        ],
        active: true,
        name: 'Test Team 5',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/367',
      resource: {
        resourceType: 'Organization',
        id: '367',
        meta: {
          versionId: '7',
          lastUpdated: '2021-06-22T13:48:22.572+00:00',
          source: '#5c5d598cd88033dd',
        },
        identifier: [
          {
            use: 'official',
            value: 'd409822e-055e-49a4-9d16-642ea6437447',
          },
        ],
        active: true,
        name: 'Test UUID 46',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/368',
      resource: {
        resourceType: 'Organization',
        id: '368',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T13:54:14.316+00:00',
          source: '#986189221957dceb',
        },
        identifier: [
          {
            use: 'official',
            value: 'b7230dc0-864f-4442-bc86-806c3eb6915b',
          },
        ],
        active: true,
        name: 'Test Team 70',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/204',
      resource: {
        resourceType: 'Organization',
        id: '204',
        meta: {
          versionId: '3',
          lastUpdated: '2021-06-23T12:00:36.748+00:00',
          source: '#5ae8ab706e103ba4',
        },
        identifier: [
          {
            use: 'official',
            value: '204',
          },
        ],
        active: true,
        name: 'test123',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/319',
      resource: {
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
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/105',
      resource: {
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
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/400',
      resource: {
        resourceType: 'Organization',
        id: '400',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-28T23:12:49.214+00:00',
          source: '#50ed03cdfa6c1193',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        active: true,
        name: 'ashfahan test 0',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/401',
      resource: {
        resourceType: 'Organization',
        id: '401',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-28T23:24:31.855+00:00',
          source: '#f6040ab69abadb29',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        active: true,
        name: 'ashfahan test 1',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/402',
      resource: {
        resourceType: 'Organization',
        id: '402',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-28T23:27:37.238+00:00',
          source: '#05314c9d7d55aac8',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        active: true,
        name: 'ashfahan test 2',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/403',
      resource: {
        resourceType: 'Organization',
        id: '403',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-28T23:29:50.945+00:00',
          source: '#d2ae3118055aba16',
        },
        identifier: [
          {
            use: 'official',
          },
        ],
        active: true,
        name: 'ashfahan test 2',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/404',
      resource: {
        resourceType: 'Organization',
        id: '404',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-28T23:38:37.951+00:00',
          source: '#3af5dc8ae1cc0d63',
        },
        identifier: [
          {
            use: 'official',
            value: '09bd4bd3-901b-4cc1-b52c-9a6b542cb02b',
          },
        ],
        active: true,
        name: 'ashfahan test 2',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/405',
      resource: {
        resourceType: 'Organization',
        id: '405',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-28T23:38:57.634+00:00',
          source: '#11ec40307140656b',
        },
        identifier: [
          {
            use: 'official',
            value: '75f259e9-6646-4488-9cca-e0fe0b9c494c',
          },
        ],
        active: true,
        name: 'ashfahan test 2',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Organization/406',
      resource: {
        resourceType: 'Organization',
        id: '406',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-28T23:39:02.075+00:00',
          source: '#f273b3d25e1bae63',
        },
        identifier: [
          {
            use: 'official',
            value: '4cae9067-1207-417b-af4a-35f1e276976d',
          },
        ],
        active: true,
        name: 'ashfahan test 2',
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
  active: true,
  practitionersId: '103',
  orgsId: '366',
};
