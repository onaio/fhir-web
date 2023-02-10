export const product1 = {
  uniqueId: 8,
  productName: 'Test optional Fields',
  isAttractiveItem: false,
  materialNumber: 'MT-123',
  availability: 'Test optional Fields',
  condition: '',
  appropriateUsage: '',
  accountabilityPeriod: 1,
  photoURL: 'http://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/8',
  serverVersion: 18,
};

export const product2 = {
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
};

export const product3 = {
  uniqueId: 5,
  productName: 'Scale Kit test',
  isAttractiveItem: false,
  materialNumber: 'MT-124',
  availability:
    'Kit composed of +/- 50 items used by midwives during labour. Supplied in a box marked. It should be located in the maternity unit of the facility.',
  condition:
    'The kit is designed to be used for approximately 50 births. After that, key components may be missing,  its important to check with the midwife that the kit can still be used fully.',
  appropriateUsage:
    'Note in the comments whatever items may be missing from the kit. as well as other items which the midwife may feel are necessary',
  accountabilityPeriod: 12,
  photoURL: 'http://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/5',
  serverVersion: 23,
};

export const product4 = {
  uniqueId: 3,
  productName: 'Motorbyke',
  isAttractiveItem: true,
  materialNumber: 'MT-124',
  availability:
    'Kit composed of +/- 50 items used by midwives during labour. Supplied in a box marked. It should be located in the maternity unit of the facility.',
  condition:
    'The kit is designed to be used for approximately 50 births. After that, key components may be missing, its important to check with the midwife that the kit can still be used fully.',
  appropriateUsage:
    'Note in the comments whatever items may be missing from the kit. as well as other items which the midwife may feel are necessary',
  accountabilityPeriod: 12,
  photoURL: 'http://mg-eusm-staging.smartregister.org/opensrp/multimedia/media/3',
  serverVersion: 12,
};

export const products = [product1, product2, product3, product4];

export const donors = [
  {
    key: 'ADB',
    value: 'ADB',
    label: 'ADB',
    description: '',
    uuid: '1585a75d-fe4e-4ef3-8a4f-97fc76ed79bd',
    settingsId: '4',
    settingIdentifier: 'inventory_donors',
    settingMetadataId: '56',
    v1Settings: false,
    resolveSettings: false,
    documentId: '3598a370-1bd1-41ed-8ef6-d28ad3ff700f',
    serverVersion: 4,
    type: 'SettingConfiguration',
  },
  {
    key: 'NATCOM_BELGIUM',
    value: 'NatCom Belgium',
    label: 'NatCom Belgium',
    description: '',
    uuid: 'eb70bad9-3907-45fd-9a59-d197c25d7fc3',
    settingsId: '4',
    settingIdentifier: 'inventory_donors',
    settingMetadataId: '57',
    v1Settings: false,
    resolveSettings: false,
    documentId: '3598a370-1bd1-41ed-8ef6-d28ad3ff700f',
    serverVersion: 4,
    type: 'SettingConfiguration',
  },
];

export const unicefSections = [
  {
    key: 'HEALTH',
    value: 'Health',
    label: 'Health',
    description: '',
    uuid: '8b723a4e-9df6-492f-98bf-2eaa5675a07e',
    settingsId: '3',
    settingIdentifier: 'inventory_unicef_sections',
    settingMetadataId: '48',
    v1Settings: false,
    resolveSettings: false,
    documentId: '1c2be1bb-3b1b-4978-849d-e2a0ef4d445d',
    serverVersion: 3,
    type: 'SettingConfiguration',
  },
  {
    key: 'WASH',
    value: 'WASH',
    label: 'WASH',
    description: '',
    uuid: 'ccd68cfc-eb23-4262-a924-3c3bc3f12ceb',
    settingsId: '3',
    settingIdentifier: 'inventory_unicef_sections',
    settingMetadataId: '49',
    v1Settings: false,
    resolveSettings: false,
    documentId: '1c2be1bb-3b1b-4978-849d-e2a0ef4d445d',
    serverVersion: 3,
    type: 'SettingConfiguration',
  },
  {
    key: 'NUTRITION',
    value: 'Nutrition',
    label: 'Nutrition',
    description: '',
    uuid: 'c3199b6e-35c1-4c9b-b53b-cde89be094b0',
    settingsId: '3',
    settingIdentifier: 'inventory_unicef_sections',
    settingMetadataId: '50',
    v1Settings: false,
    resolveSettings: false,
    documentId: '1c2be1bb-3b1b-4978-849d-e2a0ef4d445d',
    serverVersion: 3,
    type: 'SettingConfiguration',
  },
];
