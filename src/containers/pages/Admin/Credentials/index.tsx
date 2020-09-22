import { ErrorMessage, Field, Formik } from 'formik';
// import moment from 'moment';
import React from 'react';
// import { Redirect } from 'react-router';
import { Button, Form, Col, notification, Card, Row, Input, Switch } from 'antd';
import { RouteComponentProps } from 'react-router';
import { history } from '@onaio/connected-reducer-registry';
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

const UserCredentials: React.FC<PropsTypes> = (props: PropsTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const { serviceClass, fetchKeycloakUsersCreator, keycloakUser } = props;
  const userId = props.match.params.userId;
  const isEditMode = !!userId;
  const initialValues = isEditMode ? keycloakUser : defaultInitialValues;
  //   React.useEffect(() => {
  //     if (userId) {
  //       const serve = new serviceClass('/users');
  //       serve
  //         .read(userId)
  //         .then((response: KeycloakUser) => {
  //           if (response) {
  //             fetchKeycloakUsersCreator([response]);
  //             setIsLoading(false);
  //           }
  //         })
  //         .catch((err: Error) => {
  //           notification.error({
  //             message: `${err}`,
  //             description: '',
  //           });
  //         });
  //     } else {
  //       setIsLoading(false);
  //     }
  //   }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  //   if (isLoading) {
  //     return <Ripple />;
  //   }

  return (
    <Col span={12}>
      <Card title={`${isEditMode ? 'Edit User' : 'Create New User'}`} bordered={false}>
        <HeaderBreadCrumb userId={userId} />
        <div className="form-container">
          <Formik
            initialValues={initialValues as KeycloakUser}
            // tslint:disable-next-line: jsx-no-lambda
            onSubmit={(values, { setSubmitting }) => {
              if (isEditMode) {
                const serve = new serviceClass(`/users/${userId}`);
                serve
                  .update(values)
                  .then(() => {
                    setSubmitting(false);
                    notification.success({
                      message: 'User edited successfully',
                      description: '',
                    });
                  })
                  .catch((e: Error) => {
                    notification.error({
                      message: `${e}`,
                      description: '',
                    });
                    setSubmitting(false);
                  });
              } else {
                const serve = new serviceClass(`/users`);
                serve
                  .create(values)
                  .then(() => {
                    setSubmitting(false);
                    notification.success({
                      message: 'User created successfully',
                      description: '',
                    });
                  })
                  .catch((e: Error) => {
                    notification.error({
                      message: `${e}`,
                      description: '',
                    });
                    setSubmitting(false);
                  });
              }
            }}
          >
            {({ errors, isSubmitting, handleSubmit }) => (
              <Form {...layout} onSubmitCapture={handleSubmit}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your password!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('The two passwords that you entered do not match!');
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item name="switch" label="Temporary" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item>
                  <Row justify="start">
                    <Col span={4}>
                      <Button
                        htmlType="submit"
                        className="reset-password"
                        disabled={isSubmitting || Object.keys(errors).length > 0}
                      >
                        Reset Password
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            )}
          </Formik>
        </div>
      </Card>
    </Col>
  );
};

UserCredentials.defaultProps = defaultProps;

export { UserCredentials };

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

const ConnectedUserCredentials = connect(mapStateToProps, mapDispatchToProps)(UserCredentials);

export default ConnectedUserCredentials;
