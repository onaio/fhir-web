import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

/**
 * given group resource get characteristic whose coding matches certain system and code params
 *
 * @param obj -  the group resource
 */
export const getUnitMeasureCharacteristic = (obj: IGroup) => {
  for (const characteristic of obj.characteristic ?? []) {
    const characteristicCoding = characteristic.code.coding ?? [];
    for (const coding of characteristicCoding) {
      if (
        coding.system?.toLowerCase() === snomedCodeSystem.toLowerCase() &&
        coding.code === characteristicUnitMeasureCode
      ) {
        return characteristic;
      }
    }
  }
};

// constants

export const snomedCodeSystem = 'http://snomed.info/sct';
export const supplyMgSnomedCode = '386452003';
export const characteristicUnitMeasureCode = '767524001';
