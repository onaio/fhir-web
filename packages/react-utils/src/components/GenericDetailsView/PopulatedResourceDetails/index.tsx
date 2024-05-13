import React, { useMemo } from 'react';
import { Spin } from 'antd';
import { UseQueryOptions, useQuery } from 'react-query';
import { useTranslation } from '../../../mls';
import { ResourceDetails, ResourceDetailsProps } from '../ResourceDetails';
import { BrokenPage } from '../../BrokenPage';
import { TFunction } from '@opensrp/i18n';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';

export interface PopulatedResourceDetailsProps<ResourceType> {
  resourceDetailsPropsGetter: (data: ResourceType, t: TFunction) => ResourceDetailsProps;
  resourceQueryParams: UseQueryOptions<ResourceType, Error>;
}

/**
 * A generic component that populates resource details
 *
 * @param props - PopulatedGenericDetails component props
 */
export function PopulatedResourceDetails<ResourceType = IResource>(
  props: PopulatedResourceDetailsProps<ResourceType>
) {
  const { resourceDetailsPropsGetter, resourceQueryParams } = props;
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery(resourceQueryParams);
  const resourceDetailsProps = useMemo(
    () => (data ? resourceDetailsPropsGetter(data, t) : undefined),
    [data, resourceDetailsPropsGetter] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (isLoading) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (error) {
    return <BrokenPage errorMessage={t('There was a problem fetching the patient')} />;
  }

  return <>{resourceDetailsProps && <ResourceDetails {...resourceDetailsProps} />}</>;
}
