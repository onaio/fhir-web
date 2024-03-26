import { GroupCharacteristic } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/groupCharacteristic';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

/**
 * finds a characteristic that has the given coding as one of its characteristic.codings
 *
 * @param characteristics - group characteristic
 * @param coding - coding to test for
 */
export function getCharacteristicWithCoding(
  characteristics: GroupCharacteristic[],
  coding: Coding
): GroupCharacteristic | undefined {
  return getCharacteristicWithCode(characteristics, coding.system, coding.code)[0];
}

/**
 * finds a characteristic that has a coding which has the given system and code.
 * you can also just pass a system or code to filter based on either
 *
 * @param characteristics - group characteristic
 * @param system - system to test for
 * @param code - code to test for
 */
export function getCharacteristicWithCode(
  characteristics: GroupCharacteristic[],
  system?: string,
  code?: string
) {
  if (!system && !code) {
    return characteristics;
  }
  const matchedCharacteristics = [];
  for (const characteristic of characteristics) {
    const codings = characteristic.code.coding ?? [];
    for (const thisCoding of codings) {
      const thisCodingSystem = thisCoding.system;
      const thisCodingCode = thisCoding.code;
      if (system && code) {
        if (system && thisCodingSystem === system && code && thisCodingCode === code) {
          matchedCharacteristics.push(characteristic);
        }
      } else {
        if ((system && thisCodingSystem === system) || (code && thisCodingCode === code)) {
          matchedCharacteristics.push(characteristic);
        }
      }
    }
  }
  return matchedCharacteristics;
}

/**
 * Generates administrative level type coding
 *
 * @param admLevel - administrative level
 */
export function getAdministrativeLevelTypeCoding(admLevel: number) {
  return {
    system: 'https://smartregister.org/codes/administrative-level',
    code: admLevel,
    display: `Level ${admLevel}`,
  };
}
