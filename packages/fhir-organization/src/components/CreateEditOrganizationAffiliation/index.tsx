import React from 'react';
import { Col, Row } from 'antd';
import { useQuery } from 'react-query';
import FHIR from 'fhirclient';
import { Spin } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps } from 'react-router-dom';
import { Dictionary } from '@onaio/utils';
import lang from '../../lang';
import {
  FHIR_ORGANIZATIONS,
  ROUTE_PARAM_ORG_AFFILIATION_ID,
  FHIR_ORG_AFFILIATION,
  FHIR_LOCATION,
} from '../../constants';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { PractitionerRoleForm, FormFields } from './Form';

// Interface for route params
interface RouteParams {
  orgAffiliationId: string;
}

/** props for editing a user view */
export interface EditPractitionerRoleProps {
  fhirBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type CreateEditPractitionerRoleProps = EditPractitionerRoleProps &
  RouteComponentProps<RouteParams>;

/** default props for editing user component */
export const defaultEditPractitionerRoleProps: EditPractitionerRoleProps = {
  fhirBaseURL: '',
};

export const defaultInitialValues: FormFields = {
  uuid: '',
  id: '',
  active: true,
  locationsId: [],
  orgsId: '',
};
/**
 *
 * @param props - CreateEditOrganizationAffiliation component props
 */

const CreateEditOrganizationAffiliation: React.FC<CreateEditPractitionerRoleProps> = (
  props: CreateEditPractitionerRoleProps
) => {
  const { fhirBaseURL } = props;
  const orgAffiliationId = props.match.params[ROUTE_PARAM_ORG_AFFILIATION_ID];
  const singleOrgAffiliation = useQuery(
    `${FHIR_ORG_AFFILIATION}/${orgAffiliationId}`,
    async () =>
      orgAffiliationId
        ? FHIR.client(fhirBaseURL).request(`${FHIR_ORG_AFFILIATION}/${orgAffiliationId}`)
        : undefined,
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IOrganizationAffiliation) => res,
    }
  );

  const fhirOrganizations = useQuery(
    FHIR_ORGANIZATIONS,
    async () => FHIR.client(fhirBaseURL).request(`${FHIR_ORGANIZATIONS}/_search?_count=${1000}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  const fhirLocations = useQuery(
    FHIR_ORG_AFFILIATION,
    async () => FHIR.client(fhirBaseURL).request(`${FHIR_LOCATION}/_search?_count=${1000}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  if (singleOrgAffiliation.isLoading || fhirOrganizations.isLoading || fhirLocations.isLoading) {
    return <Spin size="large" />;
  }

  const buildInitialValues = singleOrgAffiliation.data
    ? {
        uuid: (singleOrgAffiliation.data?.identifier as Dictionary[])[0].value as string,
        id: singleOrgAffiliation.data.id,
        active: singleOrgAffiliation.data.active ?? true,
        locationsId: singleOrgAffiliation.data.location?.map(
          (l: Dictionary) => l.reference.split('/')[1]
        ),
        orgsId: singleOrgAffiliation.data.organization?.reference?.split('/')[1] ?? '',
      }
    : defaultInitialValues;

  const careTeamFormProps = {
    fhirBaseURL,
    initialValues: buildInitialValues,
    locations:
      fhirLocations.data?.entry?.map((e: Dictionary) => {
        return {
          id: e.resource.id,
          name: e.resource?.name as string,
        };
      }) ?? [],
    organizations:
      fhirOrganizations.data?.entry?.map((e: Dictionary) => ({
        id: e.resource?.id,
        name: e.resource?.name as string,
      })) ?? [],
  };

  return (
    <Row>
      <Col span={24}>
        <PractitionerRoleForm {...careTeamFormProps} />
      </Col>
    </Row>
  );
};

CreateEditOrganizationAffiliation.defaultProps = defaultEditPractitionerRoleProps;

export { CreateEditOrganizationAffiliation };
