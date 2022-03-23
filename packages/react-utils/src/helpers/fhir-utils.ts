import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { FHIRServiceClass } from '..';
import { URLParams } from '@opensrp/server-service';

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

// fhir constants and  value sets TODO - dry out after #896
// fhir constants
export enum IdentifierUseCodes {
  USUAL = 'usual',
  OFFICIAL = 'official',
  TEMP = 'temp',
  SECONDARY = 'secondary',
  OLD = 'old',
}

// TODO - dry out after #896
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
    _count: total,
    ...extraFilters,
  };
  return new FHIRServiceClass<IBundle>(baseUrl, resourceType).list(fetchAllFilter);
};
