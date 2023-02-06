import React, { useEffect, useState } from 'react';
import { URLParams } from '@opensrp/server-service';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { useInfiniteQuery } from 'react-query';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Select, Empty, Space, Spin, Alert } from 'antd';
import type { SelectProps } from 'antd';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { debounce } from 'lodash';
import { getResourcesFromBundle } from '../../helpers/utils';
import { useTranslation } from '../../mls';
import { loadResources, getTotalRecordsInBundles, getTotalRecordsOnApi } from './utils';

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

export interface FhirSelectProps<ResourceT extends IResource>
  extends AbstractedSelectOptions<ResourceT> {
  resourceType: string;
  baseUrl: string;
  transformOption: TransformOptions<ResourceT>;
  filterPageSize?: number;
  extraQueryParams?: URLParams;
  getFullOptionOnChange?: (obj: SelectOption<ResourceT> | SelectOption<ResourceT>[]) => void;
}

const debouncedFn = debounce((callback) => callback(), 500);

/**
 * Problem: When we want to api resources as options we need to fetch all resources on the api first
 * and add support for searching/filtering on the frontend. This leads to slow views and esentially means
 * we have to pull more data than sometimes we need.
 *
 * The solution: This component is a wrapper around the antd select component. It adds support for optional api side
 * searching, This means we no longer need to fetch all records of a certain specific resource to support searching.
 *
 * @param props - component props
 */
export function FhirSelect<ResourceT extends IResource>(props: FhirSelectProps<ResourceT>) {
  const {
    resourceType,
    baseUrl,
    transformOption,
    placeholder,
    filterPageSize: pageSize = 20,
    extraQueryParams = {},
    getFullOptionOnChange,
    ...restProps
  } = props;
  const defaultStartPage = 1;
  const [page, setPage] = useState(defaultStartPage);
  const [searchValue, setSearchValue] = React.useState<string>();
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState<string>();
  const { t } = useTranslation();

  useEffect(() => {
    debouncedFn(() => {
      setDebouncedSearchValue(searchValue);
      setPage(defaultStartPage);
    });
  }, [searchValue]);

  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, isFetching, error } =
    useInfiniteQuery({
      queryKey: [resourceType, debouncedSearchValue, page, pageSize],
      queryFn: async ({ pageParam = page }) => {
        const response = await loadResources(
          baseUrl,
          resourceType,
          { page: pageParam, pageSize, search: debouncedSearchValue ?? null },
          extraQueryParams
        );
        return response;
      },
      getNextPageParam: (lastGroup: IBundle, allGroups: IBundle[]) => {
        const totalFetched = getTotalRecordsInBundles(allGroups);
        const total = lastGroup.total as number;
        if (totalFetched < total) {
          return page + 1;
        } else {
          return false;
        }
      },
      getPreviousPageParam: () => {
        if (page === 1) {
          return undefined;
        } else {
          return page - 1;
        }
      },
      refetchOnWindowFocus: false,
    });

  const changeHandler = (
    value: string,
    fullOption: SelectOption<ResourceT> | SelectOption<ResourceT>[]
  ) => {
    const saneFullOption = Array.isArray(fullOption) ? fullOption.slice() : fullOption;
    props.onChange?.(value, saneFullOption);
    getFullOptionOnChange?.(saneFullOption);
  };

  const searchHandler = (value: string) => {
    setSearchValue(value);
  };

  const options = ((data?.pages ?? []) as IBundle[]).flatMap((resourceBundle: IBundle) => {
    const resources = getResourcesFromBundle<ResourceT>(resourceBundle);
    const allOptions = resources.map(transformOption);
    const saneOptions = allOptions.filter((option) => option !== undefined);
    return saneOptions as SelectOption<ResourceT>[];
  });

  const pages = (data?.pages ?? []) as IBundle[];
  const recordsFetchedNum = getTotalRecordsInBundles(pages);
  const totalPossibleRecords = getTotalRecordsOnApi(pages);
  const remainingRecords = totalPossibleRecords - recordsFetchedNum;

  const propsToSelect = {
    style: { minWidth: '200px' },
    ...restProps,
    onChange: changeHandler,
    loading: isLoading,
    notFoundContent: isLoading ? <Spin size="small" /> : <Empty description={t('No data')} />,
    filterOption: false,
    options: options,
    searchValue,
    dropdownRender: (menu: React.ReactNode) => (
      <>
        {!error && data && menu}
        <Divider style={{ margin: '8px 0' }} />
        {error ? (
          <Alert message={t('Unable to load dropdown options.')} type="error" showIcon />
        ) : (
          <Space direction="vertical">
            {data && (
              <small style={{ padding: '4px 16px' }}>
                {t('Showing {{recordsFetchedNum}}; {{remainingRecords}} more records.', {
                  recordsFetchedNum,
                  remainingRecords,
                })}
              </small>
            )}
            <Button
              type="text"
              icon={<PlusOutlined />}
              disabled={!hasNextPage || isFetchingNextPage || isFetching}
              loading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? t('Fetching next page') : t('Load more options')}
            </Button>
          </Space>
        )}
      </>
    ),
  };
  if (props.showSearch) {
    propsToSelect.onSearch = searchHandler;
  }
  return <Select {...propsToSelect}></Select>;
}
