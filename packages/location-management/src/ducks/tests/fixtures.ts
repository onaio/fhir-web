import { LocationGroup } from '../location-groups';
import { LocationUnit, LocationUnitStatus } from '../location-units';
/* eslint-disable @typescript-eslint/camelcase */

export const LocationGroup1: LocationGroup = {
  id: 1,
  active: true,
  name: 'Sample',
  description: 'Sample description',
};

export const LocationGroup2: LocationGroup = {
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
  locationGroups: [{ id: 2, name: 'Operational Area' }],
  properties: {
    geographicLevel: 5,
    name: 'Thailand test site BVBD 2',
    parentId: '45042d61-2305-4b67-87f4-a451339f79c7',
    status: 'Active' as LocationUnitStatus,
    username: 'bvbd_test',
    version: 0,
    name_en: 'Thailand test site BVBD 2',
    externalId: '1201030202',
    OpenMRS_Id: 'eed81741-f168-4723-99d8-16a513445a35',
  },
  syncStatus: 'Synced',
  type: 'Feature',
};

export const locationUnit2 = {
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
  locationGroups: [{ id: 2, name: 'Operational Area' }],
  properties: {
    geographicLevel: 5,
    name: 'Thailand test site BVBD 2',
    parentId: '45042d61-2305-4b67-87f4-a451339f79c7',
    status: 'Active',
    username: 'bvbd_test',
    version: 0,
    name_en: 'Thailand test site BVBD 2',
    externalId: '1201030202',
    OpenMRS_Id: 'eed81741-f168-4723-99d8-16a513445a35',
  },
  syncStatus: 'Synced',
  type: 'Feature',
};
