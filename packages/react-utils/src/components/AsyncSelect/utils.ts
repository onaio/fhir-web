import { URLParams } from '@opensrp/server-service';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { FHIRServiceClass } from '../../helpers/dataLoaders';
import { FhirApiFilter } from '../../helpers/utils';
import { DefaultOptionType } from 'antd/lib/select';
import type { SelectProps } from 'antd';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';

/**
 * Unified function that gets a list of FHIR resources from a FHIR hapi server
 *
 * @param baseUrl - base url
 * @param resourceType - resource type as endpoint
 * @param params - our params
 * @param extraParams - any extra user-defined params
 */
export const loadSearchableResources = async (
  baseUrl: string,
  resourceType: string,
  params: FhirApiFilter,
  extraParams: URLParams
) => {
  const { page, pageSize, search } = params;
  const filterParams: URLParams = {
    _getpagesoffset: (page - 1) * pageSize,
    _count: pageSize,
    ...extraParams,
  };
  if (search) {
    filterParams['name:contains'] = search;
  }
  const service = new FHIRServiceClass<IBundle>(baseUrl, resourceType);
  const bundleResponse = (await service.list(filterParams)) as IBundle;
  if (bundleResponse.total === undefined) {
    filterParams['_summary'] = 'count';
    const summary = await service.list(filterParams);
    const { total } = summary;
    return { ...bundleResponse, total };
  }
  return bundleResponse;
};

/**
 * uses data from the api to extract the total number of records there are
 *
 * @param bundles - an array of fetched bundles, bundles are split with respect to pagination
 */
export const getTotalRecordsOnApi = (bundles: IBundle[]) => {
  if (!bundles.length) return 0;
  const lastBundle = bundles[bundles.length - 1];
  const total = lastBundle.total as number;
  return total;
};

/**
 * Calculate the number of records in the bundle pages we have pulled so far.
 *
 * @param bundles - an array of fetched bundles, bundles are split with respect to pagination
 */
export const getTotalRecordsInBundles = (bundles: IBundle[]) => {
  return (
    bundles
      .flatMap((page: IBundle) => {
        return (page.entry ?? []).length;
      })
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      .reduce((a, v) => a + v, 0)
  );
};

/**
 * filter select on search
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const defaultSelectFilterFunction = (inputValue: string, option?: DefaultOptionType) => {
  return !!option?.label?.toString()?.toLowerCase().includes(inputValue.toLowerCase());
};

export type SelectOption<T extends IResource> = {
  label: string;
  value: string | number;
  ref: T;
};

export interface TransformOptions<T extends IResource> {
  (resource: T): SelectOption<T> | undefined;
}

export type AbstractedSelectOptions<ResourceT extends IResource> = Omit<
  SelectProps<string, SelectOption<ResourceT>>,
  'loading' | 'options' | 'searchValue'
>;
