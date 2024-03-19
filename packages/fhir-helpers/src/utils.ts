import { isEqual } from 'lodash';
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
