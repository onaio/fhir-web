import { Dictionary } from '@onaio/utils';
import get from 'lodash/get';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { parseFhirHumanName } from '@opensrp/react-utils';
import { useState } from 'react';

/**
 * util to extract patient name
 *
 * @param patient - patient object
 * @returns {string[]} - returns an array of name strings
 */
export function getPatientName(patient?: IPatient) {
  if (!patient) {
    return '';
  }
  const name = patient.name?.[0];
  return parseFhirHumanName(name);
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
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return path.split('.').reduce((out, key) => (out ? out[key] : undefined), obj);
}

/**
 * Function to get observation label
 *
 * @param {Object} obj - resource object
 * @returns {string} - returns label string
 */
export function getObservationLabel(obj: Dictionary): string {
  return (
    get(obj, 'code.coding.0.display') || get(obj, 'code.text') || get(obj, 'valueQuantity.code')
  );
}

/**
 * Function to get observation value quantity
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

/**
 * Abstracts sort functionality for dates as strings
 *
 * @param d1 - the first date string
 * @param d2 - the second date string
 */
export const dateStringSorterFn = (d1: string, d2: string) => Date.parse(d1) - Date.parse(d2);

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
/**
 * help manage sort key state in tables that render fhir data where
 * sorting functionality controlled.
 */
export function useSortParams() {
  // TODO - move this state to URL
  const [sortKeys, setSortKeys] = useState<Record<string, { dir: SortDirection; time: number }>>();

  const toggleSort = (key: string) => {
    const currentDir = sortKeys?.[key].dir;
    let newSortKeysState = {};
    const timestamp = Date.now();
    if (currentDir === SortDirection.ASC) {
      newSortKeysState = { ...sortKeys, [key]: { dir: SortDirection.DESC, time: timestamp } };
    }
    if (currentDir === SortDirection.DESC) {
      newSortKeysState = { ...sortKeys, [key]: { dir: SortDirection.ASC, time: timestamp } };
    }
    newSortKeysState = {
      ...sortKeys,
      [key]: { dir: SortDirection.DESC, time: timestamp },
    };
    setSortKeys(newSortKeysState);
  };

  const isAscending = (key: string) => {
    return sortKeys?.[key] && sortKeys[key].dir === SortDirection.ASC;
  };

  const isDescending = (key: string) => {
    return isAscending(key) && !isAscending(key);
  };

  const response = {
    isAscending,
    isDescending,
    toggleSort,
    filters: undefined,
  };

  if (sortKeys) {
    // we need to preserver order in which sort events are registered.
    const sortParamString = Object.entries(sortKeys)
      // eslint-disable-next-line @typescript-eslint/naming-convention
      .sort(([_, obj1], [__, obj2]) => obj1.time - obj2.time)
      .map(([key, obj]) => `${obj.dir}${key}`)
      .join(',');

    const filters = {
      _sort: sortParamString,
    };
    return { ...response, filters };
  }

  return response;
}
