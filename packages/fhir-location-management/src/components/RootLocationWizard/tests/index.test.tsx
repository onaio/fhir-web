import { getRootLocationPayload } from '../index';

test('check generated root fhir location payload', () => {
  const rootFhirId = 'rootFhirId';
  const locationPayload = getRootLocationPayload(rootFhirId);
  expect(locationPayload).toEqual({
    alias: ['Root Location'],
    description:
      'This is the Root Location that all other locations are part of. Any locations that are directly part of this should be displayed as the root location.',
    id: 'rootFhirId',
    identifier: [
      {
        use: 'official',
        value: 'rootFhirId',
      },
    ],
    name: 'Root FHIR Location',
    partOf: undefined,
    physicalType: {
      coding: [
        {
          code: 'jdn',
          display: 'Jurisdiction',
          system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
        },
      ],
    },
    resourceType: 'Location',
    status: 'active',
    type: [
      {
        coding: [
          {
            code: 'jdn',
            display: 'Jurisdiction',
            system: 'http://terminology.hl7.org/CodeSystem/location-physical-type',
          },
        ],
      },
      {
        coding: [
          {
            code: '0',
            display: 'Level 0',
            system: 'https://smartregister.org/CodeSystem/administrative-level',
          },
        ],
      },
    ],
  });
});
