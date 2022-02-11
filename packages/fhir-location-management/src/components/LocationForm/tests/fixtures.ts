import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

export const createdLocation1 = ({
  resourceType: 'Location',
  status: 'suspended',
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
} as unknown) as ILocation;

export const createdLocation2 = {
  ...createdLocation1,
  status: 'active',
  name: 'Yosemite',
  alias: 'world wonder',
};
