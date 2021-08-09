import { FHIRResponse } from '@opensrp/react-utils';
import { HealthCareDetailProps } from '../components/HealthCareDetail';
import { Organization, HealthcareService } from '../types';

export const team: FHIRResponse<Organization> = {
  resourceType: 'Bundle',
  id: 'cb83f799-a14e-41e5-87c6-2b19019f3d31',
  meta: {
    lastUpdated: '2021-07-06T19:14:33.560+00:00',
  },
  type: 'searchset',
  total: 26,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Organization?_format=json',
    },
    {
      relation: 'next',
      url:
        'http://fhir.labs.smartregister.org/fhir?_getpages=cb83f799-a14e-41e5-87c6-2b19019f3d31&_getpagesoffset=20&_count=20&_format=json&_pretty=true&_bundletype=searchset',
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

export const team319: Organization = {
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
};

export const team366: Organization = {
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
};

export const healthcareservice: FHIRResponse<HealthcareService> = {
  resourceType: 'Bundle',
  id: '8d41a54c-3c06-4beb-8249-d41cacfd9468',
  meta: {
    lastUpdated: '2021-08-09T04:43:52.572+00:00',
  },
  type: 'searchset',
  total: 5,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/HealthcareService?_format=json',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/HealthcareService/323',
      resource: {
        resourceType: 'HealthcareService',
        id: '323',
        meta: {
          versionId: '6',
          lastUpdated: '2021-06-29T03:26:29.448+00:00',
          source: '#9397ce74e631fa96',
        },
        identifier: [
          {
            use: 'official',
            value: '323',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/366',
        },
        name: 'testing  Healthcare 22',
        comment: 'test',
        extraDetails: 'test',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/HealthcareService/313',
      resource: {
        resourceType: 'HealthcareService',
        id: '313',
        meta: {
          versionId: '5',
          lastUpdated: '2021-06-16T20:30:54.480+00:00',
          source: '#555f2c7540f52c91',
        },
        identifier: [
          {
            use: 'official',
            value: '313',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/319',
        },
        name: 'ANC Service',
        comment: 'ANC Service',
        extraDetails: 'ANC Service',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/HealthcareService/360',
      resource: {
        resourceType: 'HealthcareService',
        id: '360',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-22T12:20:39.521+00:00',
          source: '#1177a592b6dd4ac6',
        },
        identifier: [
          {
            use: 'official',
            value: 'aade5ee4-07d0-4155-a678-537607dfcb9f',
          },
        ],
        active: false,
        providedBy: {
          reference: 'Organization/319',
        },
        name: 'Test Health One',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/HealthcareService/322',
      resource: {
        resourceType: 'HealthcareService',
        id: '322',
        meta: {
          versionId: '3',
          lastUpdated: '2021-06-16T20:29:39.980+00:00',
          source: '#433a680e361de8a1',
        },
        identifier: [
          {
            use: 'official',
            value: '322',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/319',
        },
        name: 'test healthcare',
        comment: 'Ashfahan',
        extraDetails: 'testing',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/HealthcareService/424',
      resource: {
        resourceType: 'HealthcareService',
        id: '424',
        meta: {
          versionId: '1',
          lastUpdated: '2021-06-29T03:26:56.291+00:00',
          source: '#18845f880d003ae8',
        },
        identifier: [
          {
            use: 'official',
            value: '05ce06e8-157b-422b-8076-de2a86c47f88',
          },
        ],
        active: true,
        providedBy: {
          reference: 'Organization/361',
        },
        name: 'test create',
        comment: 'asd',
        extraDetails: 'sad',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const healthcareservice323: HealthcareService = {
  resourceType: 'HealthcareService',
  id: '323',
  meta: {
    versionId: '6',
    lastUpdated: '2021-06-29T03:26:29.448+00:00',
    source: '#9397ce74e631fa96',
  },
  identifier: [
    {
      use: 'official',
      value: '323',
    },
  ],
  active: true,
  providedBy: {
    reference: 'Organization/366',
  },
  name: 'testing  Healthcare 22',
  comment: 'test',
  extraDetails: 'test',
};

export const healthcareservice313: HealthcareService = {
  resourceType: 'HealthcareService',
  id: '313',
  meta: {
    versionId: '5',
    lastUpdated: '2021-06-16T20:30:54.480+00:00',
    source: '#555f2c7540f52c91',
  },
  identifier: [
    {
      use: 'official',
      value: '313',
    },
  ],
  active: true,
  providedBy: {
    reference: 'Organization/319',
  },
  name: 'ANC Service',
  comment: 'ANC Service',
  extraDetails: 'ANC Service',
};

export const healthcaredetail: HealthCareDetailProps = {
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
};
