import { IFlag } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IFlag';

export const flag: IFlag = {
  resourceType: 'Flag',
  id: '1a3a0d65-b6ad-40af-b6cd-2e8801614de9',
  meta: {
    versionId: '1',
    lastUpdated: '2024-04-29T20:24:57.887+00:00',
    source: '#de39c0f1b54ecbf8',
    tag: [
      {
        system: 'https://smartregister.org/organisation-tag-id',
        code: 'd0882d3a-f35a-43cf-9d43-2ea9f9793e24',
        display: 'Practitioner Organization',
      },
      {
        system: 'https://smartregister.org/practitioner-tag-id',
        code: 'ab929110-6918-4d0b-8961-13cce4d5c76b',
        display: 'Practitioner',
      },
      {
        system: 'https://smartregister.org/care-team-tag-id',
        code: '4ddd4157-921b-4c65-820c-161b6e845011',
        display: 'Practitioner CareTeam',
      },
      {
        system: 'https://smartregister.org/location-tag-id',
        code: 'f15ff8ab-9475-4356-8363-7f518fdd66ce',
        display: 'Practitioner Location',
      },
      {
        system: 'https://smartregister.org/app-version',
        code: '1.1.0-eusm',
        display: 'Application Version',
      },
    ],
  },
  identifier: [
    {
      use: 'usual',
      value: '8561c6bd-5231-4b92-90f0-8505f92d32d2',
    },
  ],
  status: 'inactive',
  category: [
    {
      coding: [
        {
          system: 'http://smartregister.org/',
          code: 'PRODCHECK',
          display: 'Product Check',
        },
      ],
      text: 'Product Check',
    },
  ],
  code: {
    coding: [
      {
        system: 'http://smartregister.org/',
        code: '65347579',
        display: 'Visit Flag',
      },
    ],
    text: 'Visit Flag',
  },
  subject: {
    reference: 'Group/e44e26d0-1f7a-41d6-aa57-99c5712ddd66',
  },
  period: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    start: '2024-04-29T20:37:45+03:00' as any,
  },
  encounter: {
    reference: 'Encounter/eff29c76-2f98-4388-a7e8-878ed321d90e',
  },
  author: {
    reference: 'Practitioner/ab929110-6918-4d0b-8961-13cce4d5c76b',
  },
};

export const practitionerBundle = {
  resourceType: 'Bundle',
  id: '729bc784-ff52-4aaf-9a72-feafd0179b63',
  meta: {
    lastUpdated: '2024-07-17T09:47:12.426+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org/fhir/Practitioner/_search?identifier=fede58ef-4716-4ca8-8185-c04d8de77bcb',
    },
  ],
  entry: [
    {
      fullUrl: 'https://fhir.labs.smartregister.org/fhir/Practitioner/114',
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
};
