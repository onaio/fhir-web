import React from 'react';
import { Col, notification, Row } from 'antd';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { HeaderBreadCrumb } from '../HeaderBreadCrumb';
import {
  fetchKeycloakUsers,
  KeycloakUser,
  makeKeycloakUsersSelector,
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  getAccessToken,
} from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import Ripple from '../Loading';
import { UserForm, UserFormProps } from '../../forms';
import { KEYCLOAK_URL_USERS, ROUTE_PARAM_USER_ID } from '../../constants';
import '../../index.css';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */

export interface RouteParams {
  userId: string;
}

/** props for editing a user view */
export interface EditUserProps {
  accessToken: string;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
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
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  keycloakUser: null,
  serviceClass: KeycloakService,
  keycloakBaseURL: '',
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

const CreateEditUsers: React.FC<PropsTypes> = (props: PropsTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const {
    serviceClass,
    fetchKeycloakUsersCreator,
    keycloakUser,
    accessToken,
    keycloakBaseURL,
  } = props;
  const userId = props.match.params[ROUTE_PARAM_USER_ID];
  const isEditMode = !!userId;
  const initialValues = isEditMode ? keycloakUser : defaultInitialValues;
  React.useEffect(() => {
    if (userId) {
      const serve = new serviceClass(accessToken, KEYCLOAK_URL_USERS, keycloakBaseURL);
      serve
        .read(userId)
        .then((response: KeycloakUser) => {
          if (response) {
            fetchKeycloakUsersCreator([response]);
            setIsLoading(false);
          }
        })
        .catch((err: Error) => {
          notification.error({
            message: `${err}`,
            description: '',
          });
        });
    } else {
      setIsLoading(false);
    }
  }, [accessToken, fetchKeycloakUsersCreator, serviceClass, userId, keycloakBaseURL]);

  const userFormProps: UserFormProps = {
    accessToken,
    initialValues: initialValues as KeycloakUser,
    serviceClass: KeycloakService,
    keycloakBaseURL,
  };

  if (isLoading) {
    return <Ripple />;
  }

  return (
    <Row>
      <Col xs={24} sm={20} md={18} lg={15} xl={12}>
        <HeaderBreadCrumb userId={userId} />
        <UserForm {...userFormProps} />
      </Col>
    </Row>
  );
};

CreateEditUsers.defaultProps = defaultEditUserProps;

export { CreateEditUsers };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUser: KeycloakUser | null;
  accessToken: string;
}

// connect to store
const mapStateToProps = (state: Partial<Store>, ownProps: PropsTypes): DispatchedProps => {
  const userId = ownProps.match.params[ROUTE_PARAM_USER_ID];
  const keycloakUsersSelector = makeKeycloakUsersSelector();
  const keycloakUsers = keycloakUsersSelector(state, { id: [userId] });
  const keycloakUser = keycloakUsers.length === 1 ? keycloakUsers[0] : null;
  const accessToken = getAccessToken(state) as string;
  return { keycloakUser, accessToken };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

export const ConnectedCreateEditUsers = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEditUsers);
