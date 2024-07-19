// location physical types.
export const physicalTypeValueSetUrl = 'http://hl7.org/fhir/ValueSet/location-physical-type';
export enum PhysicalTypeCodes {
  JURISDICTION = 'jdn',
  BUILDING = 'bu',
}

/**
 * https://www.hl7.org/fhir/R4/valueset-group-type.html
 */
export const R4GroupTypeCodesValueSetUrl = 'http://hl7.org/fhir/ValueSet/group-type';
export enum R4GroupTypeCodes {
  MEDICATION = 'medication',
  DEVICE = 'device',
  SUBSTANCE = 'substance',
}
