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
  FHIR_PRACTITIONER_ROLE,
  FHIR_PRACTITIONERS,
  ROUTE_PARAM_PRACTITIONER_ROLE_ID,
  FHIR_ORGANIZATIONS,
} from '../../constants';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { PractitionerRoleForm, FormFields } from './Form';
import { getPatientName } from './utils';

// Interface for route params
interface RouteParams {
  practitionerRoleId: string;
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
  practitionersId: '',
  orgsId: '',
};
/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditPractitionerRole: React.FC<CreateEditPractitionerRoleProps> = (
  props: CreateEditPractitionerRoleProps
) => {
  const { fhirBaseURL } = props;
  const practitionerRoleId = props.match.params[ROUTE_PARAM_PRACTITIONER_ROLE_ID];
  const singlePractitionerRole = useQuery(
    `${FHIR_PRACTITIONER_ROLE}/${practitionerRoleId}`,
    async () =>
      practitionerRoleId
        ? FHIR.client(fhirBaseURL).request(`${FHIR_PRACTITIONER_ROLE}/${practitionerRoleId}`)
        : undefined,
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IPractitionerRole) => res,
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

  const fhirPractitioners = useQuery(
    FHIR_PRACTITIONERS,
    async () => FHIR.client(fhirBaseURL).request(`${FHIR_PRACTITIONERS}/_search?_count=${1000}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  if (
    singlePractitionerRole.isLoading ||
    fhirOrganizations.isLoading ||
    fhirPractitioners.isLoading
  ) {
    return <Spin size="large" />;
  }

  const buildInitialValues = singlePractitionerRole.data
    ? {
        uuid: (singlePractitionerRole.data?.identifier as Dictionary[])[0].value as string,
        id: singlePractitionerRole.data.id,
        active: singlePractitionerRole.data.active ?? true,
        practitionersId: singlePractitionerRole.data.practitioner?.reference?.split('/')[1] ?? '',
        orgsId: singlePractitionerRole.data.organization?.reference?.split('/')[1] ?? '',
      }
    : defaultInitialValues;

  const careTeamFormProps = {
    fhirBaseURL,
    initialValues: buildInitialValues,
    practitioners:
      fhirPractitioners.data?.entry?.map((e: Dictionary) => {
        return {
          id: e.resource.id,
          name: getPatientName(e.resource),
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

CreateEditPractitionerRole.defaultProps = defaultEditPractitionerRoleProps;

export { CreateEditPractitionerRole };
