import { LocationUnitGroup } from '../location-unit-groups';
import { LocationUnit, LocationUnitStatus } from '../location-units';
/* eslint-disable @typescript-eslint/camelcase */

export const locationUnitGroup1: LocationUnitGroup = {
  id: 1,
  active: true,
  name: 'Sample',
  description: 'Sample description',
};

export const locationUnitGroup2: LocationUnitGroup = {
  id: 2,
  active: true,
  name: 'Sample 2',
  description: 'Sample description 2',
};

export const locationUnit1: LocationUnit = {
  id: 'a7baf57d-ad31-46d2-8d28-0c81dd306b09',
  geometry: {
    coordinates: [
      [
        [
          [100.5244829, 13.8576014],
          [100.5242194, 13.8435594],
          [100.5151606, 13.8435594],
          [100.5123746, 13.8519458],
          [100.517497, 13.8608167],
          [100.5244829, 13.8576014],
        ],
      ],
    ],
    type: 'MultiPolygon',
  },
  locationTags: [{ id: 2, name: 'Operational Area' }],
  properties: {
    geographicLevel: 5,
    name: 'Thailand test site BVBD 2',
    parentId: '45042d61-2305-4b67-87f4-a451339f79c7',
    status: LocationUnitStatus.ACTIVE,
    username: 'bvbd_test',
    version: 0,
    name_en: 'Thailand test site BVBD 2',
    externalId: '1201030202',
    OpenMRS_Id: 'eed81741-f168-4723-99d8-16a513445a35',
  },
  syncStatus: 'Synced',
  type: 'Feature',
};

export const locationUnit2: LocationUnit = {
  geometry: {
    coordinates: [
      [
        [
          [100.5244829, 13.8576014],
          [100.5242194, 13.8435594],
          [100.5151606, 13.8435594],
          [100.5123746, 13.8519458],
          [100.517497, 13.8608167],
          [100.5244829, 13.8576014],
        ],
      ],
    ],
    type: 'MultiPolygon',
  },
  id: 'a7baf57d-ad31-46d2-8d28-0c81dd306b08',
  locationTags: [{ id: 2, name: 'Operational Area' }],
  properties: {
    geographicLevel: 5,
    name: 'Thailand test site BVBD 2',
    parentId: '45042d61-2305-4b67-87f4-a451339f79c7',
    status: LocationUnitStatus.ACTIVE,
    username: 'bvbd_test',
    version: 0,
    name_en: 'Thailand test site BVBD 2',
    externalId: '1201030202',
    OpenMRS_Id: 'eed81741-f168-4723-99d8-16a513445a35',
  },
  syncStatus: 'Synced',
  type: 'Feature',
};

export const locationUnit3 = {
  type: 'Feature',
  id: 'f3199af5-2eaf-46df-87c9-40d59606a2fb',
  properties: {
    type: 'Water Point',
    status: 'Active',
    parentId: '8e74d042-4a71-4694-a652-bc3ba6369101',
    name: 'EPP Ambodisatrana 2',
    geographicLevel: 0,
    version: 0,
    AdminLevelTag: 'Commune',
  },
  serverVersion: 18479,
};

export const locationUnit4 = {
  type: 'Feature',
  id: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
  properties: {
    type: 'Water Point',
    status: 'Active',
    parentId: '663d7935-35e7-4ccf-aaf5-6e16f2042570',
    name: 'Ambatoharanana',
    geographicLevel: 0,
    version: 0,
    AdminLevelTag: 'Commune',
  },
  serverVersion: 18480,
};

export const locations = [locationUnit1, locationUnit2, locationUnit3, locationUnit4];

export const locationTree = {
  keys: ['b652b2f4-a95d-489b-9e28-4629746db96a'],
  node: {
    id: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    key: 'Kenya',
    label: 'Kenya',
    node: {
      attributes: { geographicLevel: 0 },
      locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
      name: 'Kenya',
      voided: false,
    },
    attributes: { geographicLevel: 0 },
    locationId: 'b652b2f4-a95d-489b-9e28-4629746db96a',
    name: 'Kenya',
    voided: false,
    title: 'Kenya',
  },
};
