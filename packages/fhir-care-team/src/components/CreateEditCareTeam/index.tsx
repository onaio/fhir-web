import React from 'react';
import { Col, Row } from 'antd';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps, useParams } from 'react-router-dom';
import {
  BrokenPage,
  FHIRServiceClass,
  getResourcesFromBundle,
  loadAllResources,
} from '@opensrp/react-utils';
import {
  FHIR_CARE_TEAM,
  FHIR_PRACTITIONERS,
  organizationResourceType,
  practitionerResourceType,
  ROUTE_PARAM_CARE_TEAM_ID,
} from '../../constants';
import { CareTeamForm } from './Form';
import { getCareTeamFormFields } from './utils';
import { useTranslation } from '../../mls';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';

// Interface for route params
interface RouteParams {
  [ROUTE_PARAM_CARE_TEAM_ID]?: string;
}

/** props for editing a user view */
export interface EditCareTeamProps {
  fhirBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type CreateEditCareTeamProps = EditCareTeamProps & RouteComponentProps<RouteParams>;

/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditCareTeam: React.FC<CreateEditCareTeamProps> = (props: CreateEditCareTeamProps) => {
  const { fhirBaseURL } = props;
  const params = useParams<RouteParams>();
  const careTeamId = params[ROUTE_PARAM_CARE_TEAM_ID];
  const { t } = useTranslation();

  const singleCareTeam = useQuery(
    [FHIR_CARE_TEAM, careTeamId],
    async () => await new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM).read(careTeamId as string),
    {
      onError: () => sendErrorNotification(t('There was a problem fetching the Care Team')),
      select: (res) => res,
      enabled: !!careTeamId,
      cacheTime: 0,
      staleTime: 0,
    }
  );

  const organizations = useQuery(
    organizationResourceType,
    async () => loadAllResources(fhirBaseURL, organizationResourceType),
    {
      onError: () => sendErrorNotification(t('There was a problem fetching organizations')),
      select: (res) => getResourcesFromBundle<IOrganization>(res),
    }
  );

  const fhirPractitioners = useQuery(
    FHIR_PRACTITIONERS,
    async () => loadAllResources(fhirBaseURL, practitionerResourceType, { active: true }),
    {
      onError: () => sendErrorNotification(t('There was a problem fetching practitioners')),
      select: (res) => getResourcesFromBundle<IPractitioner>(res),
    }
  );

  if (
    fhirPractitioners.isLoading ||
    organizations.isLoading ||
    (!singleCareTeam.isIdle && singleCareTeam.isLoading)
  ) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (singleCareTeam.error && !singleCareTeam.data) {
    return <BrokenPage errorMessage={(singleCareTeam.error as Error).message} />;
  }

  const buildInitialValues = getCareTeamFormFields(singleCareTeam.data as ICareTeam);

  const careTeamFormProps = {
    fhirBaseURL,
    initialValues: buildInitialValues,
    organizations: organizations.data ?? [],
    practitioners: fhirPractitioners.data ?? [],
  };

  return (
    <Row>
      <Col span={24}>
        <CareTeamForm {...careTeamFormProps} />
      </Col>
    </Row>
  );
};

export { CreateEditCareTeam };
