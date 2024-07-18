export const smartregisterSystemUri = 'http://smartregister.org/codes';
export const eusmServicePointCodeSystemUri =
  'http://smartregister.org/CodeSystem/eusm-service-point-type';
export const snomedCodeSystemUri = 'http://snomed.info/sct';
export const hl7PhysicalTypeCodeSystemUri =
  'http://terminology.hl7.org/CodeSystem/location-physical-type';
export const administrativeLevelSystemUri = 'https://smartregister.org/codes/administrative-level';

const baseValuSetURI = 'http://smartregister.org/ValueSet';
export const unicefSectionValueSetURI = `${baseValuSetURI}/eusm-unicef-sections`;
export const unicefDonorValueSetURI = `${baseValuSetURI}/eusm-donors`;
export const eusmServicePointValueSetURI = `${baseValuSetURI}/eusm-service-point-type`;

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
  code: '45981276',
  display: 'Donor',
};

export const inventoryGroupCoding = {
  system: smartregisterSystemUri,
  code: '78991122',
  display: 'Supply Inventory',
};

export const servicePointProfileInventoryListCoding = {
  system: smartregisterSystemUri,
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

export const keycloakIdentifierCoding = {
  system: 'http://hl7.org/fhir/identifier-type',
  code: 'KUID',
  display: 'Keycloak user ID',
};
