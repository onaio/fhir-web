import React from 'react';
import { URLParams } from '@opensrp/server-service';
import { useQuery } from 'react-query';
import { Divider, Select, Empty, Spin, Alert } from 'antd';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { getResourcesFromBundle } from '../../../helpers/utils';
import { useTranslation } from '../../../mls';
import { loadAllResources } from '../../../helpers/fhir-utils';
import {
  AbstractedSelectOptions,
  defaultSelectFilterFunction,
  SelectOption,
  TransformOptions,
} from '../utils';

export interface ClientSideActionsSelectProps<ResourceT extends IResource>
  extends AbstractedSelectOptions<ResourceT> {
  fhirBaseUrl: string;
  resourceType: string;
  extraQueryParams?: URLParams;
  transformOption: TransformOptions<ResourceT>;
  getFullOptionOnChange?: (obj: SelectOption<ResourceT> | SelectOption<ResourceT>[]) => void;
}

/**
 * Select component that loads all options as a single resource
 *
 * @param props - component props
 */
export function ClientSideActionsSelect<ResourceT extends IResource>(
  props: ClientSideActionsSelectProps<ResourceT>
) {
  const {
    fhirBaseUrl,
    resourceType,
    extraQueryParams = {},
    transformOption,
    onChange,
    getFullOptionOnChange,
    ...restProps
  } = props;

  const { t } = useTranslation();

  const {
    data: options,
    isLoading,
    error,
  } = useQuery({
    queryKey: [ClientSideActionsSelect.name, resourceType],
    queryFn: async () => {
      return await loadAllResources(fhirBaseUrl, resourceType, extraQueryParams);
    },
    refetchOnWindowFocus: false,
    select: (bundle) => {
      const options = getResourcesFromBundle<ResourceT>(bundle).map((resource) =>
        transformOption(resource)
      );
      return options as SelectOption<ResourceT>[];
    },
  });

  const changeHandler = (
    value: string,
    fullOption: SelectOption<ResourceT> | SelectOption<ResourceT>[]
  ) => {
    const saneFullOption = Array.isArray(fullOption) ? fullOption.slice() : fullOption;
    props.onChange?.(value, saneFullOption);
    getFullOptionOnChange?.(saneFullOption);
  };

  const propsToSelect = {
    className: 'asyncSelect',
    filterOption: defaultSelectFilterFunction,
    ...restProps,
    onChange: changeHandler,
    loading: isLoading,
    notFoundContent: isLoading ? <Spin size="small" /> : <Empty description={t('No data')} />,
    options,
    dropdownRender: (menu: React.ReactNode) => (
      <>
        {!error && options?.length && menu}
        <Divider style={{ margin: '8px 0' }} />
        {error && <Alert message={t('Unable to load dropdown options.')} type="error" showIcon />}
      </>
    ),
  };

  return <Select {...propsToSelect}></Select>;
}
