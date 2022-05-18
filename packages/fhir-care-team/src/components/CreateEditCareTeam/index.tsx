import React from 'react';
import { Col, Row } from 'antd';
import { useQuery } from 'react-query';
import { Spin } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { Dictionary } from '@onaio/utils';
import { BrokenPage, FHIRServiceClass, loadAllResources } from '@opensrp/react-utils';
import {
  FHIR_CARE_TEAM,
  FHIR_GROUPS,
  FHIR_PRACTITIONERS,
  groupResourceType,
  practitionerResourceType,
  ROUTE_PARAM_CARE_TEAM_ID,
} from '../../constants';
import { CareTeamForm, FormFields } from './Form';
import { getPatientName } from './utils';
import { Practitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/practitioner';
import { get } from 'lodash';
import { useTranslation } from '../../mls';

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

export const defaultInitialValues: FormFields = {
  uuid: '',
  id: '',
  name: '',
  status: '',
  practitionersId: [],
  groupsId: '',
};
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
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res) => res,
      enabled: !!careTeamId,
    }
  );

  const fhirGroups = useQuery(
    FHIR_GROUPS,
    async () => loadAllResources(fhirBaseURL, groupResourceType),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res) => res,
    }
  );

  const fhirPractitioners = useQuery(
    FHIR_PRACTITIONERS,
    async () => loadAllResources(fhirBaseURL, practitionerResourceType),
    {
      onError: () => sendErrorNotification(t('An error occurred')),
      select: (res) => res,
    }
  );

  if (
    fhirPractitioners.isLoading ||
    fhirGroups.isLoading ||
    (!singleCareTeam.isIdle && singleCareTeam.isLoading)
  ) {
    return <Spin size="large" className="custom-spinner" />;
  }

  if (singleCareTeam.error && !singleCareTeam.data) {
    return <BrokenPage errorMessage={(singleCareTeam.error as Error).message} />;
  }

  const buildInitialValues = singleCareTeam.data
    ? {
        uuid: get(singleCareTeam.data, 'identifier.0.value', undefined),
        id: singleCareTeam.data.id,
        name: singleCareTeam.data.name,
        status: singleCareTeam.data.status ?? 'active',
        practitionersId: singleCareTeam.data.participant?.map(
          (p: Dictionary) => p.member.reference.split('/')[1]
        ),
        groupsId: singleCareTeam.data.subject?.reference?.split('/')[1] ?? '',
      }
    : defaultInitialValues;

  const careTeamFormProps = {
    fhirBaseURL,
    initialValues: buildInitialValues,
    // filter for only active practitioners and map output to object with id and name
    practitioners:
      fhirPractitioners.data?.entry?.flatMap((e: Dictionary) =>
        (e.resource as Practitioner).active
          ? [
              {
                id: e.resource.id,
                name: getPatientName(e.resource),
              },
            ]
          : []
      ) ?? [],
    groups:
      fhirGroups.data?.entry?.map((e: Dictionary) => ({
        id: e.resource?.id,
        name: e.resource?.name,
      })) ?? [],
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
