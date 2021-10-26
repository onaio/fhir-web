export const singleLocation = {
  resourceType: 'Location',
  id: '303',
  meta: {
    versionId: '4',
    lastUpdated: '2021-10-14T13:12:22.740+00:00',
    source: '#13bbc7f09daa1751',
  },
  identifier: [
    {
      use: 'official',
      value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
    },
  ],
  status: 'active',
  name: 'Ona Office Sub Location',
  alias: ['ona office'],
  description: 'The Sub location',
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'jdn',
        display: 'Jurisdiction',
      },
    ],
  },
  partOf: {
    reference: 'Location/2252',
    display: 'Root FHIR Location',
  },
};
