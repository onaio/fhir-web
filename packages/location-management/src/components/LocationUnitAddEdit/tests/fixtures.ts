/* eslint-disable @typescript-eslint/camelcase */
import { ParsedHierarchyNode } from '../../../ducks/types';
import { LocationUnitGroup } from '../../../ducks/location-unit-groups';
import {
  LocationUnit,
  LocationUnitStatus,
  LocationUnitSyncStatus,
} from '../../../ducks/location-units';
import { FormField } from '../Form';

export const locationUnitgroups: LocationUnitGroup[] = [
  { id: 2, active: false, name: 'Sample 2', description: 'Sample description 2' },
  { id: 4, active: false, name: 'Option1', description: 'asdsad' },
  { id: 3, active: false, name: 'Sample 3', description: 'Sample description 3' },
  { id: 1, active: false, name: 'Sample 1', description: 'Sample description 1' },
  { id: 5, active: false, name: 'testing', description: 'testing 111' },
  { id: 6, active: true, name: 'Demo Test', description: 'The demo unit group' },
];

export const sampleLocationUnit: LocationUnit = {
  type: 'Feature',
  id: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
  properties: {
    status: LocationUnitStatus.ACTIVE,
    parentId: '',
    name: 'Tunisia',
    geographicLevel: 0,
    version: 0,
    externalId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
  },
  syncStatus: LocationUnitSyncStatus.SYNCED,
  locationTags: [{ id: 2, name: 'Sample 3' }],
};

export const BaseLocationUnits: LocationUnit[] = [
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

export const id: string = 'a26ca9c8-1441-495a-83b6-bb5df7698996';

export const LocationUnitGroupValue: FormField = {
  name: 'Tunisia',
  parentId: '',
  status: LocationUnitStatus.ACTIVE,
  locationTags: [2],
  type: 'Feature',
};

export const treedata: ParsedHierarchyNode[] = [
  {
    id: '35bf4771-a404-4220-bd9e-e2916decc116',
    label: 'Nairobi',
    node: {
      locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
      name: 'Nairobi',
      attributes: {
        geographicLevel: 0,
      },
      voided: false,
    },
    children: [
      {
        id: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
        label: 'Nairobi West',
        node: {
          locationId: 'e7820df5-403c-41ae-9f09-3785c36dd67c',
          name: 'Nairobi West',
          parentLocation: {
            locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
            voided: false,
          },
          attributes: {
            geographicLevel: 2,
          },
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
              attributes: {
                geographicLevel: 3,
              },
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
                  attributes: {
                    geographicLevel: 4,
                  },
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
        ],
        parent: '35bf4771-a404-4220-bd9e-e2916decc116',
        title: 'Nairobi West',
        key: 'Nairobi West',
      },
      {
        id: '69bb29ee-020c-459e-82e0-2915f5819e15',
        label: 'Central',
        node: {
          locationId: '69bb29ee-020c-459e-82e0-2915f5819e15',
          name: 'Central',
          parentLocation: {
            locationId: '35bf4771-a404-4220-bd9e-e2916decc116',
            voided: false,
          },
          attributes: {
            geographicLevel: 2,
          },
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
              attributes: {
                geographicLevel: 3,
              },
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
                  attributes: {
                    geographicLevel: 0,
                  },
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
    key: '35bf4771-a404-4220-bd9e-e2916decc116',
    title: 'Nairobi',
  },
  {
    id: '5a286fc9-e985-4aa7-a843-d71f93d1f4b4',
    label: 'asd',
    node: {
      locationId: '5a286fc9-e985-4aa7-a843-d71f93d1f4b4',
      name: 'asd',
      attributes: {
        geographicLevel: 0,
      },
      voided: false,
    },
    key: '5a286fc9-e985-4aa7-a843-d71f93d1f4b4',
    title: 'asd',
  },
  {
    id: 'c692b90d-ee20-4240-8904-8cbbbcab54f7',
    label: 'testing',
    node: {
      locationId: 'c692b90d-ee20-4240-8904-8cbbbcab54f7',
      name: 'testing',
      attributes: {
        geographicLevel: 0,
      },
      voided: false,
    },
    key: 'c692b90d-ee20-4240-8904-8cbbbcab54f7',
    title: 'testing',
  },
  {
    id: '66be3e59-5d49-4051-8ea4-dff7503d8d69',
    label: 'sad',
    node: {
      locationId: '66be3e59-5d49-4051-8ea4-dff7503d8d69',
      name: 'sad',
      attributes: {
        geographicLevel: 0,
      },
      voided: false,
    },
    key: '66be3e59-5d49-4051-8ea4-dff7503d8d69',
    title: 'sad',
  },
  {
    id: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
    label: 'Tunisia',
    node: {
      locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
      name: 'Tunisia',
      attributes: {
        geographicLevel: 0,
      },
      voided: false,
    },
    children: [
      {
        id: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
        label: 'KAIROUAN',
        node: {
          locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
          name: 'KAIROUAN',
          parentLocation: {
            locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
            voided: false,
          },
          attributes: {
            geographicLevel: 1,
          },
          voided: false,
        },
        children: [
          {
            id: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
            label: 'BOUHAJLA',
            node: {
              locationId: '7aeda5bb-62b9-4b11-b4a1-30fecd6b4c95',
              name: 'BOUHAJLA',
              parentLocation: {
                locationId: 'e66a6f38-93d5-42c2-ba1d-57b6d529baa6',
                voided: false,
              },
              attributes: {
                geographicLevel: 2,
              },
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
                  attributes: {
                    geographicLevel: 3,
                  },
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
                      attributes: {
                        geographicLevel: 4,
                      },
                      voided: false,
                    },
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
          parentLocation: {
            locationId: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
            voided: false,
          },
          attributes: {
            geographicLevel: 1,
          },
          voided: false,
        },
        children: [
          {
            id: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
            label: 'Bouficha',
            node: {
              locationId: '18b3841b-b5b1-4971-93d0-d36ac20c4565',
              name: 'Bouficha',
              parentLocation: {
                locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                voided: false,
              },
              attributes: {
                geographicLevel: 2,
              },
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
                  attributes: {
                    geographicLevel: 3,
                  },
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
                      attributes: {
                        geographicLevel: 4,
                      },
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
              parentLocation: {
                locationId: 'ede2c7cf-331e-497e-9c7f-2f914d734604',
                voided: false,
              },
              attributes: {
                geographicLevel: 2,
              },
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
                  attributes: {
                    geographicLevel: 3,
                  },
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
                      attributes: {
                        geographicLevel: 4,
                      },
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
    key: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
    title: 'Tunisia',
  },
  {
    id: 'a7baf57d-ad31-46d2-8d28-0c81dd306b09',
    label: 'OpenSRP web sample location',
    node: {
      locationId: 'a7baf57d-ad31-46d2-8d28-0c81dd306b09',
      name: 'OpenSRP web sample location',
      attributes: {
        geographicLevel: 0,
      },
      voided: false,
    },
    key: 'a7baf57d-ad31-46d2-8d28-0c81dd306b09',
    title: 'OpenSRP web sample location',
  },
  {
    id: 'a68d8a73-f235-4b9c-9717-41ba2546d771',
    label: 'OpenSRP web sample 1 location',
    node: {
      locationId: 'a68d8a73-f235-4b9c-9717-41ba2546d771',
      name: 'OpenSRP web sample 1 location',
      attributes: {
        geographicLevel: 0,
      },
      voided: false,
    },
    key: 'a68d8a73-f235-4b9c-9717-41ba2546d771',
    title: 'OpenSRP web sample 1 location',
  },
];
