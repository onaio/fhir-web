import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

export const createdLocation1 = {
  id: '9b782015-8392-4847-b48c-50c11638656b',
  resourceType: 'Location',
  status: 'inactive',
  name: 'area51',
  alias: 'creepTown',
  description:
    'The secret Nevada base, known as Area 51, is often the subject of alien conspiracy theories.',
  partOf: { reference: 'Location/303', display: 'Ona Office Sub Location' },
  identifier: [{ use: 'official', value: '9b782015-8392-4847-b48c-50c11638656b' }],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'jdn',
        display: 'Jurisdiction',
      },
    ],
  },
} as unknown as ILocation;

export const createdLocation2 = {
  resourceType: 'Location',
  status: 'active',
  name: 'Yosemite',
  alias: 'world wonder',
  description: 'The Sub location',
  partOf: { reference: 'Location/2252', display: 'Root FHIR Location' },
  identifier: [{ use: 'official', value: '93bc9c3d-6321-41b0-9b93-1275d7114e22' }],
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'bu',
        display: 'Building',
      },
    ],
  },
  id: '303',
};
