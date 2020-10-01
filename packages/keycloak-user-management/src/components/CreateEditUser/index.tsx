import React from 'react';
import { Col, notification, Row } from 'antd';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
// import { HeaderBreadCrumb } from '../../../../../client/src/components/page/HeaderBreadCrumb';
import keycloakUsersReducer, {
  fetchKeycloakUsers,
  KeycloakUser,
  makeKeycloakUsersSelector,
  reducerName as keycloakUsersReducerName,
} from '../../ducks/';
import { KeycloakService } from '../../services';
// import Ripple from '../../../../../client/src/components/page/Loading';
import { UserForm, UserFormProps } from '../../forms';
import './CreateEditUser.css';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */

export interface RouteParams {
  userId: string;
}

/** props for editing a user view */
export interface Props {
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
}

/** type intersection for all types that pertain to the props */
export type PropsTypes = Props & RouteComponentProps<RouteParams>;

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
export const defaultProps: Partial<PropsTypes> = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  keycloakUser: null,
  serviceClass: KeycloakService,
};

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  lastName: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
});

const CreateEditUsers: React.FC<PropsTypes> = (props: PropsTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { serviceClass, fetchKeycloakUsersCreator, keycloakUser } = props;
  const userId = props.match.params.userId;
  const isEditMode = !!userId;
  const initialValues = isEditMode ? keycloakUser : defaultInitialValues;
  React.useEffect(() => {
    if (userId) {
      const serve = new serviceClass('/users');
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
  }, [userId]);

  const userFormProps: UserFormProps = {
    initialValues: initialValues as KeycloakUser,
    serviceClass: KeycloakService,
  };

  // if (isLoading) {
  //   return <Ripple />;
  // }

  return (
    <Row>
      <Col xs={24} sm={20} md={18} lg={15} xl={12}>
        {/* <HeaderBreadCrumb userId={userId} /> */}
        <UserForm {...userFormProps} />
      </Col>
    </Row>
  );
};

CreateEditUsers.defaultProps = defaultProps;

export { CreateEditUsers };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUser: KeycloakUser | null;
}

// connect to store
const mapStateToProps = (state: Partial<Store>, ownProps: PropsTypes): DispatchedProps => {
  const userId = ownProps.match.params.userId;
  const keycloakUsersSelector = makeKeycloakUsersSelector();
  const keycloakUsers = keycloakUsersSelector(state, { id: [userId] });
  const keycloakUser = keycloakUsers.length === 1 ? keycloakUsers[0] : null;
  return { keycloakUser };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

const ConnectedCreateEditUsers = connect(mapStateToProps, mapDispatchToProps)(CreateEditUsers);

export default ConnectedCreateEditUsers;
