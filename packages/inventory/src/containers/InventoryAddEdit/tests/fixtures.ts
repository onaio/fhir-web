/* eslint-disable @typescript-eslint/naming-convention */
export const inventoryNoProduct = {
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
  _id: '69227a92-7979-490c-b149-f28669c6b760',
  _rev: 'v1',
  transaction_type: 'Inventory',
};

export const inventories = [
  {
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
  },
  {
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
  },
];

export const servicePoint1 = {
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

export const servicePoint2 = {
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

export const servicePoint3 = {
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

export const servicePoints = [servicePoint1, servicePoint2, servicePoint3];
