export const rootlocationFixture = {
  id: 'eff94f33-c356-4634-8795-d52340706ba9',
  identifier: [
    {
      use: 'official',
      value: 'eff94f33-c356-4634-8795-d52340706ba9',
    },
  ],
  resourceType: 'Location',
  status: 'active',
  name: 'Root FHIR Location',
  alias: ['Root Location'],
  description:
    'This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.',
  physicalType: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        code: 'jdn',
        display: 'Jurisdiction',
      },
    ],
  },
};
