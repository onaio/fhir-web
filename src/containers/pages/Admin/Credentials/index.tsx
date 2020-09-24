import { Formik } from 'formik';
// import moment from 'moment';
import React from 'react';
import { Button, Form, Col, Card, Row, Input, Switch } from 'antd';
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
import '../CreateEditUser/CreateEditUser.css';

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

const UserCredentials: React.FC<PropsTypes> = (props: PropsTypes) => {
  const userId = props.match.params.userId;
  const isEditMode = !!userId;

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
            initialValues={{}}
            // tslint:disable-next-line: jsx-no-lambda
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
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
