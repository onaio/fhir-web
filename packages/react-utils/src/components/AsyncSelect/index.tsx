import React, { useMemo } from 'react';
import { Form, Select, Input } from 'antd';
import { UseQueryResult } from 'react-query';
import { SelectProps, DefaultOptionType } from 'antd/lib/select';

const { Item: FormItem } = Form;

export interface AsyncSelectProps {
  dataLoader: <TData>() => UseQueryResult<TData>;
  optionsGetter: <TData>(data: TData) => DefaultOptionType[];
  name: string | string[];
  label: string;
  selectProps: SelectProps;
  id: string;
}

export const AsyncSelect = (props: AsyncSelectProps) => {
  const { dataLoader, optionsGetter, selectProps, name, label } = props;
  const { data, isLoading, error } = dataLoader();
  // Todo: Handle error
  const options = useMemo(() => (data ? optionsGetter(data) : undefined), [data]);
  const singleSelectProps = {
    ...selectProps,
    options,
    loading: isLoading,
  };

  return (
    <FormItem name={name} label={label}>
      <Select {...singleSelectProps} />
    </FormItem>
  );
};
