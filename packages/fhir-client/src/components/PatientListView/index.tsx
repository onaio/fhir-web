import React from 'react';
import { Col, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { BrokenPage, FHIRServiceClass, ResourceDetails, useSearchParams, viewDetailsQuery } from '@opensrp/react-utils';
import { LIST_PATIENTS_URL, patientResourceType } from '../../constants';
import { useTranslation } from '../../mls';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { getPatientName } from '../PatientsList/utils';
import { Link } from 'react-router-dom';

export interface PatientListViewProps {
  fhirBaseURL: string;
}

const PatientListView = (props: PatientListViewProps) => {
  const { fhirBaseURL } = props;
  const { t } = useTranslation();
  const { removeParam, sParams } = useSearchParams();
  const patientId = sParams.get(viewDetailsQuery) ?? undefined;

  const { data, error } = useQuery(
    {
      queryKey: [patientResourceType, patientId],
      queryFn: async () =>
        new FHIRServiceClass<IPatient>(fhirBaseURL, patientResourceType).read(patientId as unknown as string),
      enabled: !!patientId
    }
  );

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  if (!patientId || !data) {
    return null;
  }

  const { id, gender, birthDate, address, telecom, identifier } = data;

  const resourceDetailsProp = {
    title: getPatientName(data),
    headerLeftData: {
      ID: id,
      Gender: gender
    },
    headerActions:
      <Button
        data-testid="cancel"
        icon={<CloseOutlined />}
        shape="circle"
        type="text"
        onClick={() => removeParam(viewDetailsQuery)}
      />,
    bodyData: {
	  UUID: identifier && identifier.length > 0 ? identifier[0]?.value : '',
	  Phone: telecom && telecom.length > 0 ? telecom[0].value : '',
	  Address: address?.[0]?.line?.[0] ?? '', 
      'Birth Date': birthDate,
	  MRN: 'Unknown',
      Country: address && address.length > 0 ? address[0]?.country : ''
    },
    footer:
      <Link to={`${LIST_PATIENTS_URL}/${id}`} className="m-0 p-1">
        {t('View full details')}
      </Link>
  };

  return (
    <Col className="view-details-content">
      <ResourceDetails {...resourceDetailsProp} />
    </Col>
  );
};

export { PatientListView };

