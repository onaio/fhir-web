import React from 'react';
import { Col, Row } from 'antd';
import { useQuery } from 'react-query';
import FHIR from 'fhirclient';
import { useDispatch, useSelector } from 'react-redux';
import { Spin } from 'antd';
import { sendErrorNotification } from '@opensrp/notifications';
import { RouteComponentProps } from 'react-router-dom';
import lang from '../../lang';
import {
  FHIR_CARE_TEAM,
  FHIR_GROUPS,
  FHIR_PRACTITIONERS,
  ROUTE_PARAM_CARE_TEAM_ID,
} from '../../constants';
import { CareTeamForm, FormFields } from './Form';
import { getPatientName } from './utils';

// Interface for route params
interface RouteParams {
  careTeamId: string;
}

/** props for editing a user view */
export interface EditCareTeamProps {
  fhirBaseURL: string;
}

/** type intersection for all types that pertain to the props */
export type CreateEditCareTeamProps = EditCareTeamProps & RouteComponentProps<RouteParams>;

/** default props for editing user component */
export const defaultEditCareTeamsProps: EditCareTeamProps = {
  fhirBaseURL: '',
};

/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditCareTeam: React.FC<CreateEditCareTeamProps> = (props: CreateEditCareTeamProps) => {
  const { fhirBaseURL } = props;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const careTeamId = props.match.params[ROUTE_PARAM_CARE_TEAM_ID];
  //   const initialValues = keycloakUserGroup.length ? keycloakUserGroup[0] : defaultInitialValues;

  /**
   * Fetch group incase the user group is not available e.g when page is refreshed
   * also fetches all roles, available and assigned roles during edit mode
   */
  React.useEffect(() => {
    if (careTeamId) {
      console.log('user group');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  const singleCareTeam = useQuery(
    FHIR_CARE_TEAM,
    () => FHIR.client(fhirBaseURL).request(`${FHIR_CARE_TEAM}/${careTeamId}`),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: any) => res,
    }
  );

  const fhirGroups = useQuery(FHIR_GROUPS, () => FHIR.client(fhirBaseURL).request(FHIR_GROUPS), {
    onError: () => sendErrorNotification(lang.ERROR_OCCURED),
    select: (res: any) => res,
  });

  const fhirPractitioners = useQuery(
    FHIR_PRACTITIONERS,
    () => FHIR.client(fhirBaseURL).request(FHIR_PRACTITIONERS),
    {
      onError: () => sendErrorNotification(lang.ERROR_OCCURED),
      select: (res: any) => res,
    }
  );

  if (singleCareTeam.isLoading || fhirGroups.isLoading || fhirPractitioners.isLoading) {
    return <Spin size="large" />;
  }

  const userGroupFormProps = {
    fhirBaseURL,
    initialValues: {
      id: singleCareTeam.data.id,
      name: singleCareTeam.data.name,
      status: singleCareTeam.data.status,
      practitioners: fhirPractitioners.data.entry.map((e: any) => {
        return {
          id: e.resource.id,
          name: getPatientName(e.resource),
        };
      }),
      groups: fhirGroups.data.entry.map((e: any) => {
        return {
          id: e.resource.id,
          name: e.resource.name,
        };
      }),
    },
  };

  return (
    <Row>
      <Col span={24}>
        <CareTeamForm {...userGroupFormProps} />
      </Col>
    </Row>
  );
};

CreateEditCareTeam.defaultProps = defaultEditCareTeamsProps;

export { CreateEditCareTeam };
