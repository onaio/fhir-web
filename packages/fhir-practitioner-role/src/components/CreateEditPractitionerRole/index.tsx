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
  FHIR_GROUPS,
  FHIR_PRACTITIONERS,
  ROUTE_PARAM_PRACTITIONER_ROLE_ID,
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
  name: '',
  status: '',
  active: true,
  practitionersId: [],
  groupsId: '',
};
/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditPractitionerRole: React.FC<CreateEditPractitionerRoleProps> = (
  props: CreateEditPractitionerRoleProps
) => {
  const { fhirBaseURL } = props;
  const careTeamId = props.match.params[ROUTE_PARAM_PRACTITIONER_ROLE_ID];
  const singleCareTeam = useQuery(
    `${FHIR_PRACTITIONER_ROLE}/${careTeamId}`,
    async () =>
      careTeamId
        ? FHIR.client(fhirBaseURL).request(`${FHIR_PRACTITIONER_ROLE}/${careTeamId}`)
        : undefined,
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.ICareTeam) => res,
    }
  );

  const fhirGroups = useQuery(
    FHIR_GROUPS,
    async () => FHIR.client(fhirBaseURL).request(FHIR_GROUPS),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  const fhirPractitioners = useQuery(
    FHIR_PRACTITIONERS,
    async () => FHIR.client(fhirBaseURL).request(FHIR_PRACTITIONERS),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: IfhirR4.IBundle) => res,
    }
  );

  if (singleCareTeam.isLoading || fhirGroups.isLoading || fhirPractitioners.isLoading) {
    return <Spin size="large" />;
  }

  const buildInitialValues = singleCareTeam.data
    ? {
        uuid: (singleCareTeam.data?.identifier as Dictionary[])[0].value as string,
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
    practitioners:
      fhirPractitioners.data?.entry?.map((e: Dictionary) => {
        return {
          id: e.resource.id,
          name: getPatientName(e.resource),
        };
      }) ?? [],
    groups:
      fhirGroups.data?.entry?.map((e: Dictionary) => ({
        id: e.resource?.id,
        name: e.resource?.name as string,
      })) ?? [],
  };

  return (
    <Row>
      <Col span={24}>{/* <PractitionerRoleForm {...careTeamFormProps} /> */}</Col>
    </Row>
  );
};

CreateEditPractitionerRole.defaultProps = defaultEditPractitionerRoleProps;

export { CreateEditPractitionerRole };
