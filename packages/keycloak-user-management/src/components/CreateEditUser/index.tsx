import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { OpenSRPService } from '@opensrp/react-utils';
import { UserForm, UserFormProps, defaultInitialValues, Practitioner } from '../forms/UserForm';
import {
  ROUTE_PARAM_USER_ID,
  KEYCLOAK_URL_USERS,
  OPENSRP_CREATE_PRACTITIONER_ENDPOINT,
} from '../../constants';
import { ERROR_OCCURED } from '../../lang';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  makeKeycloakUsersSelector,
  KeycloakUser,
} from '../../ducks/user';
import { Spin } from 'antd';
import '../../index.css';
import { Dictionary } from '@onaio/utils';
import { getExtraData } from '@onaio/session-reducer';
import { loadLocationTags, LocationUnitTag } from '@opensrp/location-management';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */
export interface RouteParams {
  userId: string;
}

/** props for editing a user view */
export interface EditUserProps {
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
  opensrpServiceClass: typeof OpenSRPService;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  extraData: Dictionary;
}

/** type intersection for all types that pertain to the props */
export type CreateEditPropTypes = EditUserProps & RouteComponentProps<RouteParams>;

/** default props for editing user component */
export const defaultEditUserProps: EditUserProps = {
  keycloakUser: null,
  serviceClass: KeycloakService,
  opensrpServiceClass: OpenSRPService,
  keycloakBaseURL: '',
  opensrpBaseURL: '',
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  extraData: {},
};

/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditUser: React.FC<CreateEditPropTypes> = (props: CreateEditPropTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [practitioner, setPractitioner] = React.useState<Practitioner | undefined>(undefined);
  const [locationTags, setLocationTags] = useState<LocationUnitTag[]>([]);
  const {
    keycloakUser,
    keycloakBaseURL,
    opensrpBaseURL,
    serviceClass,
    opensrpServiceClass,
    fetchKeycloakUsersCreator,
    extraData,
  } = props;
  const userId = props.match.params[ROUTE_PARAM_USER_ID];
  const initialValues = keycloakUser ? keycloakUser : defaultInitialValues;

  /**
   * Fetch user incase the user is not available e.g when page is refreshed
   */
  useEffect(() => {
    if (userId && !keycloakUser) {
      const serve = new serviceClass(KEYCLOAK_URL_USERS, keycloakBaseURL);
      setIsLoading(true);
      serve
        .read(userId)
        .then((response: KeycloakUser | null | undefined) => {
          if (response) {
            setIsLoading(false);
            fetchKeycloakUsersCreator([response]);
          }
        })
        .catch((_: Error) => {
          sendErrorNotification(ERROR_OCCURED);
        })
        .finally(() => setIsLoading(false));
    }
  }, [fetchKeycloakUsersCreator, serviceClass, userId, keycloakBaseURL, keycloakUser]);

  useEffect(() => {
    if (userId && practitioner === undefined) {
      setIsLoading(true);
      const serve = new opensrpServiceClass(OPENSRP_CREATE_PRACTITIONER_ENDPOINT, opensrpBaseURL);
      serve
        .read(userId)
        .then((response: Practitioner) => {
          setIsLoading(false);
          setPractitioner(response);
        })
        .catch((_: Error) => {
          sendErrorNotification(ERROR_OCCURED);
        })
        .finally(() => setIsLoading(false));
    }
  }, [userId, practitioner, opensrpServiceClass, opensrpBaseURL]);

  useEffect(() => {
    if (!locationTags.length) {
      setIsLoading(true);
      loadLocationTags(opensrpBaseURL, opensrpServiceClass)
        .then((response) => {
          setIsLoading(false);
          setLocationTags(response);
        })
        .catch((_: Error) => {
          sendErrorNotification(ERROR_OCCURED);
        })
        .finally(() => setIsLoading(false));
    }
  }, [userId, practitioner, opensrpServiceClass, opensrpBaseURL, locationTags.length]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  const userFormProps: UserFormProps = {
    initialValues: initialValues as KeycloakUser,
    opensrpServiceClass,
    serviceClass,
    keycloakBaseURL,
    opensrpBaseURL,
    practitioner: practitioner as Practitioner,
    locationTags,
    extraData,
  };

  return (
    <Row>
      <Col span={24}>
        <UserForm {...userFormProps} />
      </Col>
    </Row>
  );
};

CreateEditUser.defaultProps = defaultEditUserProps;

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
