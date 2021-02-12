/* eslint-disable @typescript-eslint/camelcase */
import { LocationUnit } from '@opensrp/location-management/src/ducks/location-units';
import { Inventory } from '../../../ducks/inventory';

export const opensrpBaseURL = 'https://test-example.com/rest/';

export const madagascar = {
  type: 'Feature',
  id: 'f3199af5-2eaf-46df-87c9-40d596h8734',
  properties: { status: 'Active', name: 'Madagascar', geographicLevel: 0, version: 0 },
  serverVersion: 2968,
  locationTags: [{ id: 1, name: 'Country' }],
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const madagascarTree = require('./madagascar.json');

export const geographicHierarchy = [
  {
    geographicLevel: 0,
    label: 'Madagascar',
  },
  {
    geographicLevel: 1,
    label: 'ANALAMANGA',
  },
];

export const inventory1 = {
  type: 'Stock',
  serverVersion: 12,
  identifier: '2',
  providerid: '34615126-f515-4b31-80ee-c42227f6f0c5',
  value: 1,
  version: 1610612387610,
  deliveryDate: 'Jan 2, 2020, 3:00:00 AM',
  accountabilityEndDate: 'May 2, 2021, 3:00:00 AM',
  donor: 'ADB',
  serialNumber: '123434',
  locationId: 'b8a7998c-5df6-49eb-98e6-f0675db718481',
  customProperties: { 'PO Number': '101', 'UNICEF section': 'Health' },
  _id: '69227a92-7979-490c-b149-f28669c6b760',
  _rev: 'v1',
  transaction_type: 'Inventory',
};

export const inventory2 = {
  type: 'Stock',
  serverVersion: 14,
  identifier: '4',
  providerid: '34615126-f515-4b31-80ee-c42227f6f0c5',
  value: 1,
  version: 1610616763881,
  deliveryDate: 'Feb 2, 2020, 3:00:00 AM',
  accountabilityEndDate: 'May 2, 2021, 3:00:00 AM',
  donor: 'ADB',
  serialNumber: '123434',
  locationId: 'b8a7998c-5df6-49eb-98e6-f0675db718482',
  customProperties: { 'PO Number': '101', 'UNICEF section': 'Health' },
  _id: 'c2635a23-a604-48fb-9e1c-8bf1e75e6759',
  _rev: 'v1',
  transaction_type: 'Inventory',
};

export const inventories = [inventory1, inventory2] as Inventory[];

export const structure1 = {
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
} as LocationUnit;
export const structure2 = {
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
export const structure3 = {
  type: 'Feature',
  id: '45e4bd97-fe11-458b-b481-294b7d7e8270',
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
};
export const structures = [structure1, structure2, structure3] as LocationUnit[];

export const fetchCalls = [
  [
    'https://test-example.com/rest/location/getAll?serverVersion=0&is_jurisdiction=false',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer bamboocha',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://test-example.com/rest/location/findByProperties?is_jurisdiction=true&return_geometry=false&properties_filter=status:Active,geographicLevel:0',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer bamboocha',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://test-example.com/rest/location/hierarchy/f3199af5-2eaf-46df-87c9-40d596h8734?return_structure_count=false',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer bamboocha',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
  [
    'https://test-example.com/rest/stockresource/servicePointId/b8a7998c-5df6-49eb-98e6-f0675db71848',
    {
      headers: {
        accept: 'application/json',
        authorization: 'Bearer bamboocha',
        'content-type': 'application/json;charset=UTF-8',
      },
      method: 'GET',
    },
  ],
];
