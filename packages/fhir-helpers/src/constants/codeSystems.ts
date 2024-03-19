export const smartregisterSystemUri = 'http://smartregister.org/codes';
export const eusmServicePointCodeSystemUri =
  'http://smartregister.org/CodeSystem/eusm-service-point-type';
export const snomedCodeSystemUri = 'http://snomed.info/sct';

// TODO - not accurate
export const poNumberIdentifierCoding = {
  system: smartregisterSystemUri,
  code: 'PONUM',
  display: 'PO Number',
};

export const sectionCharacteristicCoding = {
  system: smartregisterSystemUri,
  code: '98734231',
  display: 'Unicef Section',
};

export const donorCharacteristicCoding = {
  system: smartregisterSystemUri,
  code: '45647484',
  display: 'Donor',
};

export const inventoryGroupCoding = {
  system: smartregisterSystemUri,
  code: '78991122',
  display: 'Supply Inventory',
};

export const servicePointProfileInventoryListCoding = {
  system: 'http://smartregister.org/',
  code: '22138876',
  display: 'Supply Inventory List',
};

const supplyMgSnomedCode = '386452003';
export const productCoding = {
  system: snomedCodeSystemUri,
  code: supplyMgSnomedCode,
  display: 'Supply management',
};

export const serialNumberIdentifierCoding = {
  system: smartregisterSystemUri,
  code: 'SERNUM',
  display: 'Serial Number',
};

export const quantityCharacteristicCoding = {
  system: smartregisterSystemUri,
  code: '33467722',
  display: 'Quantity',
};
