import React, { useEffect, useState } from 'react';
import { URLParams } from '@opensrp/server-service';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { useInfiniteQuery, useQuery } from 'react-query';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Button, Divider, Select, Empty, Space, Spin, Alert } from 'antd';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { debounce } from 'lodash';
import { getResourcesFromBundle } from '../../../helpers/utils';
import { useTranslation } from '../../../mls';
import {
  loadSearchableResources,
  getTotalRecordsInBundles,
  getTotalRecordsOnApi,
  AbstractedSelectOptions,
  SelectOption,
  TransformOptions,
} from '../utils';

export interface PaginatedAsyncSelectProps<ResourceT extends IResource>
  extends AbstractedSelectOptions<ResourceT> {
  resourceType: string;
  baseUrl: string;
  transformOption: TransformOptions<ResourceT>;
  filterPageSize?: number;
  extraQueryParams?: URLParams;
  getFullOptionOnChange?: (obj: SelectOption<ResourceT> | SelectOption<ResourceT>[]) => void;
  discoverUnknownOptions?: (values: string[]) => Promise<SelectOption<ResourceT>[]>;
}

const debouncedFn = debounce((callback) => callback(), 500);

/**
 * Problem: When we want to api resources as options we need to fetch all resources on the api first
 * and add support for searching/filtering on the frontend. This leads to slow views and essentially means
 * we have to pull more data than sometimes we need.
 *
 * The solution: This component is a wrapper around the antd select component. It adds support for optional api side
 * searching, This means we no longer need to fetch all records of a certain specific resource to support searching.
 *
 * @param props - component props
 */
export function PaginatedAsyncSelect<ResourceT extends IResource>(
  props: PaginatedAsyncSelectProps<ResourceT>
) {
  const {
    resourceType,
    baseUrl,
    transformOption,
    placeholder,
    filterPageSize: pageSize = 20,
    extraQueryParams = {},
    getFullOptionOnChange,
    discoverUnknownOptions,
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

  type PageResponse = { res: IBundle; page: number; pageSize: number };
  const {
    data: rawData,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
    error,
  } = useInfiniteQuery({
    queryKey: [resourceType, debouncedSearchValue, page, pageSize],
    queryFn: async ({ pageParam = page }) => {
      const response = await loadSearchableResources(
        baseUrl,
        resourceType,
        { page: pageParam, pageSize, search: debouncedSearchValue ?? null },
        extraQueryParams
      ).then((res) => ({ res, page: pageParam, pageSize }));
      return response;
    },
    getNextPageParam: (lastGroup: PageResponse, allGroups: PageResponse[]) => {
      const allBundles = allGroups.map((group) => group.res);
      const totalFetched = getTotalRecordsInBundles(allBundles);
      const total = lastGroup.res.total as number;
      const nextPage = lastGroup.page + 1;
      if (totalFetched < total) {
        return nextPage;
      } else {
        return false;
      }
    },
    getPreviousPageParam: (lastGroup: PageResponse) => {
      const nextPage = lastGroup.page - 1;
      if (nextPage === 1) {
        return undefined;
      } else {
        return nextPage;
      }
    },
    refetchOnWindowFocus: false,
  });

  const data = rawData?.pages.map((page) => page.res) ?? [];

  const options = data.flatMap((resourceBundle: IBundle) => {
    const resources = getResourcesFromBundle<ResourceT>(resourceBundle);
    const allOptions = resources.map(transformOption);
    const saneOptions = allOptions.filter((option) => option !== undefined);
    return saneOptions as SelectOption<ResourceT>[];
  });

  const optionsByValue = options.reduce((acc, opt) => {
    acc[opt.value] = opt;
    return acc;
  }, {} as Record<string, SelectOption<ResourceT>>);

  const values = Array.isArray(props.value) ? props.value : [props.value];
  const defaultValues = Array.isArray(props.defaultValue)
    ? props.defaultValue
    : [props.defaultValue];
  const poolValuesToCheck = [...values, defaultValues];

  const missingValues: string[] = [];
  for (const value of poolValuesToCheck) {
    if (typeof value === 'string') {
      if (!(optionsByValue[value] as SelectOption<ResourceT> | undefined)) {
        missingValues.push(value);
      } else {
        // TODO - YAGNI - case when value is labelledValue
      }
    }
  }

  const { data: preloadData, isLoading: preLoadDataIsLoading } = useQuery(
    [missingValues],
    () => props.discoverUnknownOptions?.(missingValues),
    {
      enabled: !!missingValues.length,
    }
  );

  const preloadOptionsByValue = (preloadData ?? []).reduce((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {} as Record<string, SelectOption<ResourceT>>);
  const fullSetOptions = {
    ...preloadOptionsByValue,
    ...optionsByValue,
  };
  const updatedOptions = Object.values(fullSetOptions);

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

  const pages = data;
  const recordsFetchedNum = getTotalRecordsInBundles(pages);
  const totalPossibleRecords = getTotalRecordsOnApi(pages);
  const remainingRecords = totalPossibleRecords - recordsFetchedNum;

  const propsToSelect = {
    className: 'asyncSelect',
    ...restProps,
    placeholder,
    onChange: changeHandler,
    loading: isLoading || preLoadDataIsLoading,
    notFoundContent: isLoading ? <Spin size="small" /> : <Empty description={t('No data')} />,
    filterOption: false,
    options: updatedOptions,
    searchValue,
    dropdownRender: (menu: React.ReactNode) => {
      return (
        <>
          {!error && data.length ? (
            menu
          ) : isLoading ? (
            <Spin size="small" />
          ) : (
            <Empty description={t('No data')} />
          )}
          <Divider style={{ margin: '8px 0' }} />
          {error ? (
            <Alert message={t('Unable to load dropdown options.')} type="error" showIcon />
          ) : (
            <Space direction="vertical">
              {data.length ? (
                <small style={{ padding: '4px 16px' }}>
                  {t('Showing {{recordsFetchedNum}}; {{remainingRecords}} more records.', {
                    recordsFetchedNum,
                    remainingRecords,
                  })}
                </small>
              ) : null}
              <Button
                type="text"
                icon={<VerticalAlignBottomOutlined />}
                disabled={!hasNextPage || isFetchingNextPage || isFetching}
                loading={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? t('Fetching next page') : t('Load more options')}
              </Button>
            </Space>
          )}
        </>
      );
    },
  };
  if (props.showSearch) {
    propsToSelect.onSearch = searchHandler;
  }
  return <Select {...propsToSelect}></Select>;
}
