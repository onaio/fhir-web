import React from 'react';
import { Col, Button, Alert } from 'antd';
import { CloseOutlined, SyncOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { BrokenPage, FHIRServiceClass, getResourcesFromBundle, useSearchParams, viewDetailsQuery } from '@opensrp/react-utils';
import { patientResourceType } from '../../constants';
import { useTranslation } from '../../mls';
import { renderObjectAsKeyvalue } from '@opensrp/react-utils';
import { get, keyBy } from 'lodash';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { Resource } from '@smile-cdr/fhirts/dist/FHIR-R3';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';

/** typings for the patient details view component */
export interface PatientDetailsProps {
  patientId: string;
  fhirBaseURL: string;
}

/**
 * component that renders the patient details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const PatientDetails = (props: PatientDetailsProps) => {
  const { patientId, fhirBaseURL } = props;
  const { t } = useTranslation();
  const { removeParam } = useSearchParams();

  // fetch patient details
  const { data, isLoading, error } = useQuery({
    queryKey: [patientResourceType, patientId],
    queryFn: () =>
      new FHIRServiceClass<IBundle>(fhirBaseURL, patientResourceType).list({
        _id: patientId,
      }),
    enabled: !!patientId,
    select: (res) => {
      const resEntries = getResourcesFromBundle<Resource>(res);
      const patient = resEntries.find((entry) => entry.resourceType === patientResourceType) as unknown as IPatient;
      return { patient };
    },
  });

  const patient = data?.patient;

  const patientKeyValues = {
    [t('Name')]: `${patient?.name?.[0]?.given?.join(' ')} ${patient?.name?.[0]?.family ?? ''}`,
    [t('ID')]: patient?.id,
    [t('Gender')]: patient?.gender,
    [t('Date of Birth')]: patient?.birthDate,
    [t('Deceased')]: patient?.deceasedDateTime ? t('Yes') : t('No'),
    [t('Phone')]: get(patient, 'telecom.0.value', t('N/A')),
    // Add more patient details as needed
  };

  return (
    <Col className="patient-details-content">
      <div className="flex-right">
        <Button
          data-testid="cancel"
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => removeParam(viewDetailsQuery)}
        />
      </div>
      {error && !data ? (
        <BrokenPage errorMessage={`${error}`} />
      ) : (
        <>
          {isLoading ? (
            <Alert
              description={t('Fetching Patient details')}
              type="info"
              showIcon
              icon={<SyncOutlined spin />}
            ></Alert>
          ) : patient ? (
            renderObjectAsKeyvalue(patientKeyValues)
          ) : (
            <Alert description={t('Patient not found')} type="warning"></Alert>
          )}
        </>
      )}
    </Col>
  );
};

export { PatientDetails };
