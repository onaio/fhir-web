import React, { useMemo } from 'react';
import { Spin } from 'antd';
import { UseQueryOptions, useQuery } from 'react-query';
import { useTranslation } from '../../../mls';
import { ResourceDetails, ResourceDetailsProps } from '../ResourceDetails';
import { BrokenPage } from '../../BrokenPage';
import { BodyLayout, BodyLayoutProps } from '../../BodyLayout';
import { TFunction } from '@opensrp/i18n';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';

type PartialBodyLayoutProps = Omit<BodyLayoutProps, 'children'>;
export interface GenericDetailsViewProps<ResourceType> {
  bodyLayoutProps: PartialBodyLayoutProps;
  resourceDetailsPropsGetter: (data: ResourceType, t: TFunction) => ResourceDetailsProps;
  resourceQueryParams: UseQueryOptions<ResourceType, Error>;
  resourceId: string;
  children?: React.ReactNode;
}

/**
 * A generic component that combines details view different sections
 *
 * @param props - GenericDetailsView component props
 */
export function GenericDetailsView<ResourceType = IResource>(
  props: GenericDetailsViewProps<ResourceType>
) {
  const { bodyLayoutProps, resourceDetailsPropsGetter, resourceQueryParams, children } = props;
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

  return (
    <BodyLayout {...bodyLayoutProps}>
      {resourceDetailsProps && <ResourceDetails {...resourceDetailsProps} />}
      {children}
    </BodyLayout>
  );
}
