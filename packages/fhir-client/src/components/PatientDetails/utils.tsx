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
import { patientDetailsProps } from './ResourceSchema/Patient';
import { Dictionary } from '@onaio/utils';
import { conditionDetailsProps } from './ResourceSchema/Condition';
import { carePlanDetailsProps } from './ResourceSchema/CarePlan';
import { immunizationDetailProps } from './ResourceSchema/Immunization';
import { encounterDetailProps } from './ResourceSchema/Encounter';
import { taskDetailsProps } from './ResourceSchema/Task';

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
 * get tab table side prevew data
 *
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
          {t('View full details')}
        </Link>
      ),
      ...data,
    };
  };
}

/**
 * Gets resource detail props
 *
 * @param resourceType - resource type
 */
export const getResourceDetailsProps = (resourceType: string) => {
  const resourceDetailProps: Dictionary = {
    [carePlanResourceType]: carePlanDetailsProps,
    [patientResourceType]: patientDetailsProps,
    [conditionResourceType]: conditionDetailsProps,
    [immunizationResourceType]: immunizationDetailProps,
    [encounterResourceType]: encounterDetailProps,
    [taskResourceType]: taskDetailsProps,
  };
  const targetResourceDetailProps = resourceDetailProps[resourceType];
  return targetResourceDetailProps ?? patientDetailsProps;
};
