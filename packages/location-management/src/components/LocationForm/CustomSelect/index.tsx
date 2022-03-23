import { Select } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { sendErrorNotification } from '@opensrp/notifications';
import React from 'react';
import { Dictionary } from '@onaio/utils';
import { SelectProps, DefaultOptionType } from 'antd/lib/select';

type RawValueType = string | number | (string | number)[];
export type GetOptions<T> = (data: T[]) => DefaultOptionType[];
export type GetSelectedFullData<T> = (
  data: T[],
  getOptions: GetOptions<T>,
  value: SelectProps<RawValueType>['value']
) => T[];

/**
 * default method to get the fullData object once use selects an option in the select dropdown,
 * once the user selects, you only get the id of the selected object, this function will be called
 * to get the full object.
 *
 * @param data - the full data objects
 * @param getOptions - function used to get the options tos how on the dropdown
 * @param value - selected value (an array for multi select otherwise a string)
 */
export function getSelectedFullData<T>(
  data: T[],
  getOptions: GetOptions<T>,
  value: SelectProps<RawValueType>['value']
) {
  const selected = data.filter((dt) => {
    const option = getOptions([dt])[0];
    return (
      (Array.isArray(value) && option.value && value.includes(option.value)) ||
      value === option.value
    );
  });
  return selected;
}

/** props for custom select component */
export interface CustomSelectProps<T = Dictionary> extends SelectProps<RawValueType> {
  loadData: (stateSetter: Dispatch<SetStateAction<T[]>>) => Promise<void>;
  getOptions: GetOptions<T>;
  fullDataCallback?: (data: T[]) => void;
  getSelectedFullData: GetSelectedFullData<T>;
}

const defaultServiceTypeProps = {
  loadData: () => Promise.resolve(),
  getOptions: () => [],
  getSelectedFullData,
  showSearch: true,
  filterOption: (inputValue: string, option?: DefaultOptionType) => {
    return !!option?.label?.toString().toLowerCase().includes(inputValue.toLowerCase());
  },
};

/**
 * custom select,  gets options from the api
 *
 * @param props - the component props
 */
function CustomSelect<T>(props: CustomSelectProps<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T[]>([]);
  const { loadData, getOptions, value, fullDataCallback, getSelectedFullData, ...restProps } =
    props;

  useEffect(() => {
    loadData(setData)
      .catch((err) => sendErrorNotification(err.message))
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selected = getSelectedFullData(data, getOptions, value);
    fullDataCallback?.(selected);
  }, [data, fullDataCallback, getOptions, getSelectedFullData, value]);

  const selectOptions = getOptions(data);

  const selectProps: SelectProps<RawValueType> = {
    ...restProps,
    options: selectOptions,
    loading,
    value,
  };

  return <Select {...selectProps}></Select>;
}

CustomSelect.defaultProps = defaultServiceTypeProps;

export { CustomSelect };
