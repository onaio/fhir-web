import { FormInstances, RawOpenSRPHierarchy } from '../../../../dist/types';
import { ServiceTypeSetting } from '../../../../dist/types/components/LocationForm/utils';
import { LocationUnitGroup } from '../../../ducks/location-unit-groups';
import { LocationUnit, LocationUnitStatus } from '../../../ducks/location-units';
import { LocationFormFields } from '../utils';

/* eslint-disable @typescript-eslint/naming-convention */
export const location1: LocationUnit = {
  type: 'Feature',
  id: 'b652b2f4-a95d-489b-9e28-4629746db96a',
  properties: {
    status: 'Active' as LocationUnitStatus,
    parentId: '',
    name: 'Kenya',
    geographicLevel: 0,
    version: 0,
    username: 'web-admin',
    name_en: 'Kenya',
  },
  serverVersion: 206,
  locationTags: [
    {
      id: 2,
      name: 'Sample 2',
    },
    {
      id: 3,
      name: 'Sample 3',
    },
  ],
};

export const location2 = {
  type: 'Feature',
  id: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
  properties: {
    status: 'Active' as LocationUnitStatus,
    name: 'The Root Location',
    geographicLevel: 0,
    version: 0,
    username: 'web-admin',
    area_code: 'test 55',
    sample_key: 'test1',
    area_nick_name: 'test2',
    sample_key_two: 'test3',
    name_en: 'The Root Location',
  },
  serverVersion: 336,
  locationTags: [{ id: 7, name: 'CHW ' }],
  // parentId is missing
} as unknown as LocationUnit;

export const location3 = {
  type: 'Feature',
  id: '45e4bd97-fe11-458b-b481-294b7d7e8270',
  geometry: {
    type: 'Point',
    coordinates: [49.52125, -16.78147],
  },
  properties: {
    type: 'Water Point',
    status: 'Active',
    parentId: 'c38e0c1e-3d72-424b-ac37-29e8d3e82026',
    name: 'Ambahoabe',
    geographicLevel: 0,
    version: 0,
    AdminLevelTag: 'Commune',
  },
  serverVersion: 18481,
} as LocationUnit;

export const location4 = {
  type: 'Feature',
  id: '38a0a19b-f91e-4044-a8db-a4b62490bf27',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [17.4298095703125, 29.897805610155874],
        [17.215576171875, 29.750070930806785],
        [17.4957275390625, 29.3965337391284],
        [17.9901123046875, 29.54000879252545],
        [18.006591796874996, 29.79298413547051],
        [17.4298095703125, 29.897805610155874],
      ],
    ],
  },
  properties: {
    status: 'Active',
    parentId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    name: 'MENABE',
    geographicLevel: 1,
    version: 0,
  },
  serverVersion: 2984,
  locationTags: [
    {
      id: 2,
      name: 'Region',
    },
  ],
} as LocationUnit;

export const generatedLocation1 = {
  id: 'b652b2f4-a95d-489b-9e28-4629746db96a',
  locationTags: [{ active: false, description: 'Sample description 2', id: 2, name: 'Sample 2' }],
  properties: {
    geographicLevel: 0,
    name: 'Kenya',
    name_en: 'Kenya',
    parentId: '',
    status: 'Active',
    username: 'web-admin',
    version: 0,
  },
  syncStatus: 'Synced',
  type: 'Feature',
};

export const generatedLocation2 = {
  properties: {
    geographicLevel: 0,
    username: 'web-admin',
    externalId: 'alien',
    parentId: '',
    name: 'Mars',
    name_en: 'The Root Location',
    status: 'InActive',
    type: 'School',
    'Sample Key': 'extraFields - Sample Key',
    version: 0,
    'Area Nick name': 'extraFields - Area Nick name',
    area_code: 'test 55',
    'Sample Key Two': 'extraFields - Sample Key Two',
    sample_key: 'test1',
    'Area code': 'extraFields - Area code',
    area_nick_name: 'test2',
    sample_key_two: 'test3',
  },
  id: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
  syncStatus: 'Synced',
  type: 'Feature',
  locationTags: [{ id: 7, active: true, name: 'CHW ', description: 'The chw tags ' }],
  geometry: { type: 'Point', coordinates: [19.92919921875, 30.135626231134587] },
};

export const generatedLocation4 = {
  properties: {
    geographicLevel: 1,
    parentId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    name: 'MENABE',
    name_en: 'MENABE',
    status: 'Active',
    type: 'School',
    version: 0,
  },
  id: '38a0a19b-f91e-4044-a8db-a4b62490bf27',
  syncStatus: 'Synced',
  type: 'Feature',
  locationTags: [{ id: 2, active: false, name: 'Sample 2', description: 'Sample description 2' }],
  geometry: { type: 'Point', coordinates: [19.56, 34.56] },
};

