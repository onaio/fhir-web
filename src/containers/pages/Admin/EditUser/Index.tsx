import { ErrorMessage, Field, Formik } from 'formik';
// import moment from 'moment';
import React from 'react';
// import { Redirect } from 'react-router';
import { Button, Form, Col, notification } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { HeaderBreadCrumb } from '../../../../components/page/HeaderBreadCrumb';
import keycloakUsersReducer, {
  fetchKeycloakUsers,
  KeycloakUser,
  makeKeycloakUsersSelector,
  reducerName as keycloakUsersReducerName,
} from '../../../../store/ducks/keycloak';
import { KeycloakService } from '../../../../services';
import './EditUser.css';
import Ripple from '../../../../components/page/Loading';

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

/** default props for editing user component */
export const defaultProps: Partial<PropsTypes> = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  keycloakUser: null,
  serviceClass: KeycloakService,
};

const EditUsers: React.FC<PropsTypes> = (props: PropsTypes) => {
  const { serviceClass, fetchKeycloakUsersCreator, keycloakUser } = props;
  const userId = props.match.params.userId;
  React.useEffect(() => {
    const serve = new serviceClass('/users');
    serve
      .read(userId)
      .then((response: KeycloakUser) => {
        if (response) {
          fetchKeycloakUsersCreator([response]);
        }
      })
      .catch((err: Error) => {
        notification.error({
          message: `${err}`,
          description: '',
        });
      });
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  if (!keycloakUser) {
    return <Ripple />;
  }

  console.log('edit user props??', props);

  return (
    <Col span={12}>
      <HeaderBreadCrumb />
      <div className="form-container">
        <Formik
          initialValues={keycloakUser as KeycloakUser}
          // tslint:disable-next-line: jsx-no-lambda
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            console.log(values);
          }}
        >
          {({ errors, isSubmitting }) => (
            <Form {...layout}>
              <Form.Item label={'User Id'}>
                <Field
                  readOnly={true}
                  type="text"
                  name="id"
                  id="id"
                  // disabled={disabledFields.includes('name')}
                  className={errors.id ? `form-control is-invalid` : `form-control`}
                />
                <ErrorMessage
                  name="id"
                  component="small"
                  className="form-text text-danger name-error"
                />
              </Form.Item>
              <Form.Item label={'First Name'}>
                <Field
                  type="text"
                  name="firstName"
                  id="firstName"
                  // disabled={disabledFields.includes('name')}
                  className={errors.firstName ? `form-control is-invalid` : `form-control`}
                />
                <ErrorMessage
                  name="firstName"
                  component="small"
                  className="form-text text-danger name-error"
                />
              </Form.Item>
              <Form.Item label={'Last Name'}>
                <Field
                  type="text"
                  name="lastName"
                  id="lastName"
                  // disabled={disabledFields.includes('name')}
                  className={errors.lastName ? `form-control is-invalid` : `form-control`}
                />
                <ErrorMessage
                  name="lastName"
                  component="small"
                  className="form-text text-danger name-error"
                />
              </Form.Item>

              <Form.Item label={'Username'}>
                <Field
                  type="text"
                  name="username"
                  id="username"
                  //   disabled={disabledFields.includes('username')}
                  className={errors.username ? `form-control is-invalid` : `form-control`}
                />
                <ErrorMessage
                  component="small"
                  name="username"
                  className="form-text text-danger username-error"
                />
              </Form.Item>
              <Form.Item label={'Email'}>
                <Field
                  type="text"
                  name="email"
                  id="email"
                  className={errors.email ? `form-control is-invalid` : `form-control`}
                />
                <ErrorMessage
                  component="small"
                  name="email"
                  className="form-text text-danger username-error"
                />
              </Form.Item>
              <hr className="mb-2" />
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? 'Saving' : 'Save User'}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    </Col>
  );
};

EditUsers.defaultProps = defaultProps;

export { EditUsers };

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

const ConnectedEdiUsersView = connect(mapStateToProps, mapDispatchToProps)(EditUsers);

export default ConnectedEdiUsersView;
