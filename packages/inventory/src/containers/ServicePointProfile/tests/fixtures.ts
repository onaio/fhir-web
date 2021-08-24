/* eslint-disable @typescript-eslint/camelcase */
import { LocationUnit } from '@opensrp-web/location-management/src/ducks/location-units';
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
  product: {
    uniqueId: 1,
    productName: 'Change name 1',
    isAttractiveItem: false,
    materialNumber: 'asd',
    availability: 'yeah',
    condition: 'this shoudl be optional',
    appropriateUsage: 'this should be optional',
    accountabilityPeriod: 2,
    photoURL: 'http://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4',
  },
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
  product: {
    uniqueId: 2,
    productName: 'Change name 2',
    isAttractiveItem: false,
    materialNumber: 'asd',
    availability: 'yeah',
    condition: 'this shoudl be optional',
    appropriateUsage: 'this should be optional',
    accountabilityPeriod: 2,
    photoURL: 'http://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/4',
  },
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

export const inventory3 = {
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
  locationId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
  customProperties: {
    'PO Number': '101',
    'UNICEF section': 'Health',
  },
  product: {
    uniqueId: 2,
    productName: 'Scale',
    isAttractiveItem: false,
    materialNumber: 'MT-124',
    availability:
      'Kit composed of +/- 50 items used by midwives during labour. Supplied in a box marked. It should be located in the maternity unit of the facility.',
    condition:
      'The kit is designed to be used for approximately 50 births. After that, key components may be missing, its important to check with the midwife that the kit can still be used fully.',
    appropriateUsage:
      'Note in the comments whatever items may be missing from the kit. as well as other items which the midwife may feel are necessary',
    accountabilityPeriod: 12,
    photoURL: '',
    serverVersion: 26,
  },
  _id: '69227a92-7979-490c-b149-f28669c6b760',
  _rev: 'v1',
  transaction_type: 'Inventory',
};

export const inventory4 = {
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
  locationId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
  customProperties: {
    'PO Number': '101',
    'UNICEF section': 'Health',
  },
  product: {
    uniqueId: 4,
    productName: 'Change name Test',
    isAttractiveItem: false,
    materialNumber: 'asd',
    availability: 'yeah',
    condition: 'this should be optional',
    appropriateUsage: 'this should be optional',
    accountabilityPeriod: 2,
    photoURL: '/multimedia/media/4',
    serverVersion: 17,
  },
  _id: 'c2635a23-a604-48fb-9e1c-8bf1e75e6759',
  _rev: 'v1',
  transaction_type: 'Inventory',
};

export const inventory5 = {
  type: 'Stock',
  serverVersion: 22,
  identifier: '13',
  providerid: '821f587d-734f-4263-8d50-ec37f2e84ef4',
  value: 10,
  version: 1612878072240,
  deliveryDate: 'Feb 3, 2021, 3:00:00 AM',
  accountabilityEndDate: 'May 3, 2021, 3:00:00 AM',
  donor: 'ADB',
  locationId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
  customProperties: {
    'PO Number': '57',
    'UNICEF section': 'WASH',
  },
  product: {
    uniqueId: 13,
    productName: 'Empty product test',
    isAttractiveItem: false,
    materialNumber: 'Prod01',
    availability: 'yeah',
    condition: '',
    appropriateUsage: '',
    accountabilityPeriod: 3,
    photoURL: '/multimedia/media/13',
    serverVersion: 24,
  },
  _id: '508e6cf8-7856-41d0-9bb3-707ebf81c987',
  _rev: 'v1',
  transaction_type: 'Inventory',
};

export const inventory6 = {
  type: 'Stock',
  serverVersion: 22,
  identifier: '13',
  providerid: '821f587d-734f-4263-8d50-ec37f2e84e7u',
  value: 10,
  version: 1612878072240,
  deliveryDate: 'Feb 3, 2021, 3:00:00 AM',
  accountabilityEndDate: 'May 3, 2021, 3:00:00 AM',
  donor: 'ADB',
  locationId: 'b8a7998c-5df6-49eb-98e6-f0675db71848',
  customProperties: {
    'PO Number': '57',
    'UNICEF section': 'WASH',
  },
  product: {
    uniqueId: 13,
    productName: 'Empty product test', // Same as inventory5
    isAttractiveItem: false,
    materialNumber: 'Prod01',
    availability: 'yeah',
    condition: '',
    appropriateUsage: '',
    accountabilityPeriod: 3,
    photoURL: '/multimedia/media/13',
    serverVersion: 24,
  },
  _id: '508e6cf8-7856-41d0-9bb3-707ebf81c985',
  _rev: 'v1',
  transaction_type: 'Inventory',
};

export const inventories = [
  inventory1,
  inventory2,
  inventory3,
  inventory4,
  inventory5,
  inventory6,
] as Inventory[];

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
  geometry: {
    type: 'Point',
    coordinates: [49.52125, -16.78147],
  },
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
    'https://test-example.com/rest/location/b8a7998c-5df6-49eb-98e6-f0675db71848?serverVersion=0&is_jurisdiction=false&return_geometry=true',
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
    'https://test-example.com/rest/stockresource/servicePointId/b8a7998c-5df6-49eb-98e6-f0675db71848?returnProduct=true',
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
