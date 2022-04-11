import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { FHIRServiceClass } from '..';
import { URLParams } from '@opensrp/server-service';
import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';

/**
 * retrieve object(s) from an array if it has a given property that has a specified value
 *
 * @param objArr - array of objects
 * @param key - the accessor
 * @param value - the value the accessor should have
 * @param all - whether to return all values that are matched or just the first
 */
export const getObjLike = <T extends object>(
  objArr: T[] | undefined,
  key: string,
  value: unknown,
  all = false
) => {
  const arr = objArr ?? [];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const thisObj = arr[i];
    const objHasValue = (thisObj as never)[key];
    if (objHasValue === value) {
      result.push(thisObj);
    }
    if (result.length > 0 && !all) {
      return result;
    }
  }
  return result;
};

// fhir constants and  value sets
// fhir constants
// https://www.hl7.org/fhir/valueset-identifier-use.html
export enum IdentifierUseCodes {
  USUAL = 'usual',
  OFFICIAL = 'official',
  TEMP = 'temp',
  SECONDARY = 'secondary',
  OLD = 'old',
}

/**
 * fetch all resources for a certain endpoint
 *
 * @param baseUrl - the fhir server url
 * @param resourceType - the resource type
 * @param extraFilters - extra filters
 */
export const loadAllResources = async (
  baseUrl: string,
  resourceType: string,
  extraFilters: URLParams = {}
) => {
  // first get total
  const summaryFilters = {
    _summary: 'count',
    ...extraFilters,
  };
  const summary = await new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(summaryFilters);
  const { total } = summary;
  const fetchAllFilter = {
    ...(total ? { _count: total } : {}),
    ...extraFilters,
  };
  return new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(fetchAllFilter);
};

/**
 *  return a single string representing FHIR human name data type
 *
 * @param hName - fhir HumanName object
 */
export const parseFhirHumanName = (hName?: HumanName) => {
  if (!hName) {
    return;
  }
  const { family, given, suffix, prefix } = hName;
  const namesArray: string[] = [
    (prefix ?? []).join(' '),
    (given ?? []).join(' '),
    family ?? '',
    (suffix ?? []).join(' '),
  ].filter((txt) => !!txt);
  return namesArray.join(' ');
};
