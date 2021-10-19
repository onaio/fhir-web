/* eslint-disable @typescript-eslint/camelcase */
import {
  ParsedHierarchyNode,
  RawOpenSRPHierarchy,
  TreeNode,
} from '../../../ducks/locationHierarchy/types';
import { LocationUnitGroup } from '../../../ducks/location-unit-groups';
import { LocationUnit, LocationUnitStatus } from '../../../ducks/location-units';
import { generateJurisdictionTree } from '../../../ducks/locationHierarchy/utils';

export const locationUnitgroups: LocationUnitGroup[] = [
  { id: 2, active: false, name: 'Sample 2', description: 'Sample description 2' },
  { id: 4, active: false, name: 'Option1', description: 'asdsad' },
  { id: 3, active: false, name: 'Sample 3', description: 'Sample description 3' },
  { id: 1, active: false, name: 'Sample 1', description: 'Sample description 1' },
  { id: 5, active: false, name: 'testing', description: 'testing 111' },
  { id: 6, active: true, name: 'Demo Test', description: 'The demo unit group' },
];

export const baseLocationUnits: LocationUnit[] = [
  {
    type: 'Feature',
    id: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
    properties: {
      status: LocationUnitStatus.ACTIVE,
      parentId: '',
      name: 'Tunisia',
      geographicLevel: 0,
      version: 0,
    },
    serverVersion: 174,
    locationTags: [{ id: 2, name: 'Sample 3' }],
  },
  {
    type: 'Feature',
    id: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    properties: {
      status: LocationUnitStatus.ACTIVE,
      parentId: '',
      name: 'Kenya',
      geographicLevel: 0,
      version: 0,
      username: 'web-admin',
      name_en: 'Kenya',
    },
    serverVersion: 206,
    locationTags: [
      { id: 2, name: 'Sample 2' },
      { id: 3, name: 'Sample 3' },
    ],
  },
  {
    type: 'Feature',
    id: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
    properties: {
      status: LocationUnitStatus.ACTIVE,
      parentId: '',
      name: 'Malawi',
      geographicLevel: 0,
      version: 0,
      username: 'web-admin',
      name_en: 'Malawi',
    },
    serverVersion: 223,
    locationTags: [{ id: 4, name: 'Option1' }],
  },
];

export const id = 'a26ca9c8-1441-495a-83b6-bb5df7698996';

