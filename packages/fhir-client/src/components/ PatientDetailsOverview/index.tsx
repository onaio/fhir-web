import React from 'react';
import { Col, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import {
  BrokenPage,
  FHIRServiceClass,
  ResourceDetails,
  useSearchParams,
  viewDetailsQuery,
  KeyValuesDescriptions,
} from '@opensrp/react-utils';
import { LIST_PATIENTS_URL, patientResourceType } from '../../constants';
import { useTranslation } from '../../mls';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { getPatientName } from '../PatientsList/utils';
import { Link } from 'react-router-dom';
import { Resource404 } from '@opensrp/react-utils'; // Import the Resource404 component

export interface PatientListViewProps {
  fhirBaseURL: string;
  column?: number; // Added column prop
}

const PatientDetailsOverview = (props: PatientListViewProps) => {
  const { fhirBaseURL, column = 2 } = props; // Default column value
  const { t } = useTranslation();
  const { removeParam, sParams } = useSearchParams();
  const patientId = sParams.get(viewDetailsQuery) ?? undefined;

  const { data, error } = useQuery({
    queryKey: [patientResourceType, patientId],
    queryFn: async () =>
      new FHIRServiceClass<IPatient>(fhirBaseURL, patientResourceType).read(
        patientId as unknown as string
      ),
    enabled: !!patientId,
  });

  if (error) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  if (!patientId || !data) {
    return (
      <Resource404
        title={t('Patient Not Found')}
        errorMessage={t('The patient you are looking for does not exist.')}
        homeUrl={LIST_PATIENTS_URL}
      />
    );  // Return Resource404 component with relevant props
  }

  const { id, gender, birthDate, address, telecom, identifier, deceasedBoolean, active } = data;

  let status = {
    title: t('Inactive'),
    color: 'gray',
  };

  if (deceasedBoolean) {
    status = {
      title: t('Deceased'),
      color: 'red',
    };
  } else if (active) {
    status = {
      title: t('Active'),
      color: 'green',
    };
  }

  const patientInfo = {
    UUID: identifier && identifier.length > 0 ? identifier[0]?.value : '',
    Phone: telecom && telecom.length > 0 ? telecom[0].value : '',
    Address: address?.[0]?.line?.[0] ?? '',
    'Date of Birth': birthDate,
    MRN: 'Unknown',
    Country: address && address.length > 0 ? address[0]?.country : '',
  };

  const resourceDetailsProp = {
    title: getPatientName(data),
    headerLeftData: {
      [t('ID')]: id,
      [t('Gender')]: gender,
    },
    status,
    headerActions: (
      <Button
        data-testid="cancel"
        icon={<CloseOutlined />}
        shape="circle"
        type="text"
        onClick={() => removeParam(viewDetailsQuery)}
      />
    ),
    bodyData: () => <KeyValuesDescriptions data={patientInfo} column={column} theme="default" />,
    footer: (
      <Link to={`${LIST_PATIENTS_URL}/${id}`} className="m-0 p-1">
        {t('View full details')}
      </Link>
    ),
  };

  return (
    <Col className="view-details-content" span={8}>
      <ResourceDetails {...resourceDetailsProp} column={column} />
    </Col>
  );
};

export { PatientDetailsOverview };
