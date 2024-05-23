import React, { useMemo } from 'react';
import { DescriptionsProps, Spin } from 'antd';
import { UseQueryOptions, useQuery } from 'react-query';
import { useTranslation } from '../../../mls';
import { ResourceDetails, ResourceDetailsProps } from '../ResourceDetails';
import { BrokenPage } from '../../BrokenPage';
import { TFunction } from '@opensrp/i18n';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';

export interface PopulatedResourceDetailsProps<ResourceType> {
  resourceDetailsPropsGetter: (
    data: ResourceType,
    t: TFunction,
    fhirBaseURL?: string
  ) => ResourceDetailsProps;
  resourceQueryParams: UseQueryOptions<ResourceType, Error>;
  column?: DescriptionsProps['column'];
  fhirBaseURL?: string;
}

/**
 * A generic component that populates resource details
 *
 * @param props - PopulatedGenericDetails component props
 */
export function PopulatedResourceDetails<ResourceType = IResource>(
  props: PopulatedResourceDetailsProps<ResourceType>
) {
  const { resourceDetailsPropsGetter, resourceQueryParams, column, fhirBaseURL } = props;
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery(resourceQueryParams);
  const resourceDetailsProps = useMemo(
    () => (data ? resourceDetailsPropsGetter(data, t, fhirBaseURL) : undefined),
    [data, resourceDetailsPropsGetter] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (isLoading) {
    return <Spin size="small" className="custom-spinner" />;
  }

  if (error) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  return (
    <>{resourceDetailsProps && <ResourceDetails column={column} {...resourceDetailsProps} />}</>
  );
}
