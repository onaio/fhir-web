import React from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import {
  FHIRServiceClass,
  GenericDetailsView,
  GenericDetailsViewProps,
} from '@opensrp/react-utils';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { LIST_PATIENTS_URL, patientResourceType } from '../../constants';
import { useTranslation } from '../../mls';
import { resourceDetailsPropsGetter } from './utils';

// Interface for route params
interface RouteParams {
  id: string;
}

/** props for editing a user view */
export interface PatientDetailProps {
  fhirBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type PatientDetailPropTypes = PatientDetailProps & RouteComponentProps<RouteParams>;

/**
 * Component which shows FHIR resource details of a single patient
 *
 * @param {Object} props - PatientDetails component props
 * @returns {React.FC} returns patient resources display
 */
const PatientDetails: React.FC<PatientDetailPropTypes> = (props: PatientDetailPropTypes) => {
  const { fhirBaseURL } = props;
  const { id: patientId } = useParams<RouteParams>();
  const { t } = useTranslation();

  const resourceQueryParams = {
    queryKey: [patientResourceType, patientId],
    queryFn: async () =>
      new FHIRServiceClass<IPatient>(fhirBaseURL, patientResourceType).read(patientId),
  };

  const breadCrumbProps = {
    items: [
      {
        title: t('Patients'),
        path: LIST_PATIENTS_URL,
      },
      {
        title: t('Patient profile'),
      },
    ],
  };

  const pageTitle = t('Patient profile');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
    breadCrumbProps,
  };

  const genericDetailsViewProps: GenericDetailsViewProps<IPatient> = {
    bodyLayoutProps: { headerProps },
    resourceQueryParams,
    resourceDetailsPropsGetter,
  };

  return <GenericDetailsView<IPatient> {...genericDetailsViewProps} />;
};

export { PatientDetails };
