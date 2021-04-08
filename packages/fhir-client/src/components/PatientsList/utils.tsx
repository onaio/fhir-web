import { Dictionary } from '@onaio/utils';
import get from 'lodash/get';
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/** util to extract patient name
 *
 * @param patient - patient object
 * @returns {string[]} - returns an array of name strings
 */
export function getPatientName(patient: Dictionary) {
  if (!patient) {
    return '';
  }

  let name = patient.name;
  if (!Array.isArray(name)) {
    name = [name];
  }
  name = name[0];
  if (!name) {
    return '';
  }

  const family = Array.isArray(name.family) ? name.family : [name.family];
  const given = Array.isArray(name.given) ? name.given : [name.given];
  const prefix = Array.isArray(name.prefix) ? name.prefix : [name.prefix];
  const suffix = Array.isArray(name.suffix) ? name.suffix : [name.suffix];

  return [
    prefix.map((t: string) => String(t || '').trim()).join(' '),
    given.map((t: string) => String(t || '').trim()).join(' '),
    family.map((t: string) => String(t || '').trim()).join(' '),
    suffix.map((t: string) => String(t || '').trim()).join(' '),
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Walks thru an object (ar array) and returns the value found at the provided
 * path. This function is very simple so it intentionally does not support any
 * argument polymorphism, meaning that the path can only be a dot-separated
 * string. If the path is invalid returns undefined.
 *
 * @param {Object} obj The object (or Array) to walk through
 * @param {string} path The path (eg. "a.b.4.c")
 * @returns {*} Whatever is found in the path or undefined
 */
export function getPath(obj: Dictionary, path = '') {
  return path.split('.').reduce((out, key) => (out ? out[key] : undefined), obj);
}

/** Fumction to get observation label
 *
 * @param {Object} obj - resource object
 * @returns {string} - returns label string
 */
export function getObservationLabel(obj: Dictionary): string {
  return (
    get(obj, 'code.coding.0.display') || get(obj, 'code.text') || get(obj, 'valueQuantity.code')
  );
}

/** Fumction to get observation value quantity
 *
 * @param {Object} obj - resource object
 * @returns {string} - returns value string
 */
export function buildObservationValueString(obj: Dictionary): string {
  let quantValue = '';
  if (obj.component && Array.isArray(obj.component)) {
    obj.component.forEach((c, i) => {
      quantValue =
        quantValue +
        `${getObservationLabel(c).replace('Blood Pressure', '')}: ${
          get(c, 'valueQuantity.value') || ''
        }${get(c, 'valueQuantity.unit') || ''}${i > 0 ? '' : ', '}`;
    });
  } else {
    quantValue =
      `${get(obj, 'valueQuantity.value') || ''} ${get(obj, 'valueQuantity.unit') || ''}` || 'N/A';
  }
  return quantValue;
}
