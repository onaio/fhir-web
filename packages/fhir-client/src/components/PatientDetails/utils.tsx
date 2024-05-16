import React from 'react';
import type { TFunction } from '@opensrp/i18n';
import { FHIRServiceClass, ResourceDetailsProps } from '@opensrp/react-utils';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { IImmunization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IImmunization';
import { IEncounter } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IEncounter';
import { ICondition } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICondition';
import { ITask } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ITask';
import { ICarePlan } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICarePlan';
import {
  LIST_PATIENTS_URL,
  carePlanResourceType,
  conditionResourceType,
  encounterResourceType,
  immunizationResourceType,
  patientResourceType,
  taskResourceType,
} from '../../constants';
import { Dictionary } from '@onaio/utils';

export type ResourceTypes = ICarePlan | ICondition | ITask | IImmunization | IEncounter;

/**
 * Gets default patient resource search param
 *
 * @param resourceId - Patient resource identifier
 */
export const defaultSearchParamsFactory = (resourceId: string) => {
  return { 'subject:Patient': resourceId };
};

/**
 * Gets resource search param
 *
 * @param baseResourceType - current page resource type
 * @param lookupResourceType - lookup resource type
 */
export const searchParamsFactory = (baseResourceType: string, lookupResourceType: string) => {
  return (resourceId: string) => {
    const patientResourceParams: Record<string, Dictionary> = {
      [carePlanResourceType]: { 'subject:Patient': resourceId },
      [conditionResourceType]: { 'subject:Patient': resourceId },
      [encounterResourceType]: { 'subject:Patient': resourceId },
      [immunizationResourceType]: { patient: resourceId },
      [taskResourceType]: { patient: resourceId },
    };
    const resourcesParams: Record<string, typeof patientResourceParams> = {
      [patientResourceType]: patientResourceParams,
    };
    return resourcesParams[baseResourceType][lookupResourceType];
  };
};

/**
 * Build resource query
 *
 * @param fhirBaseURL - base url
 * @param resourceType - resource type
 * @param resourceId - resource id
 */
export function queryParamsFactory<T extends IResource = ResourceTypes>(
  fhirBaseURL: string,
  resourceType: string,
  resourceId: string
) {
  const resourceQueryParams = {
    queryKey: [resourceType, resourceId],
    queryFn: async () => new FHIRServiceClass<T>(fhirBaseURL, resourceType).read(resourceId),
  };
  return resourceQueryParams;
}

type PreviewDataExtractor<T> = (resource: T, t: TFunction) => ResourceDetailsProps;

/**
 * @param patientId - patient resource Id
 * @param dataExtractor - Function to extract preview data
 * @param cancelHanlder - on cancel click handler
 */
export function sidePreviewDetailsExtractor<T extends IResource>(
  patientId: string,
  dataExtractor: PreviewDataExtractor<T>,
  cancelHanlder: () => void
) {
  // eslint-disable-next-line react/display-name
  return (resource: T, t: TFunction) => {
    const { resourceType, id } = resource;
    const data = dataExtractor(resource, t);
    const headerActions = (
      <Button
        data-testid="close-button"
        icon={<CloseOutlined />}
        shape="circle"
        type="text"
        size="small"
        onClick={() => cancelHanlder()}
      />
    );
    return {
      headerActions,
      footer: (
        <Link to={`${LIST_PATIENTS_URL}/${patientId}/${resourceType}/${id}`}>
          {' '}
          {t('View full details')}
        </Link>
      ),
      ...data,
    };
  };
}
