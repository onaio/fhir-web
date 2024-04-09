import React from 'react';
import { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { ValueSetContains } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetContains';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import { BaseAsyncSelect, RawValueType } from '../BaseAsyncSelect';
import { FHIRServiceClass } from '../../../helpers/dataLoaders';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';

export interface ValueSetAsyncSelectProps extends SelectProps<RawValueType> {
  valueSetId: string;
  fhirBaseUrl: string;
}

// TODO - move to fhir-helpers
export const valueSetResourceType = 'ValueSet';

/**
 * Renders data in async for select component
 *
 * @param props - AsyncSelect component props
 */
export function ValueSetAsyncSelect(props: ValueSetAsyncSelectProps) {
  const { valueSetId, fhirBaseUrl, ...selectProps } = props;

  const queryParams = {
    queryKey: [valueSetResourceType, valueSetId],
    queryFn: async () =>
      new FHIRServiceClass<IValueSet>(fhirBaseUrl, valueSetResourceType).read(
        `${valueSetId}/$expand`
      ),
    select: (data: IValueSet) => getValueSetSelectOptions(data),
  };

  const asyncSelectProps = {
    queryParams,
    optionsGetter: (options: DefaultOptionType[]) => options,
    filterOption: selectFilterFunction,
    ...selectProps,
  };

  return <BaseAsyncSelect<IValueSet, DefaultOptionType> {...asyncSelectProps} />;
}

/**
 * filter practitioners select on search
 *
 * @param inputValue search term
 * @param option select option to filter against
 */
export const selectFilterFunction = (inputValue: string, option?: DefaultOptionType) => {
  return !!option?.label?.toString()?.toLowerCase().includes(inputValue.toLowerCase());
};

/**
 * get select options value
 *
 * @param record - valueSets
 * @returns returns select option value stringified
 */
const getValueSetOptionsValue = (record: ValueSetContains) => {
  return JSON.stringify({
    code: record.code,
    display: record.display,
    system: record.system,
  });
};

/**
 * generate literal that represents the value to a dropdown select
 *
 * @param coding - coding to derive the literal value from
 */
export function getSelectValueForCoding(coding?: Coding) {
  if (coding) {
    return JSON.stringify({
      code: coding.code,
      display: coding.display,
      system: coding.system,
    });
  }
}

/**
 * get options from valueSet data
 *
 * @param data - valueSet data
 * @returns returns select options
 */
export function getValueSetSelectOptions(data: IValueSet) {
  const valueSetsByCode: Record<string, ValueSetContains> = {};
  data.compose?.include.forEach((item) => {
    item.concept?.forEach((record) => {
      const code = record.code as string;
      valueSetsByCode[code] = { ...record, system: item.system };
    });
  });
  data.expansion?.contains?.forEach((item) => {
    const code = item.code as string;
    valueSetsByCode[code] = { ...item };
  });
  const valueSets = Object.values(valueSetsByCode);
  const options: DefaultOptionType[] = valueSets.map((record) => ({
    value: getValueSetOptionsValue(record),
    label: record.display,
  }));
  return options;
}