export const generatedLocation4Dot1 = {
  properties: {
    geographicLevel: 1,
    parentId: '03176924-6b3c-4b74-bccd-32afcceebabd',
    name: 'MENABE',
    name_en: 'MENABE',
    status: 'Active',
    version: 0,
  },
  id: '38a0a19b-f91e-4044-a8db-a4b62490bf27',
  syncStatus: 'Synced',
  type: 'Feature',
  locationTags: [{ id: 2, active: true, name: 'Region', description: 'Region Location Tag' }],
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [17.4298095703125, 29.897805610155874],
        [17.215576171875, 29.750070930806785],
        [17.4957275390625, 29.3965337391284],
        [17.9901123046875, 29.54000879252545],
        [18.006591796874996, 29.79298413547051],
        [17.4298095703125, 29.897805610155874],
      ],
    ],
  },
};

export const expectedFormFields: LocationFormFields = {
  externalId: '',
  extraFields: [],
  instance: 'core' as FormInstances,
  isJurisdiction: true,
  locationTags: [],
  name: '',
  serviceType: undefined,
  status: 'Active' as LocationUnitStatus,
  username: '',
};

export const expectedFormFields1: LocationFormFields = {
  externalId: undefined,
  extraFields: [{ geographicLevel: 0 }, { version: 0 }, { name_en: 'Kenya' }],
  geometry: undefined,
  id: 'b652b2f4-a95d-489b-9e28-4629746db96a',
  instance: 'core' as FormInstances,
  isJurisdiction: true,
  locationTags: [2, 3],
  name: 'Kenya',
  parentId: '',
  serviceType: undefined,
  status: 'Active' as LocationUnitStatus,
  username: 'web-admin',
};

export const locationUnitGroups: LocationUnitGroup[] = [
  { id: 2, active: false, name: 'Sample 2', description: 'Sample description 2' },
  { id: 4, active: false, name: 'Option1', description: 'asdsad' },
  { id: 3, active: false, name: 'Sample 3', description: 'Sample description 3' },
  { id: 1, active: false, name: 'Sample 1', description: 'Sample description 1' },
  { id: 5, active: false, name: 'testing', description: 'testing 111' },
  { id: 6, active: true, name: 'Demo Test', description: 'The demo unit group' },
];

export const serviceTypeSetting1 = {
  key: 'school',
  value: 'School',
  description: 'This service type is a school',
  uuid: '8718e71e-af01-49aa-85dd-381d29eaf6de',
  settingsId: '34',
  settingIdentifier: 'service_types',
  settingMetadataId: '34',
  v1Settings: false,
  resolveSettings: false,
  documentId: 'ab85b445-baec-4f94-94fe-ec76de36f9a3',
  serverVersion: 58,
  type: 'Setting',
};
export const serviceTypesSetting2 = {
  key: 'hospital',
  value: 'Hospital',
  description: 'This service type is a Hospital',
  uuid: '7d3c2a2c-4b67-4f98-aed5-90d1b597801a',
  settingsId: '34',
  settingIdentifier: 'service_types',
  settingMetadataId: '35',
  v1Settings: false,
  resolveSettings: false,
  documentId: 'ab85b445-baec-4f94-94fe-ec76de36f9a3',
  serverVersion: 58,
  type: 'Setting',
};
export const serviceTypeSettings = [
  serviceTypeSetting1,
  serviceTypesSetting2,
] as ServiceTypeSetting[];

