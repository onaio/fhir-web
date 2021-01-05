import { RawOpenSRPHierarchy } from '@opensrp/location-management/dist/types';
import { PlanDefinition } from '../../../ducks/assignments/types';

export const samplePlan: PlanDefinition = {
  identifier: '27362060-0309-411a-910c-64f55ede3758',
  version: '1',
  name: 'Default Plan 2020-11-24',
  title: 'Default Plan 2020-11-24',
  status: 'active',
  date: '2020-11-24',
  jurisdiction: [{ code: 'b652b2f4-a95d-489b-9e28-4629746db96a' }],
  serverVersion: 1,
  goal: [],
  action: [],
  experimental: false,
};

export const sampleHierarchy: RawOpenSRPHierarchy = {
  locationsHierarchy: {
    map: {
      'b652b2f4-a95d-489b-9e28-4629746db96a': {
        id: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        label: 'Kenya',
        node: {
          locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
          name: 'Kenya',
          attributes: { geographicLevel: 0 },
          voided: false,
        },
        children: {
          '35bf4771-a404-4220-bd9e-e2916decc116': {
            id: '35bf4771-a404-4220-bd9e-e2916decc116',
            label: 'Nairobi',
            node: {
              locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
              name: 'Nairobi',
              parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            children: {
              'e7820df5-403c-41ae-9f09-3785c36dd67c': {
                id: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                label: 'Nairobi West',
                node: {
                  locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                  name: 'Nairobi West',
                  parentLocation: {
                    locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  '65ac8a26-9fa5-4b57-956d-f19f6d220d47': {
                    id: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
                    label: 'Madaraka',
                    node: {
                      locationId: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
                      name: 'Madaraka',
                      parentLocation: {
                        locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    children: {
                      'd37de76b-c70b-48e4-9bbf-b317d62aabc8': {
                        id: 'd37de76b-c70b-48e4-9bbf-b317d62aabc8',
                        label: 'Nyayo Stadium',
                        node: {
                          locationId: 'd37de76b-c70b-48e4-9bbf-b317d62aabc8',
                          name: 'Nyayo Stadium',
                          parentLocation: {
                            locationId: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
                            voided: false,
                          },
                          attributes: { geographicLevel: 4 },
                          voided: false,
                        },
                        parent: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
                      },
                    },
                    parent: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                  },
                  'd0f1c378-5efd-49f8-87a9-c40fec7d83c7': {
                    id: 'd0f1c378-5efd-49f8-87a9-c40fec7d83c7',
                    label: 'South B',
                    node: {
                      locationId: 'd0f1c378-5efd-49f8-87a9-c40fec7d83c7',
                      name: 'South B',
                      parentLocation: {
                        locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    parent: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                  },
                  'c1fafcdb-c873-4e35-9dc7-ce89766f8182': {
                    id: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
                    label: 'Lang\u0027ata',
                    node: {
                      locationId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
                      name: 'Lang\u0027ata',
                      parentLocation: {
                        locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    parent: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                  },
                },
                parent: '35bf4771-a404-4220-bd9e-e2916decc116',
              },
              '435794fd-1102-4406-b3e5-c3662bf24863': {
                id: '435794fd-1102-4406-b3e5-c3662bf24863',
                label: 'Madaraka New',
                node: {
                  locationId: '435794fd-1102-4406-b3e5-c3662bf24863',
                  name: 'Madaraka New',
                  parentLocation: {
                    locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                parent: '35bf4771-a404-4220-bd9e-e2916decc116',
              },
              '69bb29ee-020c-459e-82e0-2915f5819e15': {
                id: '69bb29ee-020c-459e-82e0-2915f5819e15',
                label: 'Central',
                node: {
                  locationId: '69bb29ee-020c-459e-82e0-2915f5819e15',
                  name: 'Central',
                  parentLocation: {
                    locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  '4372700f-eec3-4943-b01e-6d795d73dc68': {
                    id: '4372700f-eec3-4943-b01e-6d795d73dc68',
                    label: 'Westlands',
                    node: {
                      locationId: '4372700f-eec3-4943-b01e-6d795d73dc68',
                      name: 'Westlands',
                      parentLocation: {
                        locationId: '69bb29ee-020c-459e-82e0-2915f5819e15',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    children: {
                      '9feb1a4d-3020-4f1a-bbd9-0a47b54d2ae9': {
                        id: '9feb1a4d-3020-4f1a-bbd9-0a47b54d2ae9',
                        label: 'CBD Nairobi',
                        node: {
                          locationId: '9feb1a4d-3020-4f1a-bbd9-0a47b54d2ae9',
                          name: 'CBD Nairobi',
                          parentLocation: {
                            locationId: '4372700f-eec3-4943-b01e-6d795d73dc68',
                            voided: false,
                          },
                          attributes: { geographicLevel: 4 },
                          voided: false,
                        },
                        parent: '4372700f-eec3-4943-b01e-6d795d73dc68',
                      },
                    },
                    parent: '69bb29ee-020c-459e-82e0-2915f5819e15',
                  },
                },
                parent: '35bf4771-a404-4220-bd9e-e2916decc116',
              },
            },
            parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
          },
          'b63cdf12-93b5-475e-8b20-851727e2870c': {
            id: 'b63cdf12-93b5-475e-8b20-851727e2870c',
            label: 'Mombasa',
            node: {
              locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c',
              name: 'Mombasa',
              parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            children: {
              '07a040ba-38f5-4d33-91b3-399e6e8a7604': {
                id: '07a040ba-38f5-4d33-91b3-399e6e8a7604',
                label: 'Makupa',
                node: {
                  locationId: '07a040ba-38f5-4d33-91b3-399e6e8a7604',
                  name: 'Makupa',
                  parentLocation: {
                    locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                parent: 'b63cdf12-93b5-475e-8b20-851727e2870c',
              },
              'c99a26f4-46e6-460a-bc88-88bf8462632f': {
                id: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
                label: 'Taita Taveta',
                node: {
                  locationId: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
                  name: 'Taita Taveta',
                  parentLocation: {
                    locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  '6090926d-3faa-42d9-84ed-a0d1d58fc2b4': {
                    id: '6090926d-3faa-42d9-84ed-a0d1d58fc2b4',
                    label: 'Test Locations',
                    node: {
                      locationId: '6090926d-3faa-42d9-84ed-a0d1d58fc2b4',
                      name: 'Test Locations',
                      parentLocation: {
                        locationId: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    parent: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
                  },
                },
                parent: 'b63cdf12-93b5-475e-8b20-851727e2870c',
              },
              'd5a952de-9b4d-40f0-8e93-4cb04b79cef9': {
                id: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
                label: 'Nyali',
                node: {
                  locationId: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
                  name: 'Nyali',
                  parentLocation: {
                    locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  'edd47424-eb37-44a4-9894-3d31690341d5': {
                    id: 'edd47424-eb37-44a4-9894-3d31690341d5',
                    label: 'Nyali Area',
                    node: {
                      locationId: 'edd47424-eb37-44a4-9894-3d31690341d5',
                      name: 'Nyali Area',
                      parentLocation: {
                        locationId: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    children: {
                      'b81c250f-fbc6-4cad-8446-f933ece440ef': {
                        id: 'b81c250f-fbc6-4cad-8446-f933ece440ef',
                        label: 'Nyali Beach',
                        node: {
                          locationId: 'b81c250f-fbc6-4cad-8446-f933ece440ef',
                          name: 'Nyali Beach',
                          parentLocation: {
                            locationId: 'edd47424-eb37-44a4-9894-3d31690341d5',
                            voided: false,
                          },
                          attributes: { geographicLevel: 4 },
                          voided: false,
                        },
                        parent: 'edd47424-eb37-44a4-9894-3d31690341d5',
                      },
                    },
                    parent: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
                  },
                },
                parent: 'b63cdf12-93b5-475e-8b20-851727e2870c',
              },
            },
            parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
          },
        },
      },
    },
    parentChildren: {
      'edd47424-eb37-44a4-9894-3d31690341d5': ['b81c250f-fbc6-4cad-8446-f933ece440ef'],
      '65ac8a26-9fa5-4b57-956d-f19f6d220d47': ['d37de76b-c70b-48e4-9bbf-b317d62aabc8'],
      'e7820df5-403c-41ae-9f09-3785c36dd67c': [
        'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
        '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
        'd0f1c378-5efd-49f8-87a9-c40fec7d83c7',
      ],
      '35bf4771-a404-4220-bd9e-e2916decc116': [
        '435794fd-1102-4406-b3e5-c3662bf24863',
        '69bb29ee-020c-459e-82e0-2915f5819e15',
        'e7820df5-403c-41ae-9f09-3785c36dd67c',
      ],
      'c99a26f4-46e6-460a-bc88-88bf8462632f': ['6090926d-3faa-42d9-84ed-a0d1d58fc2b4'],
      '4372700f-eec3-4943-b01e-6d795d73dc68': ['9feb1a4d-3020-4f1a-bbd9-0a47b54d2ae9'],
      'd5a952de-9b4d-40f0-8e93-4cb04b79cef9': ['edd47424-eb37-44a4-9894-3d31690341d5'],
      '69bb29ee-020c-459e-82e0-2915f5819e15': ['4372700f-eec3-4943-b01e-6d795d73dc68'],
      'b652b2f4-a95d-489b-9e28-4629746db96a': [
        '35bf4771-a404-4220-bd9e-e2916decc116',
        'b63cdf12-93b5-475e-8b20-851727e2870c',
      ],
      'b63cdf12-93b5-475e-8b20-851727e2870c': [
        'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
        'c99a26f4-46e6-460a-bc88-88bf8462632f',
        '07a040ba-38f5-4d33-91b3-399e6e8a7604',
      ],
    },
  },
};

export const organizations = [
  {
    id: 47,
    identifier: '7e133823-027f-4eb5-9042-8cdd434d7465',
    active: true,
    name: 'HF - CHW ONA TEST',
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
    id: 46,
    identifier: '1bab0331-36f1-4b30-8f3b-a5808c873c22',
    active: true,
    name: 'CHW - PATH',
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
    id: 45,
    identifier: 'f9d8fbaf-210c-492b-b9ad-926a3f23cb36',
    active: true,
    name: '',
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
    id: 44,
    identifier: '5f28ced1-e55a-4bff-8284-4736734a8ef7',
    active: true,
    name: 'ANC Test Team',
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
    id: 43,
    identifier: 'eba799aa-b390-4b81-bcd8-fd650033055f',
    active: true,
    name: 'The ANC Ref App Tema',
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
    id: 42,
    identifier: '42a93c43-db45-4b55-bbfe-93eb98d890e3',
    active: true,
    name: 'My Test Team 43',
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
    id: 41,
    identifier: 'a7d69052-2bbd-4c1f-963e-63dfd313631c',
    active: true,
    name: 'New Team 1',
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
    id: 40,
    identifier: 'cd73381f-3fa7-450d-8885-a8e720e236ec',
    active: false,
    name: 'test',
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
    id: 39,
    identifier: '143f58b0-47ab-41b3-9de1-4ca227da7dee',
    active: true,
    name: 'Sample test Team',
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
    id: 38,
    identifier: '091a90ed-890d-4bd6-930d-be1fa909737d',
    active: true,
    name: 'Sample test Team',
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
    id: 37,
    identifier: '92494ccc-c2b0-49b1-ade8-69898dc9d707',
    active: true,
    name: 'Sample test Team',
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
    id: 36,
    identifier: '0a8d47e0-f9f1-43b9-bf8d-2951b1887aff',
    active: true,
    name: 'Sample test Team',
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
    id: 35,
    identifier: 'd9d1b572-5582-4a55-8160-c7b922f47702',
    active: true,
    name: 'test team 11',
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
    id: 34,
    identifier: 'e9930f71-9895-401b-b3bd-ac2e9f75e701',
    active: true,
    name: 'sample test 1',
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
    id: 33,
    identifier: '1cc9a39a-f201-4c2f-b34d-50967c478817',
    active: true,
    name: 'test team 1',
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
    id: 32,
    identifier: 'f74e1f3b-cfb7-4d10-a59e-d01b05b6c12a',
    active: true,
    name: 'asdasd',
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
    id: 31,
    identifier: '21f84255-54d6-43ae-a1b6-d266c2ae943c',
    active: true,
    name: 'asdasd',
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
    id: 30,
    identifier: '5c5ba346-2e2e-4a30-810e-92d5cc842c1a',
    active: true,
    name: 'asdasd',
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
    id: 29,
    identifier: 'f9ee75b0-6042-4106-af89-d0c145709617',
    active: true,
    name: 'test again',
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
    id: 28,
    identifier: '8e2426a2-0b05-47d2-af74-88694faca00e',
    active: true,
    name: 'test again',
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
    id: 27,
    identifier: '199cf3e4-003f-4441-bc69-9bad691821c8',
    active: true,
    name: 'test again',
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
    id: 26,
    identifier: 'a01d9f96-4a51-451d-af28-8c6cf313ebbe',
    active: true,
    name: 'test',
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
    id: 25,
    identifier: 'a88cf059-8b84-4e05-9711-cf893afe67e3',
    active: true,
    name: 'test',
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
    id: 24,
    identifier: '0f2c943d-6215-4e45-9729-67a7b2b37e4a',
    active: true,
    name: 'asd',
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
    id: 23,
    identifier: 'a9c55fa8-0d56-4b16-9117-b13fc1c6d073',
    active: true,
    name: 'asd',
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
    id: 22,
    identifier: '982029c8-c24c-4247-9c7b-461c707f76f7',
    active: true,
    name: 'asd',
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
    id: 21,
    identifier: '74bf9d8c-5461-4e5c-a6c3-b54333394429',
    active: true,
    name: 'test',
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
    id: 20,
    identifier: '628d126a-f430-49b1-b81c-b4a922b07a48',
    active: true,
    name: 'test',
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
    id: 19,
    identifier: '0d0318f9-fdcc-4e3f-af31-ca006c9eb233',
    active: true,
    name: 'test new',
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
    id: 18,
    identifier: 'f26107fd-d4e3-489d-9869-14516d31a8b9',
    active: true,
    name: 'test new',
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
    id: 17,
    identifier: 'b24d68fa-f905-4d78-b592-e713db4f73e3',
    active: true,
    name: 'test',
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
    id: 16,
    identifier: 'f94759ef-57b4-48df-b12a-c11f56d2cae8',
    active: true,
    name: 'test',
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
    id: 15,
    identifier: '2544a714-e115-499a-9bbb-cd7e9761c173',
    active: true,
    name: 'test new',
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
    id: 14,
    identifier: '40d6f552-42b8-4975-bc42-7fd7c9763fc9',
    active: true,
    name: 'test new',
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
    id: 13,
    identifier: '8d816df7-92da-47a4-be6c-d3b960c97933',
    active: true,
    name: 'testing new',
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
    id: 12,
    identifier: 'c4635fda-6342-4d65-97f6-dc5ada4fe252',
    active: true,
    name: '',
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
    id: 11,
    identifier: 'eb8aba24-42d4-499f-b77e-6467701df629',
    active: true,
    name: 'asd',
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
    id: 10,
    identifier: '20c160e4-5248-4597-ac56-2ef7a5e09997',
    active: true,
    name: 'asd',
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
    id: 9,
    identifier: '8c77df5f-5e69-4670-ba29-858d5fce5bae',
    active: true,
    name: 'test',
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
    id: 8,
    identifier: '5627961d-1f39-4556-bb1f-88525b0c7743',
    active: true,
    name: '',
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
    id: 7,
    identifier: 'aa3d1bcf-820a-462a-9137-b56b493bd6e0',
    active: true,
    name: 'asd',
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
    id: 6,
    identifier: 'b9ed3cef-f802-4a55-8836-b3ef0e98c68f',
    active: true,
    name: 'test',
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
    id: 5,
    identifier: 'f7cb02b5-4d8c-4b8c-ad7c-de24b15776e5',
    active: true,
    name: 'test',
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
    id: 4,
    identifier: '7db7be9a-eccd-453e-a9a6-37a0f77a117f',
    active: true,
    name: 'asd',
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
    id: 3,
    identifier: '1cb25782-89ec-4a35-8609-95729cc1035f',
    active: true,
    name: 'Sample test Team 2',
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
    id: 2,
    identifier: '6f1de669-05c1-4b8b-90e3-0d47394e4644',
    active: true,
    name: 'Sample test Team',
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
    id: 1,
    identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
    active: true,
    name: 'Test Test Team One',
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

export const assignments = [
  {
    organizationId: '199cf3e4-003f-4441-bc69-9bad691821c8',
    jurisdictionId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1608584400000,
    toDate: 1609966800000,
  },
  {
    organizationId: '1cb25782-89ec-4a35-8609-95729cc1035f',
    jurisdictionId: '35bf4771-a404-4220-bd9e-e2916decc116',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1606770000000,
    toDate: null,
  },
  {
    organizationId: '1cb25782-89ec-4a35-8609-95729cc1035f',
    jurisdictionId: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1606770000000,
    toDate: null,
  },
  {
    organizationId: '1cb25782-89ec-4a35-8609-95729cc1035f',
    jurisdictionId: 'd0f1c378-5efd-49f8-87a9-c40fec7d83c7',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607461200000,
    toDate: null,
  },
  {
    organizationId: '1cb25782-89ec-4a35-8609-95729cc1035f',
    jurisdictionId: '4372700f-eec3-4943-b01e-6d795d73dc68',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: '8d816df7-92da-47a4-be6c-d3b960c97933',
    jurisdictionId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: '5c5ba346-2e2e-4a30-810e-92d5cc842c1a',
    jurisdictionId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: 'a7d69052-2bbd-4c1f-963e-63dfd313631c',
    jurisdictionId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: 'eba799aa-b390-4b81-bcd8-fd650033055f',
    jurisdictionId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: '42a93c43-db45-4b55-bbfe-93eb98d890e3',
    jurisdictionId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: '7e133823-027f-4eb5-9042-8cdd434d7465',
    jurisdictionId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: '6f1de669-05c1-4b8b-90e3-0d47394e4644',
    jurisdictionId: '435794fd-1102-4406-b3e5-c3662bf24863',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: '1bab0331-36f1-4b30-8f3b-a5808c873c22',
    jurisdictionId: '435794fd-1102-4406-b3e5-c3662bf24863',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607893200000,
    toDate: null,
  },
  {
    organizationId: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
    jurisdictionId: 'd0f1c378-5efd-49f8-87a9-c40fec7d83c7',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607461200000,
    toDate: null,
  },
  {
    organizationId: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
    jurisdictionId: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607461200000,
    toDate: null,
  },
  {
    organizationId: 'b9ed3cef-f802-4a55-8836-b3ef0e98c68f',
    jurisdictionId: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607461200000,
    toDate: null,
  },
  {
    organizationId: '1cb25782-89ec-4a35-8609-95729cc1035f',
    jurisdictionId: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607461200000,
    toDate: null,
  },
  {
    organizationId: '6f1de669-05c1-4b8b-90e3-0d47394e4644',
    jurisdictionId: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607461200000,
    toDate: null,
  },
  {
    organizationId: '7db7be9a-eccd-453e-a9a6-37a0f77a117f',
    jurisdictionId: 'b63cdf12-93b5-475e-8b20-851727e2870c',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607374800000,
    toDate: null,
  },
  {
    organizationId: 'e9930f71-9895-401b-b3bd-ac2e9f75e701',
    jurisdictionId: '69bb29ee-020c-459e-82e0-2915f5819e15',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607374800000,
    toDate: null,
  },
  {
    organizationId: '0a8d47e0-f9f1-43b9-bf8d-2951b1887aff',
    jurisdictionId: '69bb29ee-020c-459e-82e0-2915f5819e15',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607374800000,
    toDate: null,
  },
  {
    organizationId: '7db7be9a-eccd-453e-a9a6-37a0f77a117f',
    jurisdictionId: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607374800000,
    toDate: null,
  },
  {
    organizationId: 'b9ed3cef-f802-4a55-8836-b3ef0e98c68f',
    jurisdictionId: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607374800000,
    toDate: null,
  },
  {
    organizationId: '1cb25782-89ec-4a35-8609-95729cc1035f',
    jurisdictionId: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1607374800000,
    toDate: null,
  },
  {
    organizationId: '0a8d47e0-f9f1-43b9-bf8d-2951b1887aff',
    jurisdictionId: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1606770000000,
    toDate: null,
  },
];
