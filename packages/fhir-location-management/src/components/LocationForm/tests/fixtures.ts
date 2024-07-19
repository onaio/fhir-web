import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

export const createdLocation1 = {
  resourceType: 'Location',
  status: 'inactive',
  name: 'area51',
  alias: 'creepTown',
  description:
    'The secret Nevada base, known as Area 51, is often the subject of alien conspiracy theories.',
  partOf: { reference: 'Location/303', display: 'Ona Office Sub Location' },
  type: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'bu',
          display: 'Building',
        },
      ],
    },
  ],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'bu',
        display: 'Building',
      },
    ],
  },
  id: '9b782015-8392-4847-b48c-50c11638656b',
  position: { longitude: '115.48', latitude: '37.14' },
} as unknown as ILocation;

export const createdLocation1WithGeometry = {
  resourceType: 'Location',
  status: 'inactive',
  name: 'area51',
  partOf: { reference: 'Location/303', display: 'Ona Office Sub Location' },
  type: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'jdn',
          display: 'Jurisdiction',
        },
      ],
    },
  ],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'jdn',
        display: 'Jurisdiction',
      },
    ],
  },
  id: '9b782015-8392-4847-b48c-50c11638656b',
  extension: [
    {
      url: 'http://build.fhir.org/extension-location-boundary-geojson.html',
      valueAttachment: {
        data: 'ewogICAgICAgICJ0eXBlIjogIlBvaW50IiwKICAgICAgICAiY29vcmRpbmF0ZXMiOiBbLTEyMi40MTk0LCAzNy43NzQ5XQogICAgICB9',
      },
    },
  ],
};
export const createdLocation2 = {
  resourceType: 'Location',
  id: '303',
  meta: {
    versionId: '4',
    lastUpdated: '2021-10-14T13:12:22.740+00:00',
    source: '#13bbc7f09daa1751',
  },
  identifier: [{ use: 'official', value: '93bc9c3d-6321-41b0-9b93-1275d7114e22' }],
  status: 'active',
  name: 'Yosemite',
  alias: 'world wonder',
  description: 'The Sub location',
  partOf: { reference: 'Location/2252', display: 'Root FHIR Location' },
  type: [
    {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          code: 'bu',
          display: 'Building',
        },
      ],
    },
  ],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'bu',
        display: 'Building',
      },
    ],
  },
};

export const parentNode1 = {
  children: [],
  model: {
    nodeId: 'Location/8af08722-01bf-4d96-90b7-23fcd068fe38',
    label: 'Level 1',
    node: {
      type: [
        {
          coding: [
            {
              system: 'https://smartregister.org/codes/administrative-level',
              code: '1',
              display: 'Level 1',
            },
          ],
        },
      ],
    },
    parent: 'Location/137703',
    administrativeLevel: 1,
    children: [],
  },
};

export const parentNode2 = {
  children: [],
  model: {
    nodeId: 'Location/8af08722-01bf-4d96-90b7-23fcd068fe38',
    label: 'Level 2',
    node: {
      type: [
        {
          coding: [
            {
              system: 'https://smartregister.org/codes/administrative-level',
              code: '2',
              display: 'Level 2',
            },
          ],
        },
      ],
    },
    parent: 'Location/137703',
    administrativeLevel: 2,
    children: [],
  },
};
