/* eslint-disable @typescript-eslint/camelcase */
import { GoalUnit, PlanDefinition } from '@opensrp-web/plan-form-core';
import { Jurisdiction } from '../../../ducks/jurisdictions';

export const plan: PlanDefinition = {
  identifier: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
  version: '1',
  name: 'IRS-2020-12-16',
  title: 'IRS 2020-12-16 Fixtures test NMB',
  status: 'active',
  date: '2020-12-16',
  effectivePeriod: { start: '2020-12-16', end: '2021-01-05' },
  useContext: [
    { code: 'interventionType', valueCodableConcept: 'IRS' },
    { code: 'fiReason', valueCodableConcept: 'Routine' },
    { code: 'taskGenerationStatus', valueCodableConcept: 'False' },
  ],
  jurisdiction: [
    { code: '9b5dd829-89de-45a5-98f2-fd37787ae949' },
    { code: '6bb05db0-730b-409b-991d-4abfe6a59ea1' },
    { code: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb' },
    { code: '7d150b42-11e7-4362-8d0d-1a8ef506c754' },
    { code: '9fb0f2cf-7836-4557-a908-4b8cd628d193' },
  ],
  serverVersion: 1599112764594,
  goal: [
    {
      id: 'IRS',
      description: 'Spray structures in the operational area',
      priority: 'medium-priority',
      target: [
        {
          measure: 'Percent of structures sprayed',
          detail: {
            detailQuantity: { value: 90.0, comparator: '>=', unit: GoalUnit.PERCENT },
          },
          due: '2020-12-23',
        },
      ],
    },
  ],
  action: [
    {
      identifier: '37a3f91b-ec60-5498-ba47-892b328c3427',
      prefix: 1,
      title: 'Spray Structures',
      description: 'Visit each structure in the operational area and attempt to spray',
      code: 'IRS',
      timingPeriod: { start: '2020-12-16', end: '2020-12-23' },
      reason: 'Routine',
      goalId: 'IRS',
      subjectCodableConcept: { text: 'Location' },
      taskTemplate: 'Spray_Structures',
      type: 'create',
    },
  ],
  experimental: false,
};

export const sampleRawAssignments = [
  {
    organizationId: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
    jurisdictionId: '9b5dd829-89de-45a5-98f2-fd37787ae949',
    planId: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
    fromDate: 1608069600000,
    toDate: 1609711200000,
  },
  {
    organizationId: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
    jurisdictionId: '9b5dd829-89de-45a5-98f2-fd37787ae949',
    planId: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
    fromDate: 1608069600000,
    toDate: 1609711200000,
  },
  {
    organizationId: '9d0e8399-9c5e-5ad2-a73c-a86e00d5e699',
    jurisdictionId: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
    planId: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
    fromDate: 1608069600000,
    toDate: 1609711200000,
  },
  {
    organizationId: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
    jurisdictionId: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
    planId: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
    fromDate: 1608069600000,
    toDate: 1609711200000,
  },
];

export const sampleRawAssignment1 = {
  organizationId: '1',
  jurisdictionId: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
  planId: 'ae12d8c4-d2a8-53f9-b201-6cccdd42482b',
  fromDate: 1608069600000,
  toDate: 1609711200000,
};

export const organizations = [
  {
    id: 15,
    identifier: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
    active: true,
    name: 'Ona testOrg',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/organization-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 121,
    identifier: '9d0e8399-9c5e-5ad2-a73c-a86e00d5e699',
    active: true,
    name: 'NAIMA old test team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/organization-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 252,
    identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
    active: true,
    name: 'Test Test Team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/organization-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 254,
    identifier: '1deb6381-65c7-539e-9f9f-b99c76e4b4b8',
    active: true,
    name: 'Team22',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/organization-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 253,
    identifier: '6c19da3f-5dc1-5e82-945d-e4a7b0f80896',
    active: true,
    name: 'onang1',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/organization-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
];

export const jurisdictions: Jurisdiction[] = [
  {
    type: 'Feature',
    id: '9b5dd829-89de-45a5-98f2-fd37787ae949',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'IITANANGA',
      geographicLevel: 3,
      version: 2,
      username: 'var_nam',
      OpenMRS_Id: 'b158be62-354a-494d-831e-6f35b13b00c9',
      externalId: 'iitananga',
    },
    serverVersion: 1598526678792,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
  {
    type: 'Feature',
    id: '9fb0f2cf-7836-4557-a908-4b8cd628d193',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'OSHIPUMBU MAKILINDIDI NO 2-1',
      geographicLevel: 3,
      version: 0,
      OpenMRS_Id: '87155362-cbec-4d07-8f04-9d52dbedb49b',
      externalId: 'oshipumbu makilindidi no 2-1',
    },
    serverVersion: 1595840752740,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
  {
    type: 'Feature',
    id: '7d150b42-11e7-4362-8d0d-1a8ef506c754',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'OKANKETE-2',
      geographicLevel: 3,
      version: 0,
      OpenMRS_Id: '30d2fd68-90a8-41e2-87ca-8aa675a42ee4',
      externalId: 'okankete-2',
    },
    serverVersion: 1595840752760,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
  {
    type: 'Feature',
    id: '6bb05db0-730b-409b-991d-4abfe6a59ea1',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'IIYALA N.6',
      geographicLevel: 3,
      version: 0,
      OpenMRS_Id: '122f1ac6-41ab-4c13-9dc9-bde7cd38075b',
      externalId: 'iiyala n.6',
    },
    serverVersion: 1595840752815,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
  {
    type: 'Feature',
    id: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'OKASHANDJA',
      geographicLevel: 3,
      version: 0,
      OpenMRS_Id: '9def92a5-c420-4b46-ad73-0c54ef8bbef2',
      externalId: 'okashandja',
    },
    serverVersion: 1595840753076,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
  {
    type: 'Feature',
    id: '128ca67f-2ee6-4006-b86f-c59e572b27ea',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'MANDUME LOCATION',
      geographicLevel: 3,
      version: 0,
      OpenMRS_Id: 'e4c3b663-2e04-4d70-9b34-da604c85934d',
      externalId: 'mandume location',
    },
    serverVersion: 1598628202701,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
  {
    type: 'Feature',
    id: '29ac5641-0451-4ad4-8d99-329c797f2c3f',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'OSHIKANGO LOCATION',
      geographicLevel: 3,
      version: 0,
      OpenMRS_Id: 'f218c87b-d94c-4a15-8826-b23487cb1fdb',
      externalId: 'oshikango location',
    },
    serverVersion: 1598628202703,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
  {
    type: 'Feature',
    id: '40aee4db-1c05-4fdf-a984-612829d6900b',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'Test OA',
      geographicLevel: 3,
      version: 1,
      username: '',
      OpenMRS_Id: '0',
      externalId: '40aee4db-1c05-4fdf-a984-612829d6900b',
    },
    serverVersion: 1597679502171,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },

  {
    type: 'Feature',
    id: 'f3de8e52-0b54-4426-903a-5c55abad6660',
    properties: {
      status: 'Active',
      parentId: '634e07d1-16dc-4207-802e-108f9008214a',
      name: 'OMUSHESHE',
      geographicLevel: 3,
      version: 1,
      username: 'pierre_nam',
      OpenMRS_Id: '959f82c6-05ab-4d64-852f-70f985e6e419',
      externalId: 'omusheshe',
    },
    serverVersion: 1597917332417,
    locationTags: [{ id: 18, name: 'Operational Area' }],
  },
];

export const expectedMergedIds1 = [
  {
    jurisdictions: [
      {
        key: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        label: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        value: '9b5dd829-89de-45a5-98f2-fd37787ae949',
      },
      {
        key: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
        label: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
        value: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
      },
    ],
    organizations: [
      {
        key: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
        label: 'Ona testOrg',
        value: '0f38856a-6e0f-5e31-bf3c-a2ad8a53210d',
      },
    ],
  },
  {
    jurisdictions: [
      {
        key: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        label: '9b5dd829-89de-45a5-98f2-fd37787ae949',
        value: '9b5dd829-89de-45a5-98f2-fd37787ae949',
      },
    ],
    organizations: [
      {
        key: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
        label: 'Test Test Team',
        value: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
      },
    ],
  },
  {
    jurisdictions: [
      {
        key: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
        label: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
        value: '1b14ff5b-1f24-4b50-a59a-33cef0ed7bfb',
      },
    ],
    organizations: [
      {
        key: '9d0e8399-9c5e-5ad2-a73c-a86e00d5e699',
        label: 'NAIMA old test team',
        value: '9d0e8399-9c5e-5ad2-a73c-a86e00d5e699',
      },
    ],
  },
];

export const expectedAssignment =
  '[{"fromDate":"2019-12-30T00:00:00+00:00","jurisdiction":"9b5dd829-89de-45a5-98f2-fd37787ae949","organization":"0f38856a-6e0f-5e31-bf3c-a2ad8a53210d","plan":"ae12d8c4-d2a8-53f9-b201-6cccdd42482b","toDate":"2021-01-05T00:00:00+00:00"}]';

export const expectedAssignment1 =
  '[{"fromDate":"2020-12-15T22:00:00+00:00","jurisdiction":"9fb0f2cf-7836-4557-a908-4b8cd628d193","organization":"0f38856a-6e0f-5e31-bf3c-a2ad8a53210d","plan":"ae12d8c4-d2a8-53f9-b201-6cccdd42482b","toDate":"2021-01-05T00:00:00+00:00"},{"fromDate":"2020-12-15T22:00:00+00:00","jurisdiction":"9b5dd829-89de-45a5-98f2-fd37787ae949","organization":"0f38856a-6e0f-5e31-bf3c-a2ad8a53210d","plan":"ae12d8c4-d2a8-53f9-b201-6cccdd42482b","toDate":"2021-01-05T00:00:00+00:00"}]';
