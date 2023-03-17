export const dataPage1 = {
  resourceType: 'Bundle',
  id: 'c19781e5-ebaa-45c2-bc9b-c64b502a5672',
  meta: {
    lastUpdated: '2022-01-13T15:23:21.950+00:00',
  },
  type: 'searchset',
  total: 55,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/_search?_count=2&_format=json&_getpagesoffset=0',
    },
    {
      relation: 'next',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=c19781e5-ebaa-45c2-bc9b-c64b502a5672&_getpagesoffset=2&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/214',
      resource: {
        resourceType: 'Questionnaire',
        id: '214',
        title: 'NSW Government My Personal Health Record',
        status: 'draft',
        subjectType: ['Patient'],
        date: '2013-02-19',
        publisher: 'New South Wales Department of Health',
        jurisdiction: [
          {
            coding: [
              {
                system: 'urn:iso:std:iso:3166',
                code: 'AU',
              },
            ],
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/219',
      resource: {
        resourceType: 'Questionnaire',
        id: '219',
        title: '219 - title',
        subjectType: ['Patient'],
        date: '2021-04-21T07:24:47.111Z',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const dataPage2 = {
  resourceType: 'Bundle',
  id: '91cb3828-8e1f-4063-b8f3-552b111f917d',
  meta: {
    lastUpdated: '2022-01-13T15:24:56.723+00:00',
  },
  type: 'searchset',
  total: 55,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/_search?_count=2&_format=json&_getpagesoffset=2',
    },
    {
      relation: 'next',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=91cb3828-8e1f-4063-b8f3-552b111f917d&_getpagesoffset=4&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
    {
      relation: 'previous',
      url: 'http://fhir.labs.smartregister.org/fhir?_getpages=91cb3828-8e1f-4063-b8f3-552b111f917d&_getpagesoffset=0&_count=2&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/426',
      resource: {
        resourceType: 'Questionnaire',
        id: '426',
        title: '426 - title',
        url: 'http://hl7.org/fhir/Questionnaire/f201',
        status: 'active',
        subjectType: ['Patient'],
        date: '2010',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/427',
      resource: {
        resourceType: 'Questionnaire',
        id: '427',
        url: 'http://hl7.org/fhir/Questionnaire/bb',
        title: 'NSW Government My Personal Health Record',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const searchData = {
  resourceType: 'Bundle',
  id: '46ca50b7-f272-4a4e-b1a7-65e35086d2f7',
  meta: {
    lastUpdated: '2022-02-28T20:39:07.382+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Questionnaire?_format=json&name%3Acontains=sample',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Questionnaire/14159',
      resource: {
        resourceType: 'Questionnaire',
        id: '14159',
        language: 'en',
        name: 'birth-notification-crvs-sample',
        title: 'Birth Notification CRVS sample',
        status: 'draft',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const hugeSinglePageDataSummary = {
  resourceType: 'Bundle',
  id: 'bcea91b2-3736-4857-8b05-b80636bc8a5f',
  meta: {
    lastUpdated: '2023-03-09T09:25:57.894+00:00',
    tag: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
        code: 'SUBSETTED',
        display: 'Resource encoded in summary mode',
      },
    ],
  },
  type: 'searchset',
  total: 100,
};

// group data - fifty records of em.
export const hugeSinglePageData = {
  resourceType: 'Bundle',
  id: 'c3df2f03-3c80-4331-b417-13e9dbbfbe0b',
  meta: {
    lastUpdated: '2023-03-09T09:33:46.152+00:00',
  },
  type: 'searchset',
  total: 100,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Group/_search?_count=50&_elements=name%2Cid',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org/fhir?_getpages=c3df2f03-3c80-4331-b417-13e9dbbfbe0b&_getpagesoffset=50&_count=50&_pretty=true&_bundletype=searchset&_elements=id,name',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/49778',
      resource: {
        resourceType: 'Group',
        id: '49778',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-27T00:15:33.608+00:00',
          source: '#971d99b7c2c14ce6',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Jan27Test',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/49779',
      resource: {
        resourceType: 'Group',
        id: '49779',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-27T00:19:31.139+00:00',
          source: '#f985a9e0f84f757a',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Jan27',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/968',
      resource: {
        resourceType: 'Group',
        id: '968',
        meta: {
          versionId: '2',
          lastUpdated: '2022-04-28T22:10:35.431+00:00',
          source: '#8c74dd01a22d03f7',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'TEST group  1',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/1084',
      resource: {
        resourceType: 'Group',
        id: '1084',
        meta: {
          versionId: '2',
          lastUpdated: '2022-06-27T03:22:11.910+00:00',
          source: '#c6f633c24d9e6c4b',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Demo FHIR Groups',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/131410',
      resource: {
        resourceType: 'Group',
        id: '131410',
        meta: {
          versionId: '2',
          lastUpdated: '2022-06-27T03:22:27.188+00:00',
          source: '#c6f633c24d9e6c4b',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'ANC patients',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/306',
      resource: {
        resourceType: 'Group',
        id: '306',
        meta: {
          versionId: '3',
          lastUpdated: '2022-06-27T03:22:29.082+00:00',
          source: '#c6f633c24d9e6c4b',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'ANC patients',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/307',
      resource: {
        resourceType: 'Group',
        id: '307',
        meta: {
          versionId: '3',
          lastUpdated: '2022-06-27T03:22:29.289+00:00',
          source: '#c6f633c24d9e6c4b',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'ANC patients',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/329',
      resource: {
        resourceType: 'Group',
        id: '329',
        meta: {
          versionId: '2',
          lastUpdated: '2022-06-27T03:22:29.496+00:00',
          source: '#c6f633c24d9e6c4b',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'TEST group ',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/134405',
      resource: {
        resourceType: 'Group',
        id: '134405',
        meta: {
          versionId: '1',
          lastUpdated: '2022-07-14T17:01:38.889+00:00',
          source: '#jvcDfvbfj0XHuZUS',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'ANC patients',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/135455',
      resource: {
        resourceType: 'Group',
        id: '135455',
        meta: {
          versionId: '1',
          lastUpdated: '2022-07-19T17:27:56.437+00:00',
          source: '#LcFTrebRvGyQXOGD',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'ANC patients',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/0dd7ecd8-b44b-49f0-a585-088d7de36916',
      resource: {
        resourceType: 'Group',
        id: '0dd7ecd8-b44b-49f0-a585-088d7de36916',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:18:26.093+00:00',
          source: '#b1f49c780840b653',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Paracetamol 100mg tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/84b00e9d-5b37-4469-a473-99bcb69099a8',
      resource: {
        resourceType: 'Group',
        id: '84b00e9d-5b37-4469-a473-99bcb69099a8',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:19:57.403+00:00',
          source: '#1a46cc89a099acf8',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Amoxicillin 250mg tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/a08d4942-5514-4950-819b-8d2beb0f187b',
      resource: {
        resourceType: 'Group',
        id: 'a08d4942-5514-4950-819b-8d2beb0f187b',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:21:12.004+00:00',
          source: '#fff679c711ada4c7',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Zinc sulfate 20mg tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/b30b36f7-3a42-44a2-b445-3e9fdabbbc7a',
      resource: {
        resourceType: 'Group',
        id: 'b30b36f7-3a42-44a2-b445-3e9fdabbbc7a',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:22:44.400+00:00',
          source: '#45be2f1eaae019ba',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Male Condoms',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/f60f98bd-97fd-484a-871c-7d24f5d5e97e',
      resource: {
        resourceType: 'Group',
        id: 'f60f98bd-97fd-484a-871c-7d24f5d5e97e',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-05T11:23:13.253+00:00',
          source: '#11a543715acab95f',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Female Condoms',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/90b10fdb-592c-47b6-a265-c8806a15d77c',
      resource: {
        resourceType: 'Group',
        id: '90b10fdb-592c-47b6-a265-c8806a15d77c',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:07:53.596+00:00',
          source: '#6436f8c5f4d5864a',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Artemether 20mg + Lumefatrine 120mg (1x6) Tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/dde1cd4f-bef4-4d2b-ad1b-f63b639ed254',
      resource: {
        resourceType: 'Group',
        id: 'dde1cd4f-bef4-4d2b-ad1b-f63b639ed254',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:09:10.103+00:00',
          source: '#9393ec2c3c90dbc6',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Artemether 20mg + Lumefatrine 120mg (2x6) Tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/592181bc-0a68-47bc-8275-ac853bba1b09',
      resource: {
        resourceType: 'Group',
        id: '592181bc-0a68-47bc-8275-ac853bba1b09',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:09:26.299+00:00',
          source: '#e3e8678f84456c49',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Artesunate 100mg Suppository Strips',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/b339a63b-84db-45e8-b357-7fcce3bddc34',
      resource: {
        resourceType: 'Group',
        id: 'b339a63b-84db-45e8-b357-7fcce3bddc34',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:09:49.669+00:00',
          source: '#28e6aad3168c2aab',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'AS (25mg) + AQ (67.5mg) ( 2-11months) Tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/7c5c3eb6-0382-4c7b-8c2d-3abfb31d29f4',
      resource: {
        resourceType: 'Group',
        id: '7c5c3eb6-0382-4c7b-8c2d-3abfb31d29f4',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:04.405+00:00',
          source: '#fdf04150dcf9dc32',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'AS (50mg) + AQ (135mg) ( 1-5years) Tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/9aa4d38c-1c8c-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '9aa4d38c-1c8c-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:25.174+00:00',
          source: '#9e68399ed24c29c9',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Dispensing Bags for Tablets (s)',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/3e5529c8-1c8d-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '3e5529c8-1c8d-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:42.203+00:00',
          source: '#ed5fd0ce92608473',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Dispensing Envelopes',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/1a06dc73-575f-4cff-9424-c95605ba7c30',
      resource: {
        resourceType: 'Group',
        id: '1a06dc73-575f-4cff-9424-c95605ba7c30',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:11:57.209+00:00',
          source: '#d5f7c8c9711078d3',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Disposable Gloves',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/961eb18c-1c8e-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '961eb18c-1c8e-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:12:22.358+00:00',
          source: '#a1c46f8cde629cbc',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Examination Gloves (Nitrile) Large',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/23c0fed8-1c8e-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '23c0fed8-1c8e-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:12:38.605+00:00',
          source: '#bddaf6d5d84e82c9',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Examination Gloves (Nitrile) Medium',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/8e6fc3e6-1c8d-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '8e6fc3e6-1c8d-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:12:55.303+00:00',
          source: '#9edc513b5e780319',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Examination Gloves (Nitrile) Small',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/75a7f6ec-1c8f-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '75a7f6ec-1c8f-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:13:18.233+00:00',
          source: '#839cc2f03dafdef9',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Face Mask, Surgical',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/3b603f72-22b1-40f9-b2e0-5e9c3df7003f',
      resource: {
        resourceType: 'Group',
        id: '3b603f72-22b1-40f9-b2e0-5e9c3df7003f',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:13:39.148+00:00',
          source: '#33d624162b79e9c5',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Face Shield (Flexible, Disposable)',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/21fc9958-1c8f-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '21fc9958-1c8f-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:14:13.494+00:00',
          source: '#80cdd5f88cbee79e',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Goggles',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/6e7d2b70-1c90-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '6e7d2b70-1c90-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:14:29.274+00:00',
          source: '#e3c0c78873252c3b',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Hand sanitizer gel 250ml w/ pump',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/951da426-1506-4cab-b03e-5583bdf0ca76',
      resource: {
        resourceType: 'Group',
        id: '951da426-1506-4cab-b03e-5583bdf0ca76',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:14:48.719+00:00',
          source: '#e5bd2c1cd7c9736a',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Male Condoms',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/f2734756-a6bb-4e90-bbc6-1c34f51d3d5c',
      resource: {
        resourceType: 'Group',
        id: 'f2734756-a6bb-4e90-bbc6-1c34f51d3d5c',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:15:13.553+00:00',
          source: '#3e76e58e7815c00b',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Microgynon',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/9738f1b3-dac8-4c71-bcaf-f1d7959b0681',
      resource: {
        resourceType: 'Group',
        id: '9738f1b3-dac8-4c71-bcaf-f1d7959b0681',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:15:34.612+00:00',
          source: '#0c5affcd20186e19',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Microlut',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/3af23539-850a-44ed-8fb1-d4999e2145ff',
      resource: {
        resourceType: 'Group',
        id: '3af23539-850a-44ed-8fb1-d4999e2145ff',
        meta: {
          versionId: '2',
          lastUpdated: '2022-08-16T09:15:52.994+00:00',
          source: '#37d9b080de8aa1a6',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'MNP',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/d1ad8a94-ba92-4f78-903d-0653ebd41336',
      resource: {
        resourceType: 'Group',
        id: 'd1ad8a94-ba92-4f78-903d-0653ebd41336',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:10.367+00:00',
          source: '#71254972ee243888',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'MUAC Strap',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/6a59c142-1c87-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '6a59c142-1c87-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:25.449+00:00',
          source: '#f3f438741f6dc153',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Oral Rehydration Salt 20.5g/L',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/567ec5f2-db90-4fac-b578-6e07df3f48de',
      resource: {
        resourceType: 'Group',
        id: '567ec5f2-db90-4fac-b578-6e07df3f48de',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:41.045+00:00',
          source: '#33f8025083126f96',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Paracetamol 100mg Tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/197faa30-1c90-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '197faa30-1c90-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:16:56.184+00:00',
          source: '#c2449bed305092bc',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'PPE Suit - Coverall, L',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/09a63acb-81d1-4117-b61d-a59dfdc177fa',
      resource: {
        resourceType: 'Group',
        id: '09a63acb-81d1-4117-b61d-a59dfdc177fa',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:17:11.472+00:00',
          source: '#1524ad1fef612b8e',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'PPE Suit - Coverall, M',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/24dcbee9-a665-4b3e-b97d-61b3ff675589',
      resource: {
        resourceType: 'Group',
        id: '24dcbee9-a665-4b3e-b97d-61b3ff675589',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:17:30.306+00:00',
          source: '#35fafb4705765116',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Rapid Diagnostic Test (RDT)',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/853341c8-1c91-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '853341c8-1c91-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:17:46.723+00:00',
          source: '#0e05f99fed601c98',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Safety Boxes',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/2265f6c0-610d-45f4-b023-c5b7fd5eb546',
      resource: {
        resourceType: 'Group',
        id: '2265f6c0-610d-45f4-b023-c5b7fd5eb546',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:18:00.950+00:00',
          source: '#6852d10cd58bda70',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Sayana Press',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org/fhir/Group/6815d390-1c8b-11ed-861d-0242ac120002',
      resource: {
        resourceType: 'Group',
        id: '6815d390-1c8b-11ed-861d-0242ac120002',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-16T09:18:18.593+00:00',
          source: '#00e7564035006483',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Zinc Sulfate 20mg Tablets',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/143661',
      resource: {
        resourceType: 'Group',
        id: '143661',
        meta: {
          versionId: '2',
          lastUpdated: '2022-09-08T08:58:47.686+00:00',
          source: '#e581c653297ad416',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Drug 12/34',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/143174',
      resource: {
        resourceType: 'Group',
        id: '143174',
        meta: {
          versionId: '4',
          lastUpdated: '2022-09-09T06:59:24.848+00:00',
          source: '#9f9b86631445633e',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Test Commodity2',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145482',
      resource: {
        resourceType: 'Group',
        id: '145482',
        meta: {
          versionId: '1',
          lastUpdated: '2022-09-28T08:04:18.098+00:00',
          source: '#5528df9ff6386998',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'test comodity',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145716',
      resource: {
        resourceType: 'Group',
        id: '145716',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:39:43.720+00:00',
          source: '#ad3bf81925e24a97',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'Blue Test',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145835',
      resource: {
        resourceType: 'Group',
        id: '145835',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:40:49.867+00:00',
          source: '#64c6db8dd9526654',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'chw malawi',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145837',
      resource: {
        resourceType: 'Group',
        id: '145837',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:41:09.426+00:00',
          source: '#7db563b3e979abaa',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'chw malawi',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Group/145838',
      resource: {
        resourceType: 'Group',
        id: '145838',
        meta: {
          versionId: '1',
          lastUpdated: '2022-10-13T01:42:39.638+00:00',
          source: '#ab0d2c3e94fa13d0',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        name: 'chw malawi',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
