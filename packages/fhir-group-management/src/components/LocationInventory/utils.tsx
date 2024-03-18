import { ValueSetContains } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetContains';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import { DefaultOptionType } from 'antd/lib/select';
import { Dictionary } from '@onaio/utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { getResourcesFromBundle } from '@opensrp/react-utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

/**
 * get options from valueset data
 *
 * @param data - valueset data
 * @returns returns select options
 */
export function getValuesetSelectOptions<TData extends IValueSet>(data: TData) {
  const valuesetsByCode: Dictionary<ValueSetContains> = {};
  data.compose?.include.forEach((item) => {
    item.concept?.forEach((record) => {
      const code = record.code as string;
      valuesetsByCode[code] = { ...record, system: item.system };
    });
  });
  data.expansion?.contains?.forEach((item) => {
    const code = item.code as string;
    valuesetsByCode[code] = { ...item };
  });
  const valuesets = Object.values(valuesetsByCode);
  const options: DefaultOptionType[] = valuesets.map((record) => ({
    value: JSON.stringify({ code: record.code, display: record.display, system: record.system }),
    label: record.display,
  }));
  return options;
}

/**
 * get options from products bundle data
 *
 * @param data - products bundle data
 * @returns returns select options
 */
export const projectOptions = (data: IBundle) => {
  const productsList = getResourcesFromBundle<IGroup>(data);
  const options: DefaultOptionType[] = productsList.map((prod: IGroup) => ({
    value: prod.id,
    label: prod.name,
  }));
  return options;
};
