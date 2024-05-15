import React from 'react';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { getPatientName, getPatientStatus, patientStatusColor } from '../PatientsList/utils';
import type { TFunction } from '@opensrp/i18n';
import { FHIRServiceClass, ResourceDetailsProps } from '@opensrp/react-utils';
import { get } from 'lodash';
import { IResource } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IResource';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { LIST_PATIENTS_URL } from '../../constants';

/**
 * Extract resource details props from resource
 *
 * @param resource - Patient resource
 * @param t - translation function
 */
export function resourceDetailsPropsGetter(
  resource: IPatient | undefined,
  t: TFunction
): ResourceDetailsProps {
  if (!resource) {
    return {} as ResourceDetailsProps;
  }
  const { meta, gender, birthDate, id, active, deceasedBoolean } = resource;
  const patientName = getPatientName(resource);
  const splitName = patientName ? patientName.split(' ') : [];
  const headerRightData = {
    [t('Date created')]: meta?.lastUpdated,
  };
  const headerLeftData = {
    [t('ID')]: id,
    [t('Gender')]: gender,
  };
  const bodyData = {
    [t('First name')]: splitName[0],
    [t('Last name')]: splitName[1],
    [t('UUID')]: get(resource, 'identifier.0.value'),
    [t('Date of birth')]: birthDate,
    [t('Phone')]: get(resource, 'telecom.0.value'),
    [t('MRN')]: 'Unknown',
    [t('Address')]: get(resource, 'address.0.line.0') || 'N/A',
    [t('Country')]: get(resource, 'address.0.country'),
  };
  const patientStatus = getPatientStatus(active as boolean, deceasedBoolean as boolean);
  return {
    title: patientName,
    headerRightData,
    headerLeftData,
    bodyData,
    status: {
      title: patientStatus,
      color: patientStatusColor[patientStatus],
    },
  };
}

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
 */
export function queryParamsFactory<T extends IResource>(fhirBaseURL: string, resourceType: string) {
  return (id: string) => {
    const resourceQueryParams = {
      queryKey: [resourceType, id],
      queryFn: async () => new FHIRServiceClass<T>(fhirBaseURL, resourceType).read(id),
    };
    return resourceQueryParams;
  };
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