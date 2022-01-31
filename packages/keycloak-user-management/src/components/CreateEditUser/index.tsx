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
import lang from '../../lang';
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
import { getFormValues } from '../forms/UserForm/utils';
import { BrokenPage } from '@opensrp/react-utils';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */
export interface RouteParams {
  userId: string;
}

/** props for editing a user view */
export interface EditUserProps {
  keycloakUser: KeycloakUser | null;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  extraData: Dictionary;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  userFormHiddenFields?: UserFormProps['hiddenFields'];
  userFormRenderFields?: UserFormProps['renderFields'];
}

/** type intersection for all types that pertain to the props */
export type CreateEditPropTypes = EditUserProps & RouteComponentProps<RouteParams>;

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
  const [practitioner, setPractitioner] = useState<Practitioner>();
  const [apiError, setApiError] = useState(false);

  const {
    keycloakUser,
    keycloakBaseURL,
    opensrpBaseURL,
    extraData,
    fetchKeycloakUsersCreator,
    userFormHiddenFields,
    userFormRenderFields,
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
          setApiError(true);
          sendErrorNotification(lang.ERROR_OCCURED);
        })
        .finally(() => setUserGroupsLoading(false));
    }
  }, [keycloakBaseURL, opensrpBaseURL, userGroups.length]);

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
          sendErrorNotification(lang.ERROR_OCCURED);
          setApiError(true);
        })
        .finally(() => setKeyCloakUserLoading(false));
    }
  }, [userId, keycloakBaseURL, fetchKeycloakUsersCreator]);

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
          sendErrorNotification(lang.ERROR_OCCURED);
          setApiError(true);
        })
        .finally(() => setUserGroupLoading(false));
    }
  }, [userId, keycloakBaseURL]);

  /**
   * Fetch practitioner data of the user being edited
   */
  useEffect(() => {
    if (userId) {
      setPractitionerLoading(true);
      const serve = new OpenSRPService(OPENSRP_CREATE_PRACTITIONER_ENDPOINT, opensrpBaseURL);
      serve
        .read(userId)
        .then((response: Practitioner | undefined) => {
          setPractitioner(response);
        })
        .catch((_: Error) => {
          sendErrorNotification(lang.ERROR_OCCURED);
          setApiError(true);
        })
        .finally(() => setPractitionerLoading(false));
    }
  }, [userId, opensrpBaseURL]);

  useEffect(() => {
    setInitialValues(getFormValues(keycloakUser ?? undefined, practitioner, assignedUserGroups));
  }, [keycloakUser, practitioner, assignedUserGroups]);

  if (apiError) return <BrokenPage />;

  if (
    userGroupsLoading ||
    keyCloakUserLoading ||
    userGroupLoading ||
    practitionerLoading ||
    !(userGroups.length > 0)
  )
    return <Spin size="large" />;

  return (
    <Row>
      <Col span={24}>
        <UserForm
          initialValues={initialValues}
          keycloakBaseURL={keycloakBaseURL}
          opensrpBaseURL={opensrpBaseURL}
          userGroups={userGroups}
          extraData={extraData}
          hiddenFields={userFormHiddenFields}
          renderFields={userFormRenderFields}
        />
      </Col>
    </Row>
  );
};

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
