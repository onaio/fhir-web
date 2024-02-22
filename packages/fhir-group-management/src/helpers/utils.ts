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
export const smartRegisterCodeSystem = 'http://smartregister.org/';
export const supplyMgSnomedCode = '386452003';
export const characteristicUnitMeasureCode = '767524001';
export const photoUploadCharacteristicCode = '1231415';
export const accountabilityCharacteristicCode = '67869606';
export const appropriateUsageCharacteristicCode = '56758595';
export const conditionCharacteristicCode = '45647484';
export const availabilityCharacteristicCode = '34536373';
export const attractiveCharacteristicCode = '23435363';

export const photoUploadCharacteristicCoding = {
  system: smartRegisterCodeSystem,
  code: photoUploadCharacteristicCode,
  display: 'Product Image code',
};

export const accountabilityCharacteristicCoding = {
  system: smartRegisterCodeSystem,
  code: accountabilityCharacteristicCode,
  display: 'Accountability period (in months)',
};

export const appropriateUsageCharacteristicCoding = {
  system: smartRegisterCodeSystem,
  code: appropriateUsageCharacteristicCode,
  display: 'Is it being used appropriately? (optional)',
};

export const conditionCharacteristicCoding = {
  system: smartRegisterCodeSystem,
  code: conditionCharacteristicCode,
  display: 'Is it in good condition? (optional)',
};

export const availabilityCharacteristicCoding = {
  system: smartRegisterCodeSystem,
  code: availabilityCharacteristicCode,
  display: 'Is it there code',
};

export const attractiveCharacteristicCoding = {
  system: smartRegisterCodeSystem,
  code: attractiveCharacteristicCode,
  display: 'Attractive Item code',
};

export const unitOfMeasureCharacteristicCoding = {
  system: snomedCodeSystem,
  code: '767524001',
  display: 'Unit of measure',
};

export const unitOfMeasureCharacteristic = {
  code: {
    coding: [unitOfMeasureCharacteristicCoding],
  },
  valueCodeableConcept: {
    coding: [
      {
        system: snomedCodeSystem,
        code: '767525000',
        display: 'Unit',
      },
    ],
    text: undefined,
  },
};

export const accountabilityCharacteristic = {
  code: {
    coding: [accountabilityCharacteristicCoding],
  },
  valueQuantity: {
    value: undefined,
  },
};

export const appropriateUsageCharacteristic = {
  code: {
    coding: [appropriateUsageCharacteristicCoding],
  },
  valueCodeableConcept: {
    coding: [
      {
        system: smartRegisterCodeSystem,
        code: '56758595-1',
        display: 'Value entered on the Is it being used appropriately? (optional)',
      },
    ],
    text: undefined,
  },
};

export const conditionCharacteristic = {
  code: {
    coding: [conditionCharacteristicCoding],
  },
  valueCodeableConcept: {
    coding: [
      {
        system: smartRegisterCodeSystem,
        code: '45647484-1',
        display: 'Value entered on the Is it in good condition? (optional)',
      },
    ],
    text: undefined,
  },
};

export const availabilityCharacteristic = {
  code: {
    coding: [availabilityCharacteristicCoding],
  },
  valueCodeableConcept: {
    coding: [
      {
        system: smartRegisterCodeSystem,
        code: '34536373-1',
        display: 'Value entered on the It is there code',
      },
    ],
    text: undefined,
  },
};

export const attractiveCharacteristic = {
  code: {
    coding: [attractiveCharacteristicCoding],
  },
  valueBoolean: undefined,
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
 * @param baseUrl - fhir base url.
 * @param resourceId - id for the group resource
 */
export function useGetGroupAndBinary(baseUrl: string, resourceId?: string) {
  // TODO - read group - get binary reference, also fetch binary.
  const groupQuery = useQuery(
    [groupResourceType, resourceId],
    () => {
      return new FHIRServiceClass<IGroup>(baseUrl, groupResourceType).read(resourceId as string);
    },
    { enabled: !!resourceId }
  );

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
    { enabled: !!referenceId, cacheTime: 0 }
  );
  return { groupQuery, binaryQuery };
}
