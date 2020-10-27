import React from 'react';
import { Col, Row, notification } from 'antd';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { HeaderBreadCrumb } from '../HeaderBreadCrumb';
import {
  KeycloakUser,
  makeKeycloakUsersSelector,
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  getAccessToken,
  fetchKeycloakUsers,
} from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import { UserForm, UserFormProps } from '../forms/UserForm';
import { ROUTE_PARAM_USER_ID, KEYCLOAK_URL_USERS, ERROR_OCCURED } from '../../constants';
import Ripple from '../Loading';
import '../../index.css';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */

export interface RouteParams {
  userId: string;
}

/** props for editing a user view */
export interface EditUserProps {
  accessToken: string;
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
}

/** type intersection for all types that pertain to the props */
export type PropsTypes = EditUserProps & RouteComponentProps<RouteParams>;

/** default form initial values */

export const defaultInitialValues: KeycloakUser = {
  access: {
    manageGroupMembership: false,
    view: false,
    mapRoles: false,
    impersonate: false,
    manage: false,
  },
  createdTimestamp: undefined,
  disableableCredentialTypes: [],
  email: '',
  emailVerified: false,
  enabled: true,
  firstName: '',
  id: '',
  lastName: '',
  notBefore: 0,
  requiredActions: [],
  totp: false,
  username: '',
};

/** default props for editing user component */
export const defaultEditUserProps: EditUserProps = {
  accessToken: '',
  keycloakUser: null,
  serviceClass: KeycloakService,
  keycloakBaseURL: '',
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  lastName: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
});

/**
 *
 * @param props - CreateEditUser component props
 */

const CreateEditUser: React.FC<PropsTypes> = (props: PropsTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {
    keycloakUser,
    accessToken,
    keycloakBaseURL,
    serviceClass,
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
        .then((response: KeycloakUser) => {
          if (response) {
            setIsLoading(false);
            fetchKeycloakUsersCreator([response]);
          }
        })
        .catch((_: Error) => {
          setIsLoading(false);
          notification.error({
            message: ERROR_OCCURED,
            description: '',
          });
        });
    }
  }, [accessToken, fetchKeycloakUsersCreator, serviceClass, userId, keycloakBaseURL, keycloakUser]);

  if (isLoading) {
    return <Ripple />;
  }

  const userFormProps: UserFormProps = {
    accessToken,
    initialValues: initialValues as KeycloakUser,
    serviceClass,
    keycloakBaseURL,
  };

  return (
    <Row>
      <Col xs={24} sm={20} md={18} lg={15} xl={12}>
        <HeaderBreadCrumb userId={userId} />
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
const mapStateToProps = (state: Partial<Store>, ownProps: PropsTypes): DispatchedProps => {
  const userId = ownProps.match.params[ROUTE_PARAM_USER_ID];
  let keycloakUser = null;

  if (userId) {
    const keycloakUsersSelector = makeKeycloakUsersSelector();
    const keycloakUsers = keycloakUsersSelector(state, { id: [userId] });
    keycloakUser = keycloakUsers.length === 1 ? keycloakUsers[0] : null;
  }

  const accessToken = getAccessToken(state) as string;

  return { keycloakUser, accessToken };
};

export const ConnectedCreateEditUser = connect(mapStateToProps)(CreateEditUser);