export const parsedHierarchy: ParsedHierarchyNode[] = [
  {
    id: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
    label: 'Tunisia',
    node: {
      locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
      name: 'Tunisia',
      attributes: { geographicLevel: 0 },
      voided: false,
    },
    children: [
      {
        id: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
        label: 'KAIROUAN',
        node: {
          locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
          name: 'KAIROUAN',
          parentLocation: { locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996', voided: false },
          attributes: { geographicLevel: 1 },
          voided: false,
        },
        children: [
          {
            id: 'de1a355f-4408-452c-a7ed-4f77ca855981',
            label: 'New City',
            node: {
              locationId: 'de1a355f-4408-452c-a7ed-4f77ca855981',
              name: 'New City',
              parentLocation: { locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            parent: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
            title: 'New City',
            key: 'New City',
          },
          {
            id: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
            label: 'BOUHAJLA',
            node: {
              locationId: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
              name: 'BOUHAJLA',
              parentLocation: { locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            children: [
              {
                id: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                label: 'BOUHAJLA Delegation',
                node: {
                  locationId: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                  name: 'BOUHAJLA Delegation',
                  parentLocation: {
                    locationId: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                    voided: false,
                  },
                  attributes: { geographicLevel: 3 },
                  voided: false,
                },
                children: [
                  {
                    id: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                    label: 'CSB Trad',
                    node: {
                      locationId: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                      name: 'CSB Trad',
                      parentLocation: {
                        locationId: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                        voided: false,
                      },
                      attributes: { geographicLevel: 4 },
                      voided: false,
                    },
                    children: [
                      {
                        id: '400e9d97-4640-44f5-af54-6f4b314384f5',
                        label: 'New Tunisia Test Location',
                        node: {
                          locationId: '400e9d97-4640-44f5-af54-6f4b314384f5',
                          name: 'New Tunisia Test Location',
                          parentLocation: {
                            locationId: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                            voided: false,
                          },
                          attributes: { geographicLevel: 5 },
                          voided: false,
                        },
                        parent: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                        title: 'New Tunisia Test Location',
                        key: 'New Tunisia Test Location',
                      },
                      {
                        id: '4b6a5077-58f5-46e4-b0c9-8324ad529df2',
                        label: 'Test Demo Locations',
                        node: {
                          locationId: '4b6a5077-58f5-46e4-b0c9-8324ad529df2',
                          name: 'Test Demo Locations',
                          parentLocation: {
                            locationId: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                            voided: false,
                          },
                          attributes: { geographicLevel: 5 },
                          voided: false,
                        },
                        parent: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                        title: 'Test Demo Locations',
                        key: 'Test Demo Locations',
                      },
                    ],
                    parent: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                    title: 'CSB Trad',
                    key: 'CSB Trad',
                  },
                ],
                parent: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                title: 'BOUHAJLA Delegation',
                key: 'BOUHAJLA Delegation',
              },
            ],
            parent: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
            title: 'BOUHAJLA',
            key: 'BOUHAJLA',
          },
          {
            id: '49b830dc-e550-43d1-9b1a-4c928eb2c3d7',
            label: 'Test Location',
            node: {
              locationId: '49b830dc-e550-43d1-9b1a-4c928eb2c3d7',
              name: 'Test Location',
              parentLocation: { locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            parent: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
            title: 'Test Location',
            key: 'Test Location',
          },
        ],
        parent: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
        title: 'KAIROUAN',
        key: 'KAIROUAN',
      },
      {
        id: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
        label: 'Sousse',
        node: {
          locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
          name: 'Sousse',
          parentLocation: { locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996', voided: false },
          attributes: { geographicLevel: 1 },
          voided: false,
        },
        children: [
          {
            id: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
            label: 'Bouficha',
            node: {
              locationId: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
              name: 'Bouficha',
              parentLocation: { locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            children: [
              {
                id: '70589012-899c-401d-85a1-13fabce26aab',
                label: 'Bouficha Delegation',
                node: {
                  locationId: '70589012-899c-401d-85a1-13fabce26aab',
                  name: 'Bouficha Delegation',
                  parentLocation: {
                    locationId: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                    voided: false,
                  },
                  attributes: { geographicLevel: 3 },
                  voided: false,
                },
                children: [
                  {
                    id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
                    label: 'CSB Hopital Bouficha',
                    node: {
                      locationId: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
                      name: 'CSB Hopital Bouficha',
                      parentLocation: {
                        locationId: '70589012-899c-401d-85a1-13fabce26aab',
                        voided: false,
                      },
                      attributes: { geographicLevel: 4 },
                      voided: false,
                    },
                    parent: '70589012-899c-401d-85a1-13fabce26aab',
                    title: 'CSB Hopital Bouficha',
                    key: 'CSB Hopital Bouficha',
                  },
                ],
                parent: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                title: 'Bouficha Delegation',
                key: 'Bouficha Delegation',
              },
            ],
            parent: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
            title: 'Bouficha',
            key: 'Bouficha',
          },
          {
            id: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
            label: 'Enfidha',
            node: {
              locationId: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
              name: 'Enfidha',
              parentLocation: { locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            children: [
              {
                id: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                label: 'Enfidha delegation',
                node: {
                  locationId: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                  name: 'Enfidha delegation',
                  parentLocation: {
                    locationId: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                    voided: false,
                  },
                  attributes: { geographicLevel: 3 },
                  voided: false,
                },
                children: [
                  {
                    id: '5d99a60e-126e-4c40-b5ce-439f920de090',
                    label: 'CSB Takrouna',
                    node: {
                      locationId: '5d99a60e-126e-4c40-b5ce-439f920de090',
                      name: 'CSB Takrouna',
                      parentLocation: {
                        locationId: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                        voided: false,
                      },
                      attributes: { geographicLevel: 4 },
                      voided: false,
                    },
                    parent: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                    title: 'CSB Takrouna',
                    key: 'CSB Takrouna',
                  },
                ],
                parent: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                title: 'Enfidha delegation',
                key: 'Enfidha delegation',
              },
            ],
            parent: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
            title: 'Enfidha',
            key: 'Enfidha',
          },
        ],
        parent: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
        title: 'Sousse',
        key: 'Sousse',
      },
    ],
    title: 'Tunisia',
    key: 'Tunisia',
  },
  {
    id: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    label: 'Kenya',
    node: {
      locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
      name: 'Kenya',
      attributes: { geographicLevel: 0 },
      voided: false,
    },
    children: [
      {
        id: '35bf4771-a404-4220-bd9e-e2916decc116',
        label: 'Nairobi',
        node: {
          locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
          name: 'Nairobi',
          parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
          attributes: { geographicLevel: 1 },
          voided: false,
        },
        children: [
          {
            id: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
            label: 'Nairobi West',
            node: {
              locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
              name: 'Nairobi West',
              parentLocation: { locationId: '35bf4771-a404-4220-bd9e-e2916decc116', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            children: [
              {
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
                children: [
                  {
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
                    title: 'Nyayo Stadium',
                    key: 'Nyayo Stadium',
                  },
                ],
                parent: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                title: 'Madaraka',
                key: 'Madaraka',
              },
              {
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
                title: 'South B',
                key: 'South B',
              },
              {
                id: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
                label: "Lang'ata",
                node: {
                  locationId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
                  name: "Lang'ata",
                  parentLocation: {
                    locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                    voided: false,
                  },
                  attributes: { geographicLevel: 3 },
                  voided: false,
                },
                parent: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
                title: "Lang'ata",
                key: "Lang'ata",
              },
            ],
            parent: '35bf4771-a404-4220-bd9e-e2916decc116',
            title: 'Nairobi West',
            key: 'Nairobi West',
          },
          {
            id: '435794fd-1102-4406-b3e5-c3662bf24863',
            label: 'Madaraka New',
            node: {
              locationId: '435794fd-1102-4406-b3e5-c3662bf24863',
              name: 'Madaraka New',
              parentLocation: { locationId: '35bf4771-a404-4220-bd9e-e2916decc116', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            parent: '35bf4771-a404-4220-bd9e-e2916decc116',
            title: 'Madaraka New',
            key: 'Madaraka New',
          },
          {
            id: '69bb29ee-020c-459e-82e0-2915f5819e15',
            label: 'Central',
            node: {
              locationId: '69bb29ee-020c-459e-82e0-2915f5819e15',
              name: 'Central',
              parentLocation: { locationId: '35bf4771-a404-4220-bd9e-e2916decc116', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            children: [
              {
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
                children: [
                  {
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
                    title: 'CBD Nairobi',
                    key: 'CBD Nairobi',
                  },
                ],
                parent: '69bb29ee-020c-459e-82e0-2915f5819e15',
                title: 'Westlands',
                key: 'Westlands',
              },
            ],
            parent: '35bf4771-a404-4220-bd9e-e2916decc116',
            title: 'Central',
            key: 'Central',
          },
        ],
        parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        title: 'Nairobi',
        key: 'Nairobi',
      },
      {
        id: 'b63cdf12-93b5-475e-8b20-851727e2870c',
        label: 'Mombasa',
        node: {
          locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c',
          name: 'Mombasa',
          parentLocation: { locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a', voided: false },
          attributes: { geographicLevel: 1 },
          voided: false,
        },
        children: [
          {
            id: '07a040ba-38f5-4d33-91b3-399e6e8a7604',
            label: 'Makupa',
            node: {
              locationId: '07a040ba-38f5-4d33-91b3-399e6e8a7604',
              name: 'Makupa',
              parentLocation: { locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            parent: 'b63cdf12-93b5-475e-8b20-851727e2870c',
            title: 'Makupa',
            key: 'Makupa',
          },
          {
            id: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
            label: 'Taita Taveta',
            node: {
              locationId: 'c99a26f4-46e6-460a-bc88-88bf8462632f',
              name: 'Taita Taveta',
              parentLocation: { locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            children: [
              {
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
                title: 'Test Locations',
                key: 'Test Locations',
              },
            ],
            parent: 'b63cdf12-93b5-475e-8b20-851727e2870c',
            title: 'Taita Taveta',
            key: 'Taita Taveta',
          },
          {
            id: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
            label: 'Nyali',
            node: {
              locationId: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
              name: 'Nyali',
              parentLocation: { locationId: 'b63cdf12-93b5-475e-8b20-851727e2870c', voided: false },
              attributes: { geographicLevel: 2 },
              voided: false,
            },
            children: [
              {
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
                children: [
                  {
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
                    title: 'Nyali Beach',
                    key: 'Nyali Beach',
                  },
                ],
                parent: 'd5a952de-9b4d-40f0-8e93-4cb04b79cef9',
                title: 'Nyali Area',
                key: 'Nyali Area',
              },
            ],
            parent: 'b63cdf12-93b5-475e-8b20-851727e2870c',
            title: 'Nyali',
            key: 'Nyali',
          },
        ],
        parent: 'b652b2f4-a95d-489b-9e28-4629746db96a',
        title: 'Mombasa',
        key: 'Mombasa',
      },
    ],
    title: 'Kenya',
    key: 'Kenya',
  },
  {
    id: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
    label: 'Malawi',
    node: {
      locationId: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
      name: 'Malawi',
      attributes: { geographicLevel: 0 },
      voided: false,
    },
    title: 'Malawi',
    key: 'Malawi',
  },
];

export const rawHierarchy: RawOpenSRPHierarchy[] = [
  {
    locationsHierarchy: {
      map: {
        'a26ca9c8-1441-495a-83b6-bb5df7698996': {
          id: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
          label: 'Tunisia',
          node: {
            locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
            name: 'Tunisia',
            attributes: { geographicLevel: 0 },
            voided: false,
          },
          children: {
            'e66a6f38-93d5-42c2-ba1d-57b6d529baa6': {
              id: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
              label: 'KAIROUAN',
              node: {
                locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                name: 'KAIROUAN',
                parentLocation: {
                  locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
                  voided: false,
                },
                attributes: { geographicLevel: 1 },
                voided: false,
              },
              children: {
                'de1a355f-4408-452c-a7ed-4f77ca855981': {
                  id: 'de1a355f-4408-452c-a7ed-4f77ca855981',
                  label: 'New City',
                  node: {
                    locationId: 'de1a355f-4408-452c-a7ed-4f77ca855981',
                    name: 'New City',
                    parentLocation: {
                      locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                      voided: false,
                    },
                    attributes: { geographicLevel: 2 },
                    voided: false,
                  },
                  parent: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                },
                '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95': {
                  id: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                  label: 'BOUHAJLA',
                  node: {
                    locationId: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                    name: 'BOUHAJLA',
                    parentLocation: {
                      locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                      voided: false,
                    },
                    attributes: { geographicLevel: 2 },
                    voided: false,
                  },
                  children: {
                    '3a2b98d2-b122-4d28-b0d8-528dd4b0a014': {
                      id: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                      label: 'BOUHAJLA Delegation',
                      node: {
                        locationId: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                        name: 'BOUHAJLA Delegation',
                        parentLocation: {
                          locationId: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                          voided: false,
                        },
                        attributes: { geographicLevel: 3 },
                        voided: false,
                      },
                      children: {
                        'bc171a9a-be50-4bdf-9843-54287f634c25': {
                          id: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                          label: 'CSB Trad',
                          node: {
                            locationId: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                            name: 'CSB Trad',
                            parentLocation: {
                              locationId: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                              voided: false,
                            },
                            attributes: { geographicLevel: 4 },
                            voided: false,
                          },
                          children: {
                            '400e9d97-4640-44f5-af54-6f4b314384f5': {
                              id: '400e9d97-4640-44f5-af54-6f4b314384f5',
                              label: 'New Tunisia Test Location',
                              node: {
                                locationId: '400e9d97-4640-44f5-af54-6f4b314384f5',
                                name: 'New Tunisia Test Location',
                                parentLocation: {
                                  locationId: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                                  voided: false,
                                },
                                attributes: { geographicLevel: 5 },
                                voided: false,
                              },
                              parent: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                            },
                            '4b6a5077-58f5-46e4-b0c9-8324ad529df2': {
                              id: '4b6a5077-58f5-46e4-b0c9-8324ad529df2',
                              label: 'Test Demo Locations',
                              node: {
                                locationId: '4b6a5077-58f5-46e4-b0c9-8324ad529df2',
                                name: 'Test Demo Locations',
                                parentLocation: {
                                  locationId: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                                  voided: false,
                                },
                                attributes: { geographicLevel: 5 },
                                voided: false,
                              },
                              parent: 'bc171a9a-be50-4bdf-9843-54287f634c25',
                            },
                          },
                          parent: '3a2b98d2-b122-4d28-b0d8-528dd4b0a014',
                        },
                      },
                      parent: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
                    },
                  },
                  parent: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                },
                '49b830dc-e550-43d1-9b1a-4c928eb2c3d7': {
                  id: '49b830dc-e550-43d1-9b1a-4c928eb2c3d7',
                  label: 'Test Location',
                  node: {
                    locationId: '49b830dc-e550-43d1-9b1a-4c928eb2c3d7',
                    name: 'Test Location',
                    parentLocation: {
                      locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                      voided: false,
                    },
                    attributes: { geographicLevel: 2 },
                    voided: false,
                  },
                  parent: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                },
              },
              parent: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
            },
            'ede2c7cf-331e-497e-9c7f-2f914d734604': {
              id: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
              label: 'Sousse',
              node: {
                locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                name: 'Sousse',
                parentLocation: {
                  locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
                  voided: false,
                },
                attributes: { geographicLevel: 1 },
                voided: false,
              },
              children: {
                '18b3841b-b5b1-4971-93d0-d36ac20c4565': {
                  id: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                  label: 'Bouficha',
                  node: {
                    locationId: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                    name: 'Bouficha',
                    parentLocation: {
                      locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                      voided: false,
                    },
                    attributes: { geographicLevel: 2 },
                    voided: false,
                  },
                  children: {
                    '70589012-899c-401d-85a1-13fabce26aab': {
                      id: '70589012-899c-401d-85a1-13fabce26aab',
                      label: 'Bouficha Delegation',
                      node: {
                        locationId: '70589012-899c-401d-85a1-13fabce26aab',
                        name: 'Bouficha Delegation',
                        parentLocation: {
                          locationId: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                          voided: false,
                        },
                        attributes: { geographicLevel: 3 },
                        voided: false,
                      },
                      children: {
                        'e2b4a441-21b5-4d03-816b-09d45b17cad7': {
                          id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
                          label: 'CSB Hopital Bouficha',
                          node: {
                            locationId: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
                            name: 'CSB Hopital Bouficha',
                            parentLocation: {
                              locationId: '70589012-899c-401d-85a1-13fabce26aab',
                              voided: false,
                            },
                            attributes: { geographicLevel: 4 },
                            voided: false,
                          },
                          parent: '70589012-899c-401d-85a1-13fabce26aab',
                        },
                      },
                      parent: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
                    },
                  },
                  parent: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                },
                'fee237ef-75e8-4ada-b15f-6d1a92633f33': {
                  id: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                  label: 'Enfidha',
                  node: {
                    locationId: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                    name: 'Enfidha',
                    parentLocation: {
                      locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                      voided: false,
                    },
                    attributes: { geographicLevel: 2 },
                    voided: false,
                  },
                  children: {
                    'e5631d3e-70c3-4083-ac17-46f9467c6dd5': {
                      id: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                      label: 'Enfidha delegation',
                      node: {
                        locationId: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                        name: 'Enfidha delegation',
                        parentLocation: {
                          locationId: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                          voided: false,
                        },
                        attributes: { geographicLevel: 3 },
                        voided: false,
                      },
                      children: {
                        '5d99a60e-126e-4c40-b5ce-439f920de090': {
                          id: '5d99a60e-126e-4c40-b5ce-439f920de090',
                          label: 'CSB Takrouna',
                          node: {
                            locationId: '5d99a60e-126e-4c40-b5ce-439f920de090',
                            name: 'CSB Takrouna',
                            parentLocation: {
                              locationId: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                              voided: false,
                            },
                            attributes: { geographicLevel: 4 },
                            voided: false,
                          },
                          parent: 'e5631d3e-70c3-4083-ac17-46f9467c6dd5',
                        },
                      },
                      parent: 'fee237ef-75e8-4ada-b15f-6d1a92633f33',
                    },
                  },
                  parent: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                },
              },
              parent: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
            },
          },
        },
      },
      parentChildren: {
        'e66a6f38-93d5-42c2-ba1d-57b6d529baa6': [
          '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
          '49b830dc-e550-43d1-9b1a-4c928eb2c3d7',
          'de1a355f-4408-452c-a7ed-4f77ca855981',
        ],
        'ede2c7cf-331e-497e-9c7f-2f914d734604': [
          'fee237ef-75e8-4ada-b15f-6d1a92633f33',
          '18b3841b-b5b1-4971-93d0-d36ac20c4565',
        ],
        '18b3841b-b5b1-4971-93d0-d36ac20c4565': ['70589012-899c-401d-85a1-13fabce26aab'],
        '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95': ['3a2b98d2-b122-4d28-b0d8-528dd4b0a014'],
        'bc171a9a-be50-4bdf-9843-54287f634c25': [
          '400e9d97-4640-44f5-af54-6f4b314384f5',
          '4b6a5077-58f5-46e4-b0c9-8324ad529df2',
        ],
        '70589012-899c-401d-85a1-13fabce26aab': ['e2b4a441-21b5-4d03-816b-09d45b17cad7'],
        'e5631d3e-70c3-4083-ac17-46f9467c6dd5': ['5d99a60e-126e-4c40-b5ce-439f920de090'],
        'a26ca9c8-1441-495a-83b6-bb5df7698996': [
          'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
          'ede2c7cf-331e-497e-9c7f-2f914d734604',
        ],
        'fee237ef-75e8-4ada-b15f-6d1a92633f33': ['e5631d3e-70c3-4083-ac17-46f9467c6dd5'],
        '3a2b98d2-b122-4d28-b0d8-528dd4b0a014': ['bc171a9a-be50-4bdf-9843-54287f634c25'],
      },
    },
  },
  {
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
                parentLocation: {
                  locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
                  voided: false,
                },
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
                      label: "Lang'ata",
                      node: {
                        locationId: 'c1fafcdb-c873-4e35-9dc7-ce89766f8182',
                        name: "Lang'ata",
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
                parentLocation: {
                  locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
                  voided: false,
                },
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
  },
  {
    locationsHierarchy: {
      map: {
        '6bf9c085-350b-4bb2-990f-80dc2caafb33': {
          id: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
          label: 'Malawi',
          node: {
            locationId: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
            name: 'Malawi',
            attributes: { geographicLevel: 0 },
            voided: false,
          },
        },
      },
      parentChildren: {},
    },
  },
];

export const fhirHierarchy = {
  resourceType: 'Bundle',
  id: '79202ca7-f148-47c2-b5bf-4a406b540495',
  meta: {
    lastUpdated: '2021-10-19T09:24:35.933+00:00',
  },
  type: 'searchset',
  total: 1,
  link: [
    {
      relation: 'self',
      url:
        'http://fhir.labs.smartregister.org/fhir/LocationHierarchy?_format=json&identifier=eff94f33-c356-4634-8795-d52340706ba9',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/LocationHierarchy/Location Resource : 2252',
      resource: {
        resourceType: 'LocationHierarchy',
        id: 'Location Resource : 2252',
        meta: {
          profile: ['http://hl7.org/fhir/profiles/custom-resource'],
        },
        LocationHierarchyTree: {
          locationsHierarchy: {
            listOfNodes: {
              treeNodeId: 'Location/2252',
              treeNode: [
                {
                  nodeId: 'Location/2252',
                  label: 'Root FHIR Location',
                  node: {
                    resourceType: 'Location',
                    id: '2252',
                    meta: {
                      versionId: '3',
                      lastUpdated: '2021-10-14T13:10:14.524+00:00',
                      source: '#5887f723a045b500',
                    },
                    identifier: [
                      {
                        use: 'official',
                        value: 'eff94f33-c356-4634-8795-d52340706ba9',
                      },
                    ],
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
                  },
                  children: [
                    {
                      childId: 'Location/303',
                      treeNode: {
                        nodeId: 'Location/303',
                        label: 'Ona Office Sub Location',
                        node: {
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
                                system:
                                  'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                code: 'jdn',
                                display: 'Jurisdiction',
                              },
                            ],
                          },
                          partOf: {
                            reference: 'Location/2252',
                            display: 'Root FHIR Location',
                          },
                        },
                        parent: 'Location/2252',
                        children: [
                          {
                            childId: 'Location/971',
                            treeNode: {
                              nodeId: 'Location/971',
                              label: 'Arundel mobile clinic',
                              node: {
                                resourceType: 'Location',
                                id: '971',
                                meta: {
                                  versionId: '14',
                                  lastUpdated: '2021-10-15T06:55:14.763+00:00',
                                  source: '#824ac068fc0cc017',
                                },
                                identifier: [
                                  {
                                    use: 'official',
                                    value: '0f184aac-83e7-498e-8232-5c8b360ad97b',
                                  },
                                ],
                                status: 'active',
                                name: 'Arundel mobile clinic',
                                alias: ['Part of'],
                                description: 'Vaccination Site',
                                physicalType: {
                                  coding: [
                                    {
                                      system:
                                        'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                      code: 'jdn',
                                      display: 'Jurisdiction',
                                    },
                                  ],
                                },
                                partOf: {
                                  reference: 'Location/303',
                                  display: 'Ona Office Sub Location',
                                },
                              },
                              parent: 'Location/303',
                            },
                          },
                          {
                            childId: 'Location/3453',
                            treeNode: {
                              nodeId: 'Location/3453',
                              label: 'Part Of Sub Location',
                              node: {
                                resourceType: 'Location',
                                id: '3453',
                                meta: {
                                  versionId: '2',
                                  lastUpdated: '2021-10-14T13:12:50.738+00:00',
                                  source: '#ee7f951054c1498e',
                                },
                                identifier: [
                                  {
                                    use: 'official',
                                    value: 'c3ff106e-91cb-4346-b45f-d7ad5346af5a',
                                  },
                                ],
                                status: 'active',
                                name: 'Part Of Sub Location',
                                alias: ['part off'],
                                description: 'Testing the part of ',
                                physicalType: {
                                  coding: [
                                    {
                                      system:
                                        'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                      code: 'jdn',
                                      display: 'Jurisdiction',
                                    },
                                  ],
                                },
                                partOf: {
                                  reference: 'Location/303',
                                  display: 'Ona Office Sub Location',
                                },
                              },
                              parent: 'Location/303',
                              children: [
                                {
                                  childId: 'Location/3590',
                                  treeNode: {
                                    nodeId: 'Location/3590',
                                    label: 'Test Loc 113',
                                    node: {
                                      resourceType: 'Location',
                                      id: '3590',
                                      meta: {
                                        versionId: '1',
                                        lastUpdated: '2021-10-15T09:59:46.554+00:00',
                                        source: '#bc4c70fa7e68ac36',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: '9f7f985b-8226-4971-ae67-c3ef241cbe01',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'Test Loc 113',
                                      alias: ['113'],
                                      description: 'Desc',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                  },
                                },
                                {
                                  childId: 'Location/739',
                                  treeNode: {
                                    nodeId: 'Location/739',
                                    label: 'Test Loc 1145',
                                    node: {
                                      resourceType: 'Location',
                                      id: '739',
                                      meta: {
                                        versionId: '19',
                                        lastUpdated: '2021-10-15T12:09:59.809+00:00',
                                        source: '#68c24697322968a2',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: '2829f50c-9189-43ee-8def-a775437c2f0b',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'Test Loc 1145',
                                      alias: ['ona officee'],
                                      description: 'This is a test',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                  },
                                },
                                {
                                  childId: 'Location/3464',
                                  treeNode: {
                                    nodeId: 'Location/3464',
                                    label: 'MOH HQ 1',
                                    node: {
                                      resourceType: 'Location',
                                      id: '3464',
                                      meta: {
                                        versionId: '6',
                                        lastUpdated: '2021-10-18T06:12:30.028+00:00',
                                        source: '#ab2dcd70fdef5e64',
                                      },
                                      identifier: [
                                        {
                                          use: 'official',
                                          value: 'f725bbe8-989d-4dd9-8346-d9630e813660',
                                        },
                                      ],
                                      status: 'active',
                                      name: 'MOH HQ 1',
                                      alias: ['mohh'],
                                      description: 'HL7 Headquarters',
                                      physicalType: {
                                        coding: [
                                          {
                                            system:
                                              'http://terminology.hl7.org/CodeSystem/location-physical-type',
                                            code: 'jdn',
                                            display: 'Jurisdiction',
                                          },
                                        ],
                                      },
                                      partOf: {
                                        reference: 'Location/3453',
                                        display: 'Part Of Sub Location',
                                      },
                                    },
                                    parent: 'Location/3453',
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              ],
            },
            parentChildren: [
              {
                identifier: 'Location/2252',
                childIdentifiers: ['Location/303'],
              },
              {
                identifier: 'Location/303',
                childIdentifiers: ['Location/971', 'Location/3453'],
              },
              {
                identifier: 'Location/3453',
                childIdentifiers: ['Location/3590', 'Location/739', 'Location/3464'],
              },
            ],
          },
        },
        locationId: '2252',
      },
    },
  ],
};

export const parsedTreeNode: TreeNode[] = rawHierarchy.map((e) => generateJurisdictionTree(e));
