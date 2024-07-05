import { GroupCharacteristic } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/groupCharacteristic';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { administrativeLevelSystemUri } from '../constants/codeSystems';
import { CodeableConcept } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/codeableConcept';

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
 * Checks a given coding matches a system and code that we are testing for
 *
 * @param coding - coding to test
 * @param system - system to test for
 * @param code - code to test for
 */
function codingMatchesCode(coding: Coding, system?: string, code?: string) {
  const thisCodingSystem = coding.system;
  const thisCodingCode = coding.code;
  if (system && code) {
    if (system && thisCodingSystem === system && code && thisCodingCode === code) {
      return true;
    }
  } else {
    if ((system && thisCodingSystem === system) || (code && thisCodingCode === code)) {
      return true;
    }
  }
  return false;
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
      if (codingMatchesCode(thisCoding, system, code)) {
        matchedCharacteristics.push(characteristic);
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
export function getAdministrativeLevelTypeCoding(admLevel: number): Coding {
  return {
    system: administrativeLevelSystemUri,
    code: `${admLevel}`,
    display: `Level ${admLevel}`,
  };
}

/**
 * get administrative level type coding from resource type
 *
 * @param type - resource type
 */
export function getLocationAdmLevelCoding(type?: CodeableConcept[]) {
  const typeCodingFlatMap = type?.flatMap((concept) => concept.coding) ?? [];
  const admLevelCoding = typeCodingFlatMap.filter(
    (coding) => coding?.system === administrativeLevelSystemUri
  );
  return admLevelCoding[0];
}

/**
 * get administrative level from resource type
 *
 * @param type - resource type
 */
export function getLocationAdmLevel(type: CodeableConcept[]) {
  const coding = getLocationAdmLevelCoding(type);
  return coding?.code;
}

/**
 * util to help check that a given coding exists in an array of concepts.
 * checks if any of the provided codings exists in one of the concepts.
 *
 * @param concepts - concepts to check codings in
 * @param codings - codings to check for
 */
export function conceptsHaveCodings(concepts: CodeableConcept[] = [], codings: Coding[] = []) {
  if (codings.length === 0) {
    return true;
  }
  if (concepts.length === 0) {
    return false;
  }
  const conceptCodingsBySystemAndCoding = concepts.reduce((acc, concept) => {
    for (const coding of concept.coding ?? []) {
      const systemKey = `${coding.system}`;
      const codeKey = `${coding.code}`;
      if (acc[systemKey] === undefined) {
        acc[systemKey] = {};
      }
      (acc[systemKey] as Record<string, Coding | undefined>)[codeKey] = coding;
      return acc;
    }
    return acc;
  }, {} as Record<string, Record<string, Coding | undefined> | undefined>);

  for (const coding of codings) {
    const codingSystemCheck = `${coding.system}`;
    const codingCodeCheck = `${coding.code}`;
    if (conceptCodingsBySystemAndCoding[codingSystemCheck]?.[codingCodeCheck]) {
      return true;
    }
  }
  return false;
}
