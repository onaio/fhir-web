import { LocationUnit, LocationUnitStatus } from '@opensrp/location-management';

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
    // eslint-disable-next-line @typescript-eslint/camelcase
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

export const baseLocationUnits: LocationUnit[] = [
  {
    type: 'Feature',
    id: 'a26ca9c8-1441-495a-83b6-bb5df7698996',
    properties: {
      status: 'Active' as LocationUnitStatus,
      parentId: '',
      name: 'Tunisia',
      geographicLevel: 0,
      version: 0,
      username: 'web-admin',
      sample_key_two: 'tesing',
      name_en: 'Tunisiaa',
    },
    serverVersion: 443,
  },
  {
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
    serverVersion: 445,
  },
  {
    type: 'Feature',
    id: '6bf9c085-350b-4bb2-990f-80dc2caafb33',
    properties: {
      status: 'Active' as LocationUnitStatus,
      parentId: '',
      name: 'Malawi',
      geographicLevel: 0,
      version: 0,
      username: 'web-admin',
      name_en: 'Malawi',
    },
    serverVersion: 447,
  },
  {
    type: 'Feature',
    id: '95310ca2-02df-47ba-80fc-bf31bfaa88d7',
    properties: {
      status: 'Active' as LocationUnitStatus,
      parentId: '',
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
    serverVersion: 449,
  },
  {
    type: 'Feature',
    id: 'cf3e899d-ab94-4779-8cd4-7817657504f3',
    properties: {
      status: 'Active' as LocationUnitStatus,
      parentId: '',
      name: 'Parent Weekly Call',
      geographicLevel: 0,
      version: 0,
      username: 'web-admin',
      name_en: 'Parent Weekly Call',
    },
    serverVersion: 459,
  },
  {
    type: 'Feature',
    id: '05d0fb90-5a0d-4f6d-92b2-110224818fdf',
    properties: {
      status: 'Active' as LocationUnitStatus,
      parentId: '',
      name: 'Tanzaniaa',
      geographicLevel: 0,
      version: 0,
      username: 'web-admin',
      name_en: 'Tanzaniaa',
    },
    serverVersion: 381,
    locationTags: [{ id: 6, name: 'Demo Test' }],
  },
];
