import React, { useEffect, useState, useCallback } from 'react';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { FHIRServiceClass } from '@opensrp/react-utils';
import { Col, Row, Spin } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { UserForm, FormFields } from '../forms/UserForm';
import { ROUTE_PARAM_USER_ID, KEYCLOAK_URL_USERS, KEYCLOAK_URL_USER_GROUPS } from '../../constants';
import lang from '../../lang';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  makeKeycloakUsersSelector,
  KeycloakUser,
  UserGroup,
} from '../../ducks/user';
import { Dictionary } from '@onaio/utils';
import { getExtraData } from '@onaio/session-reducer';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
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
  fhirBaseURL: string;
  extraData: Dictionary;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
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
  const [initialValues, setInitialValues] = useState<FormFields>({
    firstName: '',
    id: '',
    lastName: '',
    username: '',
    active: false,
    userGroup: undefined,
    practitioner: undefined,
  });

  const {
    keycloakUser,
    keycloakBaseURL,
    fhirBaseURL,
    extraData,
    fetchKeycloakUsersCreator,
  } = props;

  const userId = props.match.params[ROUTE_PARAM_USER_ID];

  const fetchPractitioner = useCallback(async () => {
    const serve = new FHIRServiceClass<IPractitioner>(fhirBaseURL, 'Practitioner');
    serve
      .list({
        identifier: userId,
      })
      .then((response) => {
        if (response.total > 0) {
          // get first entry (ideal server has only one practitioner)
          const practitionerEntry = response.entry[0];
          const practitionerResource = practitionerEntry.resource;
          setInitialValues((prevState) => ({
            ...prevState,
            active: practitionerResource.active,
            practitioner: practitionerResource,
          }));
        }
      })
      .catch(() => sendErrorNotification(lang.ERROR_OCCURED));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (keycloakUser) {
      /** only update the object diff */
      setInitialValues((prevState) => ({ ...prevState, ...keycloakUser }));
    }
  }, [keycloakUser]);

  useEffect(() => {
    if (!userGroups.length) {
      setUserGroupsLoading(true);
      const serve = new KeycloakService(KEYCLOAK_URL_USER_GROUPS, keycloakBaseURL);
      serve
        .list()
        .then((response: UserGroup[]) => setUserGroups(response))
        .catch((_: Error) => sendErrorNotification(lang.ERROR_OCCURED))
        .finally(() => setUserGroupsLoading(false));
    }
  }, [keycloakBaseURL, userGroups.length]);

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
        .catch((_: Error) => sendErrorNotification(lang.ERROR_OCCURED))
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
        .then((response: UserGroup[]) =>
          setInitialValues((prevState) => ({
            ...prevState,
            userGroup: response.map((tag) => tag.id),
          }))
        )
        .catch((_: Error) => sendErrorNotification(lang.ERROR_OCCURED))
        .finally(() => setUserGroupLoading(false));
    }
  }, [userId, keycloakBaseURL]);

  /**
   * Fetch practitioner data of the user being edited
   */
  useEffect(() => {
    if (userId) {
      setPractitionerLoading(true);
      fetchPractitioner()
        .catch((_: Error) => sendErrorNotification(lang.ERROR_OCCURED))
        .finally(() => setPractitionerLoading(false));
    }
  }, [userId, fhirBaseURL, fetchPractitioner]);

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
          fhirBaseURL={fhirBaseURL}
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
