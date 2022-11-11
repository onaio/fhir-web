import React, { useEffect, useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Col, Row, Spin } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  ROUTE_PARAM_USER_ID,
  KEYCLOAK_URL_USERS,
  OPENSRP_CREATE_PRACTITIONER_ENDPOINT,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../constants';
import { useTranslation } from '../../mls';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  makeKeycloakUsersSelector,
  KeycloakUser,
  UserGroup,
  Practitioner,
} from '../../ducks/user';
import { Dictionary } from '@onaio/utils';
import { getExtraData } from '@onaio/session-reducer';
import '../../index.css';
import { FormFields, UserFormProps } from '../forms/UserForm/types';
import { defaultUserFormInitialValues, UserForm } from '../forms/UserForm';
import { getFormValues, postPutPractitioner } from '../forms/UserForm/utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */
export interface RouteParams {
  userId?: string;
}

/** props for editing a user view */
export interface CreateEditUserProps {
  keycloakUser: KeycloakUser | null;
  keycloakBaseURL: string;
  baseUrl: string;
  extraData: Dictionary;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  userFormHiddenFields?: UserFormProps['hiddenFields'];
  userFormRenderFields?: UserFormProps['renderFields'];
  getPractitionerFun: (baseUrl: string, userId: string) => Promise<Practitioner | IPractitioner>;
  getPractitionerRoleFun?: (baseUrl: string, userId: string) => Promise<IPractitionerRole>;
  postPutPractitionerFactory: UserFormProps['practitionerUpdaterFactory'];
}

const getOpenSrpPractitioner = (baseUrl: string, userId: string) => {
  const serve = new OpenSRPService(OPENSRP_CREATE_PRACTITIONER_ENDPOINT, baseUrl);
  return serve.read(userId);
};

const defaultProps = {
  getPractitionerFun: getOpenSrpPractitioner,
  postPutPractitionerFactory: postPutPractitioner,
};

/** type intersection for all types that pertain to the props */
export type CreateEditPropTypes = CreateEditUserProps & RouteComponentProps<RouteParams>;

/**
 *
 * @param props - CreateEditUser component props
 */
