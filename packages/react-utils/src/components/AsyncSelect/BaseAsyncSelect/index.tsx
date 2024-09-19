import { Alert, Select } from 'antd';
import { useMemo } from 'react';
import React from 'react';
import { SelectProps, DefaultOptionType } from 'antd/lib/select';
import { useTranslation } from '../../../mls';
import { UseQueryOptions, useQuery } from 'react-query';
import { TFunction } from '@opensrp/i18n';
import "./index.css"

export type RawValueType = string | number | (string | number)[];

/** props for custom select component */
export interface AsyncSelectProps<QueryResponse = unknown, QueryProcessedData = unknown>
  extends SelectProps<RawValueType> {
  optionsGetter: (data: QueryProcessedData[]) => DefaultOptionType[];
  queryParams: UseQueryOptions<QueryResponse, Error, QueryProcessedData[]>;
}

/**
 * Renders data in async for select component
 *
 * @param props - AsyncSelect component props
 */
function BaseAsyncSelect<QueryResponse = unknown, QueryProcessedData = unknown>(
  props: AsyncSelectProps<QueryResponse, QueryProcessedData>
) {
  const { optionsGetter, queryParams: useQueryParams, ...restProps } = props;

  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery(useQueryParams);

  const options = useMemo(() => (data ? optionsGetter(data) : undefined), [data, optionsGetter]);
  const selectDropDownRender = dropDownFactory(t, data, error);
  const singleSelectProps = {
    dropdownRender: selectDropDownRender,
    options,
    loading: isLoading,
    disabled: isLoading,
    ...restProps,
  };

  return <Select {...singleSelectProps} />;
}

/**
 * Factory to help generate the render for dropdown with respect to how query to fetch
 * options resolved.
 *
 * @param t - translator function
 * @param data - loaded data
 * @param error - query error
 */
export function dropDownFactory(t: TFunction, data?: unknown, error?: Error | null) {
  return function selectErrorDropDownRender(menu: React.ReactNode) {
    return (
      <>
        {!error && data && menu}
        {error && <Alert message={t('Unable to load dropdown options.')} type="error" showIcon />}
      </>
    );
  };
}

export { BaseAsyncSelect };
