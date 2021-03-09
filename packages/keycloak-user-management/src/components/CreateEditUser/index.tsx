import React, { useEffect, useState } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { Col, Row, Spin } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/react-utils';
import { UserForm, FormFields } from '../forms/UserForm';
import {
  ROUTE_PARAM_USER_ID,
  KEYCLOAK_URL_USERS,
  OPENSRP_CREATE_PRACTITIONER_ENDPOINT,
  KEYCLOAK_URL_USER_GROUPS,
} from '../../constants';
import { ERROR_OCCURED } from '../../lang';
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
}

/** type intersection for all types that pertain to the props */
export type CreateEditPropTypes = EditUserProps & RouteComponentProps<RouteParams>;

/**
 *
 * @param props - CreateEditUser component props
 */
const CreateEditUser: React.FC<CreateEditPropTypes> = (props: CreateEditPropTypes) => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [initialValues, setInitialValues] = useState<FormFields>({
    firstName: '',
    id: '',
    lastName: '',
    username: '',
    active: false,
    userGroup: undefined,
    practitioner: undefined,
  });

  const { keycloakUser, keycloakBaseURL, opensrpBaseURL, extraData } = props;
  const userId = props.match.params[ROUTE_PARAM_USER_ID];

  useEffect(() => {
    if (keycloakUser && !initialValues.username) {
      setInitialValues({ ...initialValues, ...keycloakUser });
    }
  }, [keycloakUser, initialValues]);

  useEffect(() => {
    if (!userGroups.length) {
      const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
      serve
        .list()
        .then((response: UserGroup[]) => setUserGroups(response))
        .catch((_: Error) => sendErrorNotification(ERROR_OCCURED));
    }
  }, [keycloakBaseURL, opensrpBaseURL, userGroups.length]);

  /**
   * Fetch user incase the user is not available e.g when page is refreshed
   */
  useEffect(() => {
    if (userId && !keycloakUser) {
      const serve = new KeycloakService(KEYCLOAK_URL_USERS, keycloakBaseURL);
      serve
        .read(userId)
        .then((response: KeycloakUser | null | undefined) => {
          if (response) fetchKeycloakUsers([response]);
        })
        .catch((_: Error) => sendErrorNotification(ERROR_OCCURED));
    }
  }, [userId, keycloakBaseURL, keycloakUser]);

  /**
   * Fetch User group of the user
   */
  useEffect(() => {
    if (userId && initialValues.userGroup === undefined) {
      const serve = new KeycloakService(
        KEYCLOAK_URL_USERS + '/' + userId + KEYCLOAK_URL_USER_GROUPS,
        keycloakBaseURL
      );
      serve
        .list()
        .then((response: UserGroup[]) =>
          setInitialValues({ ...initialValues, userGroup: response.map((tag) => tag.id) })
        )
        .catch((_: Error) => sendErrorNotification(ERROR_OCCURED));
    }
  }, [userId, keycloakBaseURL, initialValues]);

  useEffect(() => {
    if (userId && initialValues.practitioner === undefined) {
      const serve = new OpenSRPService(OPENSRP_CREATE_PRACTITIONER_ENDPOINT, opensrpBaseURL);
      serve
        .read(userId)
        .then((response: Practitioner) =>
          setInitialValues({ ...initialValues, active: response.active, practitioner: response })
        )
        .catch((_: Error) => sendErrorNotification(ERROR_OCCURED));
    }
  }, [userId, opensrpBaseURL, initialValues]);

  if (!userGroups.length || (keycloakUser && !initialValues.username) || (userId && !keycloakUser))
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
