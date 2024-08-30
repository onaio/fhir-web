import React, { useMemo } from 'react';
import Select, { DefaultOptionType, SelectProps } from 'antd/lib/select';
import { ValueSetContains } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/valueSetContains';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import { dropDownFactory, RawValueType } from '../BaseAsyncSelect';
import { FHIRServiceClass } from '../../../helpers/dataLoaders';
import { Coding } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/coding';
import { useQuery } from 'react-query';
import { useTranslation } from '../../../mls';

export interface ValueSetAsyncSelectProps extends SelectProps<RawValueType, DefaultOptionType> {
  valueSetURL: string;
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
  const { valueSetURL, fhirBaseUrl, value, defaultValue, ...rawSelectProps } = props;

  const { t } = useTranslation();
  const queryParams = {
    queryKey: [valueSetResourceType, valueSetURL],
    queryFn: async () =>
      new FHIRServiceClass<IValueSet>(fhirBaseUrl, valueSetResourceType).read(
        `$expand?url=${valueSetURL}`
      ),
    select: (data: IValueSet) => getValueSetSelectOptions(data),
  };

  const { data, isLoading, error } = useQuery(queryParams);

  const optionsByCodeAndSystem = useMemo(() => {
    return (data ?? []).reduce((acc, opt) => {
      try {
        const optionObj = JSON.parse((opt.value ?? '{}') as string);
        const key = `${optionObj.code}-${optionObj.system}`;
        acc[key] = opt;
        return acc;
      } catch (_) {
        return acc;
      }
    }, {} as Record<string, DefaultOptionType>);
  }, [data]);
  const sanitizedValue = useSanitizedValueSelectValue(optionsByCodeAndSystem, value);
  const sanitizedDefValue = useSanitizedValueSelectValue(optionsByCodeAndSystem, defaultValue);

  const selectDropDownRender = dropDownFactory(t, data, error as Error);

  const selectProps = {
    dropdownRender: selectDropDownRender,
    options: data,
    loading: isLoading,
    disabled: isLoading,
    ...rawSelectProps,
    filterOption: selectFilterFunction,
    value: sanitizedValue,
    defaultValue: sanitizedDefValue,
  };

  return <Select {...selectProps} />;
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
export const getValueSetOptionsValue = (record?: ValueSetContains | Coding) => {
  if (record) {
    return JSON.stringify({
      code: record.code,
      display: record.display,
      system: record.system,
    });
  }
};

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

/**
 * valueset options are a json stringified representation of the codeable concept,
 * the option.value thus can include the `display` property which we should not use when
 * testing for equality between a codeableConcept value and the options.
 *
 * @param optionsByCodeAndSystem - lookup of options by the important parts, code and system
 * @param value - a provided or selected value.
 */
export const useSanitizedValueSelectValue = (
  optionsByCodeAndSystem: Record<string, DefaultOptionType>,
  value?: RawValueType | null
) => {
  return useMemo(() => {
    try {
      if (value) {
        const valueOb = JSON.parse(value as string);
        const key = `${valueOb.code}-${valueOb.system}`;
        return optionsByCodeAndSystem[key].value ?? value;
      }
    } catch (_) {
      return value;
    }
  }, [optionsByCodeAndSystem, value]);
};
