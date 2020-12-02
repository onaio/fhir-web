import React from 'react';
import { Col, Row } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { makeAPIStateSelector } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import { sendErrorNotification } from '@opensrp/notifications';
import { UserForm, UserFormProps, defaultInitialValues, Practitioner } from '../forms/UserForm';
import {
  ROUTE_PARAM_USER_ID,
  KEYCLOAK_URL_USERS,
  ERROR_OCCURED,
  OPENSRP_CREATE_PRACTITIONER_ENDPOINT,
} from '../../constants';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  makeKeycloakUsersSelector,
  KeycloakUser,
} from '../../ducks/user';
import Ripple from '../Loading';
import '../../index.css';
import { OpenSRPService } from '@opensrp/server-service';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

// Define selector instance
const getAccessToken = makeAPIStateSelector();

/** inteface for route params */

export interface RouteParams {
  userId: string;
}

/** props for editing a user view */
export interface EditUserProps {
  accessToken: string;
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
  opensrpServiceClass: typeof OpenSRPService;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
}

/** type intersection for all types that pertain to the props */
export type CreateEditPropTypes = EditUserProps & RouteComponentProps<RouteParams>;

/** default props for editing user component */
export const defaultEditUserProps: EditUserProps = {
  accessToken: '',
  keycloakUser: null,
  serviceClass: KeycloakService,
  opensrpServiceClass: OpenSRPService,
  keycloakBaseURL: '',
  opensrpBaseURL: '',
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditUser: React.FC<CreateEditPropTypes> = (props: CreateEditPropTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [practitioner, setPractitioner] = React.useState<Practitioner | undefined>(undefined);
  const {
    keycloakUser,
    accessToken,
    keycloakBaseURL,
    opensrpBaseURL,
    serviceClass,
    opensrpServiceClass,
    fetchKeycloakUsersCreator,
  } = props;
  const userId = props.match.params[ROUTE_PARAM_USER_ID];
  const initialValues = keycloakUser ? keycloakUser : defaultInitialValues;

  /**
   * Fetch user incase the user is not available e.g when page is refreshed
   */
  React.useEffect(() => {
    if (userId && !keycloakUser) {
      const serve = new serviceClass(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);
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
          setIsLoading(false);
          sendErrorNotification(ERROR_OCCURED);
        });
    }
  }, [accessToken, fetchKeycloakUsersCreator, serviceClass, userId, keycloakBaseURL, keycloakUser]);

  React.useEffect(() => {
    if (userId && practitioner === undefined) {
      setIsLoading(true);
      const serve = new opensrpServiceClass(
        accessToken,
        opensrpBaseURL,
        OPENSRP_CREATE_PRACTITIONER_ENDPOINT
      );
      serve
        .read(userId)
        .then((response: Practitioner) => {
          setIsLoading(false);
          setPractitioner(response);
        })
        .catch((_: Error) => {
          setIsLoading(false);
          sendErrorNotification(ERROR_OCCURED);
        });
    }
  }, [userId, practitioner, accessToken, opensrpServiceClass, opensrpBaseURL]);

  if (isLoading) {
    return <Ripple />;
  }

  const userFormProps: UserFormProps = {
    accessToken,
    initialValues: initialValues as KeycloakUser,
    opensrpServiceClass,
    serviceClass,
    keycloakBaseURL,
    opensrpBaseURL,
    practitioner: practitioner as Practitioner,
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
  accessToken: string;
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

  const accessToken = getAccessToken(state, { accessToken: true });
  return { keycloakUser, accessToken };
};

export const ConnectedCreateEditUser = connect(mapStateToProps)(CreateEditUser);
