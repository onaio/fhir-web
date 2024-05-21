import React from 'react';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { BodyLayout, PopulatedResourceDetails } from '@opensrp/react-utils';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { LIST_PATIENTS_URL, patientResourceType } from '../../constants';
import { useTranslation } from '../../mls';
import { getResourceDetailsProps, queryParamsFactory } from './utils';
import { MemoizePopulatedTableTabs } from './PopulatedTableTabs';
import './index.css';

// Interface for route params
interface RouteParams {
  id: string;
  resourceType?: string;
  resourceId?: string;
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
export const PatientDetails: React.FC<PatientDetailPropTypes> = (props: PatientDetailPropTypes) => {
  const { fhirBaseURL } = props;
  const { id: patientId, resourceType, resourceId } = useParams<RouteParams>();

  const { t } = useTranslation();
  const activeResourceId = resourceId ?? patientId;
  const activeResourceType = resourceType ?? patientResourceType;
  const isPatientDetailsPage = !(resourceType && resourceId);
  const pageTitle = t('View details');
  const viewDetailsItem = { title: t('View details') };
  const breadCrumbItems = [
    {
      title: t('Patients'),
      path: LIST_PATIENTS_URL,
    },
    viewDetailsItem,
  ];

  if (!isPatientDetailsPage) {
    breadCrumbItems[1] = {
      title: t('Patient profile'),
      path: `${LIST_PATIENTS_URL}/${patientId}`,
    };
    breadCrumbItems.push(viewDetailsItem);
  }

  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      subTitle: activeResourceId,
    },
    breadCrumbProps: {
      items: breadCrumbItems,
    },
  };
  const populatedResourceDetailsProps = {
    resourceQueryParams: queryParamsFactory(fhirBaseURL, activeResourceType, activeResourceId),
    resourceDetailsPropsGetter: getResourceDetailsProps(activeResourceType),
    fhirBaseURL,
  };
  const tableTabsProps = {
    fhirBaseURL,
    patientId,
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <div className="details-content">
        <PopulatedResourceDetails<IPatient> {...populatedResourceDetailsProps} />
        {isPatientDetailsPage && <MemoizePopulatedTableTabs {...tableTabsProps} />}
      </div>
    </BodyLayout>
  );
};
