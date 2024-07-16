import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

export const Location: ILocation = {
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
