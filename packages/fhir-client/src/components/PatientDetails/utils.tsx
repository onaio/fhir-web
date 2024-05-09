import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { getPatientName } from '../PatientsList/utils';
import type { TFunction } from '@opensrp/i18n';
import { ResourceDetailsProps } from '@opensrp/react-utils';
import { get } from 'lodash';

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
  const { meta, gender, birthDate, id } = resource;
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
  return {
    title: patientName,
    headerRightData,
    headerLeftData,
    bodyData,
  };
}
