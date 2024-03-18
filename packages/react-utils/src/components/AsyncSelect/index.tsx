import React, { useMemo } from 'react';
import { Form, Select } from 'antd';
import { QueryFunction, QueryKey, UseQueryOptions, useQuery } from 'react-query';
import { SelectProps, DefaultOptionType } from 'antd/lib/select';
import { sendErrorNotification } from '@opensrp/notifications';
import { useTranslation } from '../../mls';
import { Rule } from 'rc-field-form/lib/interface';

const { Item: FormItem } = Form;

export interface AsyncSelectProps<TData> {
  optionsGetter: (data: TData) => DefaultOptionType[];
  name: string | string[];
  label: string;
  selectProps: SelectProps;
  id: string;
  useQueryParams: {
    key: QueryKey;
    queryFn: QueryFunction<TData>;
    options?: UseQueryOptions<TData>;
  };
  rules?: Rule[];
}

/**
 * Renders data in async for select coponent
 *
 * @param props - AsyncSelect component props
 */
export function AsyncSelect<TData>(props: AsyncSelectProps<TData>) {
  const { optionsGetter, selectProps, name, label, useQueryParams, id, rules } = props;

  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery(
    useQueryParams.key,
    useQueryParams.queryFn,
    useQueryParams.options
  );

  if (error) {
    sendErrorNotification(t(`Failed to get data for ${label}`));
  }
  const options = useMemo(() => (data ? optionsGetter(data) : undefined), [data]);
  const singleSelectProps = {
    ...selectProps,
    options,
    loading: isLoading,
    disabled: Boolean(error),
  };

  return (
    <FormItem id={id} rules={rules} name={name} label={label}>
      <Select {...singleSelectProps} />
    </FormItem>
  );
}
