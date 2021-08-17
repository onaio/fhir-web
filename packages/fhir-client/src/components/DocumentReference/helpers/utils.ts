import { get } from 'lodash';

/**
 * get object from an array, the check parameters are passed in as an obj, keys in keyValue can represent a path
 *
 * @param objArray - array obj with records of objs
 * @param keyValue - obj defining what key and values to use when matching
 * @param all - return first matched or all
 */
export function findObj<T extends object>(
  objArray?: T[],
  keyValue?: Record<keyof T | string, unknown>,
  all = false
) {
  if (objArray && keyValue) {
    const checkParameters = Object.entries(keyValue);
    const matched = objArray.filter((obj) => {
      let matches = true;
      checkParameters.forEach(([key, value]) => {
        if (get(obj, key) !== value) {
          matches = false;
        }
      });
      return matches;
    });
    if (all) {
      return matched;
    } else {
      return matched[0];
    }
  }
  if (!objArray || !keyValue) return;
}
