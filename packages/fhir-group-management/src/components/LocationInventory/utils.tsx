import { ValueSetContains } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetContains';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import { DefaultOptionType } from 'antd/lib/select';

/**
 * @param data
 */
export function getValuesetSelectOptions<TData extends IValueSet>(data: TData) {
  const valuesets: ValueSetContains[] = data.expansion?.contains?.map((items) => items) || [];
  const options: DefaultOptionType[] = valuesets.map((record) => ({
    value: record.code,
    label: record.display,
  }));
  return options;
}
