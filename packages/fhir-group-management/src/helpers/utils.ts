import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { binaryResourceType, groupResourceType } from '../constants';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { GroupCharacteristic } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/groupCharacteristic';
import { isEqual } from 'lodash';
import { useQuery } from 'react-query';

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

export const photoUploadCharacteristicCoding = {
  system: 'http://snomed.info/sct',
  code: '1231415',
  display: 'Product Image code',
};

export const accountabilityCharacteristicCoding = {
  system: 'http://snomed.info/sct',
  code: '67869606',
  display: 'Accountability period (in months)',
};

export const appropriateUsageCharacteristicCoding = {
  system: 'http://snomed.info/sct',
  code: '56758595',
  display: 'Is it being used appropriately? (optional)',
};

export const conditionCharacteristicCoding = {
  system: 'http://snomed.info/sct',
  code: '45647484',
  display: 'Is it in good condition? (optional)',
};

export const availabilityCharacteristicCoding = {
  system: 'http://snomed.info/sct',
  code: '34536373',
  display: 'Is it there code',
};

export const attractiveCharacteristicCoding = {
  system: 'http://snomed.info/sct',
  code: '23435363',
  display: 'Attractive Item code',
};

/**
 * finds a characteristic that has the given coding as one of its characteristic.codings
 *
 * @param characteristics - group characteristic
 * @param coding - coding to test for
 */
export function getCharacteristicWithCoding(
  characteristics: GroupCharacteristic[],
  coding: Coding
) {
  for (const characteristic of characteristics) {
    const codings = characteristic.code.coding ?? [];
    for (const thisCoding of codings) {
      if (isEqual(thisCoding, coding)) {
        return characteristic;
      }
    }
  }
}

/**
 * use query wrapper to fetch a commodity resource that has a binary resource.
 *
 * @param resourceId - id for the group resource
 * @param baseUrl - fhir base url.
 */
export function useGetGroupAndBinary(resourceId: string, baseUrl: string) {
  // TODO - read group - get binary reference, also fetch binary.
  const groupQuery = useQuery([groupResourceType, resourceId], () => {
    return new FHIRServiceClass<IGroup>(baseUrl, groupResourceType).read(resourceId);
  });

  const photoCharacteristic = getCharacteristicWithCoding(
    groupQuery.data?.characteristic ?? [],
    photoUploadCharacteristicCoding
  );
  const binaryReference = photoCharacteristic?.valueReference?.reference ?? '';
  const referenceParts = binaryReference.split('/');
  const referenceId = referenceParts[referenceParts.length - 1];
  const binaryQuery = useQuery(
    [binaryResourceType, resourceId],
    () => {
      return new FHIRServiceClass<IGroup>(baseUrl, binaryResourceType).read(referenceId);
    },
    { enabled: !!referenceId }
  );
  return { groupQuery, binaryQuery };
}