const CreateEditUser: React.FC<CreateEditPropTypes> = (props: CreateEditPropTypes) => {
  const [userGroupsLoading, setUserGroupsLoading] = useState(false);
  const [keyCloakUserLoading, setKeyCloakUserLoading] = useState(false);
  const [userGroupLoading, setUserGroupLoading] = useState(false);
  const [practitionerLoading, setPractitionerLoading] = useState(false);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [assignedUserGroups, setAssignedUserGroups] = useState<UserGroup[]>([]);
  const [initialValues, setInitialValues] = useState<FormFields>(defaultUserFormInitialValues);
  const [practitioner, setPractitioner] = useState<Practitioner | IPractitioner>();
  const [practitionerRoleLoading, setPractitionerRoleLoading] = useState(false);
  const [practitionerRole, setPractitionerRole] = useState<IPractitionerRole>();
  const { t } = useTranslation();

  const {
    keycloakUser,
    keycloakBaseURL,
    baseUrl,
    extraData,
    fetchKeycloakUsersCreator,
    userFormHiddenFields,
    userFormRenderFields,
    getPractitionerFun,
    postPutPractitionerFactory,
    getPractitionerRoleFun,
  } = props;

  const userId = props.match.params[ROUTE_PARAM_USER_ID];

  useEffect(() => {
    if (!userGroups.length) {
      setUserGroupsLoading(true);
      const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
      serve
        .list()
        .then((response: UserGroup[]) => setUserGroups(response))
        .catch((_: Error) => {
          sendErrorNotification(t('An error occurred'));
        })
        .finally(() => setUserGroupsLoading(false));
    }
  }, [keycloakBaseURL, baseUrl, userGroups.length, t]);

  /**
   * Fetch user if userId changes (editing a different user)
   */
  useEffect(() => {
    if (userId) {
      setKeyCloakUserLoading(true);
      const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
      serve
        .read(userId)
        .then((response: KeycloakUser | null | undefined) => {
          if (response) fetchKeycloakUsersCreator([response]);
        })
        .catch((_: Error) => {
          sendErrorNotification(t('An error occurred'));
        })
        .finally(() => setKeyCloakUserLoading(false));
    }
  }, [userId, keycloakBaseURL, fetchKeycloakUsersCreator, t]);

  /**
   * Fetch User group of the user being edited
   */
  useEffect(() => {
    if (userId) {
      setUserGroupLoading(true);
      const serve = new KeycloakService(
        KEYCLOAK_URL_USERS + '/' + userId + KEYCLOAK_URL_USER_GROUPS,
        keycloakBaseURL
      );
      serve
        .list()
        .then((response: UserGroup[]) => {
          setAssignedUserGroups(response);
        })
        .catch((_: Error) => {
          sendErrorNotification(t('An error occurred'));
        })
        .finally(() => setUserGroupLoading(false));
    }
  }, [userId, keycloakBaseURL, t]);

  /**
   * Fetch practitioner data of the user being edited
   */
  useEffect(() => {
    if (userId) {
      setPractitionerLoading(true);
      getPractitionerFun(baseUrl, userId)
        .then((response) => {
          const res = response as Practitioner | undefined;
          setPractitioner(res);
        })
        .catch((_: Error) => {
          sendErrorNotification(t('An error occurred'));
        })
        .finally(() => setPractitionerLoading(false));
    }
  }, [userId, baseUrl, getPractitionerFun, t]);

  /**
   * Fetch practitioner role assigned to user being edited
   */
  useEffect(() => {
    if (userId && getPractitionerRoleFun) {
      setPractitionerRoleLoading(true);
      getPractitionerRoleFun(baseUrl, userId)
        .then((resp) => setPractitionerRole(resp))
        .catch(() => sendErrorNotification(t('Failed to load practitioner role')))
        .finally(() => setPractitionerRoleLoading(false));
    }
  }, [baseUrl, getPractitionerRoleFun, t, userId]);

  useEffect(() => {
    setInitialValues(
      getFormValues(keycloakUser ?? undefined, practitioner, assignedUserGroups, practitionerRole)
    );
  }, [keycloakUser, practitioner, assignedUserGroups, practitionerRole]);

  if (
    userGroupsLoading ||
    keyCloakUserLoading ||
    userGroupLoading ||
    practitionerLoading ||
    practitionerRoleLoading
  )
    return <Spin size="large" className="custom-spinner" />;

  return (
    <Row>
      <Col span={24}>
        <UserForm
          initialValues={initialValues}
          keycloakBaseURL={keycloakBaseURL}
          baseUrl={baseUrl}
          userGroups={userGroups}
          extraData={extraData}
          hiddenFields={userFormHiddenFields}
          renderFields={userFormRenderFields}
          practitionerUpdaterFactory={postPutPractitionerFactory}
          isFHIRInstance={!!getPractitionerRoleFun}
        />
      </Col>
    </Row>
  );
};

CreateEditUser.defaultProps = defaultProps;

export { CreateEditUser };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUser: KeycloakUser | null;
  extraData: Dictionary;
}

// connect to store
const mapStateToProps = (state: Partial<Store>, ownProps: CreateEditPropTypes): DispatchedProps => {
  const userId = ownProps.match.params[ROUTE_PARAM_USER_ID];
  let keycloakUser = null;

  if (userId) {
    const keycloakUsersSelector = makeKeycloakUsersSelector();
    const keycloakUsers = keycloakUsersSelector(state, { id: [userId] });
    keycloakUser = keycloakUsers.length === 1 ? keycloakUsers[0] : null;
  }

  const extraData = getExtraData(state);
  return { keycloakUser, extraData };
};

/** map props to actions that may be dispatched by component */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

export const ConnectedCreateEditUser = connect(mapStateToProps, mapDispatchToProps)(CreateEditUser);
