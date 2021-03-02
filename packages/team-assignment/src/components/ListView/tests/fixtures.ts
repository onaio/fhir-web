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
              '58423dc0-6ef8-49c7-b2d3-3b70928d3c79': {
                id: '58423dc0-6ef8-49c7-b2d3-3b70928d3c79',
                label: 'Nairobi East',
                node: {
                  locationId: '58423dc0-6ef8-49c7-b2d3-3b70928d3c79',
                  name: 'Nairobi East',
                  parentLocation: {
                    locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                parent: '35bf4771-a404-4220-bd9e-e2916decc116',
              },
              'e7820df5-403c-41ae-9f09-3785c36dd67c': {
                id: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                label: 'Nairobi West 1',
                node: {
                  locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                  name: 'Nairobi West 1',
                  parentLocation: {
                    locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                children: {
                  '619d9a51-48aa-424d-be73-04e2688816cf': {
                    id: '619d9a51-48aa-424d-be73-04e2688816cf',
                    label: 'Nairobi West child',
                    node: {
                      locationId: '619d9a51-48aa-424d-be73-04e2688816cf',
                      name: 'Nairobi West child',
                      parentLocation: {
                        locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                        voided: false,
                      },
                      attributes: { geographicLevel: 3 },
                      voided: false,
                    },
                    parent: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                  },
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
              '4119edb0-6878-42f6-b3a4-609aae5e2dc1': {
                id: '4119edb0-6878-42f6-b3a4-609aae5e2dc1',
                label: 'Nairobi East',
                node: {
                  locationId: '4119edb0-6878-42f6-b3a4-609aae5e2dc1',
                  name: 'Nairobi East',
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
              '93ec5490-8460-473a-9fca-8cb7019f6cae': {
                id: '93ec5490-8460-473a-9fca-8cb7019f6cae',
                label: 'Mtaa Ngori',
                node: {
                  locationId: '93ec5490-8460-473a-9fca-8cb7019f6cae',
                  name: 'Mtaa Ngori',
                  parentLocation: {
                    locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
                    voided: false,
                  },
                  attributes: { geographicLevel: 2 },
                  voided: false,
                },
                parent: '35bf4771-a404-4220-bd9e-e2916decc116',
              },
            },
            parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
          },
          'ceaf29d0-0c6f-44ef-ac4a-458c24e2ff88': {
            id: 'ceaf29d0-0c6f-44ef-ac4a-458c24e2ff88',
            label: 'Taita',
            node: {
              locationId: 'ceaf29d0-0c6f-44ef-ac4a-458c24e2ff88',
              name: 'Taita',
              parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
          },
          '45aa723b-c48f-484b-a559-8b801465d751': {
            id: '45aa723b-c48f-484b-a559-8b801465d751',
            label: 'Kericho',
            node: {
              locationId: '45aa723b-c48f-484b-a559-8b801465d751',
              name: 'Kericho',
              parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
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
              'c930f2cf-9efd-4519-842f-848ffde9bb32': {
                id: 'c930f2cf-9efd-4519-842f-848ffde9bb32',
                label: 'Level Three Location',
                node: {
                  locationId: 'c930f2cf-9efd-4519-842f-848ffde9bb32',
                  name: 'Level Three Location',
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
          'cb4f6f62-5002-466c-8ff0-5367ea83d13d': {
            id: 'cb4f6f62-5002-466c-8ff0-5367ea83d13d',
            label: 'Central Province',
            node: {
              locationId: 'cb4f6f62-5002-466c-8ff0-5367ea83d13d',
              name: 'Central Province',
              parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
          },
          '05a28dbf-bc75-4a64-9870-42a02f531268': {
            id: '05a28dbf-bc75-4a64-9870-42a02f531268',
            label: 'Eastern',
            node: {
              locationId: '05a28dbf-bc75-4a64-9870-42a02f531268',
              name: 'Eastern',
              parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
          },
          'd1fb5ef2-3bf3-4073-a26c-ce6b1298ca68': {
            id: 'd1fb5ef2-3bf3-4073-a26c-ce6b1298ca68',
            label: 'Rift Valley',
            node: {
              locationId: 'd1fb5ef2-3bf3-4073-a26c-ce6b1298ca68',
              name: 'Rift Valley',
              parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
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
        '619d9a51-48aa-424d-be73-04e2688816cf',
        '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
        'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
        'd0f1c378-5efd-49f8-87a9-c40fec7d83c7',
      ],
      '35bf4771-a404-4220-bd9e-e2916decc116': [
        '69bb29ee-020c-459e-82e0-2915f5819e15',
        '435794fd-1102-4406-b3e5-c3662bf24863',
        '93ec5490-8460-473a-9fca-8cb7019f6cae',
        '58423dc0-6ef8-49c7-b2d3-3b70928d3c79',
        'e7820df5-403c-41ae-9f09-3785c36dd67c',
        '4119edb0-6878-42f6-b3a4-609aae5e2dc1',
      ],
      'c99a26f4-46e6-460a-bc88-88bf8462632f': ['6090926d-3faa-42d9-84ed-a0d1d58fc2b4'],
      '4372700f-eec3-4943-b01e-6d795d73dc68': ['9feb1a4d-3020-4f1a-bbd9-0a47b54d2ae9'],
      'd5a952de-9b4d-40f0-8e93-4cb04b79cef9': ['edd47424-eb37-44a4-9894-3d31690341d5'],
      '69bb29ee-020c-459e-82e0-2915f5819e15': ['4372700f-eec3-4943-b01e-6d795d73dc68'],
      'b652b2f4-a95d-489b-9e28-4629746db96a': [
        '35bf4771-a404-4220-bd9e-e2916decc116',
        'ceaf29d0-0c6f-44ef-ac4a-458c24e2ff88',
        '45aa723b-c48f-484b-a559-8b801465d751',
        'b63cdf12-93b5-475e-8b20-851727e2870c',
        'cb4f6f62-5002-466c-8ff0-5367ea83d13d',
        '05a28dbf-bc75-4a64-9870-42a02f531268',
        'd1fb5ef2-3bf3-4073-a26c-ce6b1298ca68',
      ],
      'b63cdf12-93b5-475e-8b20-851727e2870c': [
        'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
        '07a040ba-38f5-4d33-91b3-399e6e8a7604',
        'c930f2cf-9efd-4519-842f-848ffde9bb32',
        'c99a26f4-46e6-460a-bc88-88bf8462632f',
      ],
    },
  },
};

export const organizations = [
  {
    id: 57,
    identifier: '6ab07952-2448-4c36-ab9a-cbb5e48f5385',
    active: true,
    name: 'Team Blank test',
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
    id: 56,
    identifier: '1f9c6267-265d-4321-9655-e149b77a008a',
    active: true,
    name: 'TestTeam',
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
    id: 55,
    identifier: 'eb6257cb-821c-46e9-bcee-14cb0101cc42',
    active: true,
    name: 'Test Demo Team',
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
    id: 54,
    identifier: '82bb60ab-1da9-4358-8f80-31b2f01645b7',
    active: false,
    name: 'team 2',
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
    id: 53,
    identifier: '2ea3733c-04fa-4136-b091-726ec3205422',
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
    id: 52,
    identifier: '676bd889-e9ee-4f2b-94c3-0509466ad9be',
    active: true,
    name: 'Team 3',
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
    id: 51,
    identifier: 'e740e6b8-98dc-4d99-af34-ab2eb602da00',
    active: true,
    name: 'Team 2',
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
    id: 50,
    identifier: 'c53900dd-cb8e-4f9f-befc-5b21742612a1',
    active: true,
    name: 'Team 1',
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
    organizationId: '2ea3733c-04fa-4136-b091-726ec3205422',
    jurisdictionId: '45aa723b-c48f-484b-a559-8b801465d751',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1614114000000,
    toDate: 2560798800000,
  },
  {
    organizationId: '676bd889-e9ee-4f2b-94c3-0509466ad9be',
    jurisdictionId: '45aa723b-c48f-484b-a559-8b801465d751',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1614114000000,
    toDate: 2245266000000,
  },
  {
    organizationId: 'e740e6b8-98dc-4d99-af34-ab2eb602da00',
    jurisdictionId: '45aa723b-c48f-484b-a559-8b801465d751',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1614114000000,
    toDate: 1929646800000,
  },
  {
    organizationId: '1f9c6267-265d-4321-9655-e149b77a008a',
    jurisdictionId: '05a28dbf-bc75-4a64-9870-42a02f531268',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1614114000000,
    toDate: 2560798800000,
  },
  {
    organizationId: 'eb6257cb-821c-46e9-bcee-14cb0101cc42',
    jurisdictionId: '05a28dbf-bc75-4a64-9870-42a02f531268',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1614114000000,
    toDate: 2245266000000,
  },
  {
    organizationId: '2ea3733c-04fa-4136-b091-726ec3205422',
    jurisdictionId: '05a28dbf-bc75-4a64-9870-42a02f531268',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1614114000000,
    toDate: 1929646800000,
  },
  {
    organizationId: 'eb6257cb-821c-46e9-bcee-14cb0101cc42',
    jurisdictionId: 'cb4f6f62-5002-466c-8ff0-5367ea83d13d',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1612472400000,
    toDate: 1928005200000,
  },
  {
    organizationId: '676bd889-e9ee-4f2b-94c3-0509466ad9be',
    jurisdictionId: 'ceaf29d0-0c6f-44ef-ac4a-458c24e2ff88',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1612472400000,
    toDate: 1928005200000,
  },
  {
    organizationId: '2ea3733c-04fa-4136-b091-726ec3205422',
    jurisdictionId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611090000000,
    toDate: 2245698000000,
  },
  {
    organizationId: 'eb6257cb-821c-46e9-bcee-14cb0101cc42',
    jurisdictionId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611522000000,
    toDate: 2242674000000,
  },
  {
    organizationId: '2ea3733c-04fa-4136-b091-726ec3205422',
    jurisdictionId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611522000000,
    toDate: 1927054800000,
  },
  {
    organizationId: 'e740e6b8-98dc-4d99-af34-ab2eb602da00',
    jurisdictionId: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611090000000,
    toDate: 1926709200000,
  },
  {
    organizationId: 'e740e6b8-98dc-4d99-af34-ab2eb602da00',
    jurisdictionId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611090000000,
    toDate: 2245698000000,
  },
  {
    organizationId: 'eb6257cb-821c-46e9-bcee-14cb0101cc42',
    jurisdictionId: '65ac8a26-9fa5-4b57-956d-f19f6d220d47',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611090000000,
    toDate: 1926709200000,
  },
  {
    organizationId: '2ea3733c-04fa-4136-b091-726ec3205422',
    jurisdictionId: 'c930f2cf-9efd-4519-842f-848ffde9bb32',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611090000000,
    toDate: 1926622800000,
  },
  {
    organizationId: 'c53900dd-cb8e-4f9f-befc-5b21742612a1',
    jurisdictionId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    planId: '27362060-0309-411a-910c-64f55ede3758',
    fromDate: 1611090000000,
    toDate: 1930078800000,
  },
];