export const fetchCalls1 = [
  [
    'https://opensrp-stage.smartregister.org/opensrp/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer sometoken',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=service_point_types',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer sometoken',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://opensrp-stage.smartregister.org/opensrp/rest/location-tag',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer sometoken',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://opensrp-stage.smartregister.org/opensrp/rest/v2/settings/?serverVersion=0&identifier=location_settings',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer sometoken',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
];

export const createdLocation1 = {
  properties: {
    geographicLevel: 1,
    externalId: 'secret',
    parentId: '51',
    name: 'area51',
    name_en: 'area51',
    status: 'InActive',
    type: 'School',
  },
  id: '9b782015-8392-4847-b48c-50c11638656b',
  syncStatus: 'Synced',
  type: 'Feature',
  geometry: [19.92919921875, 30.135626231134587],
};

export const locationTags = [
  { id: 2, active: false, name: 'Sample 2', description: 'Sample description 2' },
  { id: 3, active: false, name: 'Sample 3', description: 'Sample description 3' },
  { id: 7, active: true, name: 'CHW ', description: 'The chw tags ' },
  { id: 5, active: false, name: 'testing', description: 'testing 111' },
  { id: 6, active: false, name: 'Demo Test', description: 'The demo unit group' },
  { id: 8, active: false, name: 'ANC', description: 'Describes tags for ANC locations' },
  { id: 9, active: true, name: 'CHW - PATH', description: "CHW's tied to path" },
  { id: 10, active: true, name: 'HF- CHW', description: 'Health facilities - chw' },
  {
    id: 4,
    active: false,
    name: 'Nairobi West CHW Team',
    description: 'The Nairobi west chw team location tag',
  },
  { id: 11, active: true, name: 'Madaraka CHW team', description: 'The madaraka CHW team' },
  { id: 1, active: false, name: 'Sample test edit 1', description: 'Sample description 1' },
  { id: 12, active: true, name: 'Test', description: '' },
];

export const duplicateLocationTags = [
  { id: 1, active: true, name: 'Country', description: 'Country Location Tag' },
  { id: 3, active: true, name: 'District', description: 'District Location Tag' },
  { id: 4, active: true, name: 'Commune', description: 'Commune Location Tag' },
  { id: 5, active: true, name: 'Service Point', description: 'Service Point' },
  { id: 6, active: false, name: 'Location name', description: '' },
  { id: 1, active: true, name: 'Country', description: 'Country Location Tag' },
  { id: 3, active: true, name: 'District', description: 'District Location Tag' },
  { id: 4, active: true, name: 'Commune', description: 'Commune Location Tag' },
  { id: 5, active: true, name: 'Service Point', description: 'Service Point' },
  { id: 6, active: false, name: 'Location name', description: '' },
  { id: 1, active: true, name: 'Country', description: 'Country Location Tag' },
  { id: 3, active: true, name: 'District', description: 'District Location Tag' },
  { id: 4, active: true, name: 'Commune', description: 'Commune Location Tag' },
  { id: 5, active: true, name: 'Service Point', description: 'Service Point' },
  { id: 6, active: false, name: 'Location name', description: '' },
  { id: 2, active: true, name: 'Region', description: 'Region Location Tag' },
  { id: 2, active: true, name: 'Region', description: 'Region Location Tag' },
  { id: 2, active: true, name: 'Region', description: 'Region Location Tag' },
];

export const locationSettings = [
  {
    key: 'sample_key',
    label: 'Sample Key',
    description: '',
    uuid: '4f1502f7-1a7f-499d-89bc-55e9a9cb3fd5',
    settingsId: '1',
    settingIdentifier: 'location_settings',
    settingMetadataId: '1',
    v1Settings: false,
    resolveSettings: false,
    documentId: 'b818622a-c3c5-49cb-aaa7-c0aab8c12ba5',
    serverVersion: 51,
    type: 'SettingConfiguration',
  },
  {
    key: 'area_nick_name',
    label: 'Area Nick name',
    description: '',
    uuid: '9905fcdd-f2b7-46db-b999-ea7a60d692d8',
    settingsId: '1',
    settingIdentifier: 'location_settings',
    settingMetadataId: '2',
    v1Settings: false,
    resolveSettings: false,
    documentId: 'b818622a-c3c5-49cb-aaa7-c0aab8c12ba5',
    serverVersion: 53,
    type: 'SettingConfiguration',
  },
  {
    key: 'sample_key_two',
    label: 'Sample Key Two',
    description: '',
    uuid: '27cdf577-91ce-43e6-ab04-4fd519c96085',
    settingsId: '1',
    settingIdentifier: 'location_settings',
    settingMetadataId: '3',
    v1Settings: false,
    resolveSettings: false,
    documentId: 'b818622a-c3c5-49cb-aaa7-c0aab8c12ba5',
    serverVersion: 55,
    type: 'SettingConfiguration',
  },
  {
    key: 'area_code',
    label: 'Area code',
    description: '',
    uuid: '17e91e4c-3eb2-4496-a035-3fd6823295bf',
    settingsId: '1',
    settingIdentifier: 'location_settings',
    settingMetadataId: '4',
    v1Settings: false,
    resolveSettings: false,
    documentId: 'b818622a-c3c5-49cb-aaa7-c0aab8c12ba5',
    serverVersion: 57,
    type: 'SettingConfiguration',
  },
];

export const rawOpenSRPHierarchy1 = {
  locationsHierarchy: {
    map: {
      '95310ca2-02df-47ba-80fc-bf31bfaa88d7': {
        id: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
        label: 'The Root Location',
        node: {
          locationId: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
          name: 'The Root Location',
          attributes: { geographicLevel: 0 },
          voided: false,
        },
        children: {
          '421fe9fe-e48f-4052-8491-24d1e548daee': {
            id: '421fe9fe-e48f-4052-8491-24d1e548daee',
            label: 'bbb',
            node: {
              locationId: '421fe9fe-e48f-4052-8491-24d1e548daee',
              name: 'bbb',
              parentLocation: { locationId: '95310ca2-02df-47ba-80fc-bf31bfaa88d7', voided: false },
              attributes: { geographicLevel: 3 },
              voided: false,
            },
            parent: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
          },
          '0836e054-30b1-4690-985c-b729aa5fcc53': {
            id: '0836e054-30b1-4690-985c-b729aa5fcc53',
            label: 'aa',
            node: {
              locationId: '0836e054-30b1-4690-985c-b729aa5fcc53',
              name: 'aa',
              parentLocation: { locationId: '95310ca2-02df-47ba-80fc-bf31bfaa88d7', voided: false },
              attributes: { geographicLevel: 1 },
              voided: false,
            },
            parent: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
          },
        },
      },
    },
    parentChildren: {
      '95310ca2-02df-47ba-80fc-bf31bfaa88d7': [
        '421fe9fe-e48f-4052-8491-24d1e548daee',
        '0836e054-30b1-4690-985c-b729aa5fcc53',
      ],
    },
  },
};

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
