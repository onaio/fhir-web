import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { Spin } from 'antd';
import React from 'react';
import { UseQueryOptions, useQuery } from 'react-query';

export interface ResourceItemLoaderProps<ResourceType> {
  resourceQueryParams: UseQueryOptions<ResourceType, Error>;
  itemGetter: (resource: ResourceType) => React.ReactNode;
}

/**
 * Component to help load a single resource item
 * Used when loading related resources
 *
 * @param props - ResourceItemLoader component props
 */
export function ResourceItemLoader<T extends IResource>(props: ResourceItemLoaderProps<T>) {
  const { resourceQueryParams, itemGetter } = props;
  const { data, isLoading, error } = useQuery(resourceQueryParams);
  if (isLoading) {
    return <Spin size="small" className="custom-spinner" />;
  }
  if (error || !data) {
    return null;
  }
  const item = itemGetter(data);
  return <>{item}</>;
}
