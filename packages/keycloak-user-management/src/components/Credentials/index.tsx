import React from 'react';
import { Button, Form, Col, Card, Row, Input, Switch, notification } from 'antd';
import { RouteComponentProps } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { history } from '@onaio/connected-reducer-registry';
import { HeaderBreadCrumb } from '../HeaderBreadCrumb';
import {
  fetchKeycloakUsers,
  getAccessToken,
  KeycloakUser,
  makeKeycloakUsersSelector,
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
} from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import '../../index.css';
import { URL_USERS, URL_RESET_PASSWORD } from '../../constants';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */

export interface CredentialsRouteParams {
  userId: string;
}

/** props for editing a user view */
export interface CredentialsProps {
  accessToken: string;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
}

/** interface for data fields for team's form */
export interface UserCredentialsFormFields {
  password: string;
  confirm: string;
  temporary: boolean;
}

/** type intersection for all types that pertain to the props */
export type CredentialsPropsTypes = CredentialsProps & RouteComponentProps<CredentialsRouteParams>;

/** default props for editing user component */
export const defaultCredentialsProps: Partial<CredentialsPropsTypes> = {
  accessToken: '',
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  keycloakUser: null,
  serviceClass: KeycloakService,
};

/**
 * Handle form submission
 *
 * @param {UserCredentialsFormFields} values the form fields
 * @param {CredentialsPropsTypes} props the headers
 */
export const submitForm = (
  values: UserCredentialsFormFields,
  props: CredentialsPropsTypes
): void => {
  const { serviceClass, match, accessToken, keycloakBaseURL } = props;
  const userId = match.params.userId;
  const serve = new serviceClass(
    accessToken,
    `${URL_USERS}/${userId}${URL_RESET_PASSWORD}`,
    keycloakBaseURL
  );
  const { password, temporary } = values;
  serve
    .update({
      temporary: temporary,
      type: 'password',
      value: password,
    })
    .then(() => {
      history.push('/admin');
      notification.success({
        message: 'Credentials updated successfully',
        description: '',
      });
    })
    .catch((_: Error) => {
      notification.error({
        message: 'An error occurred',
        description: '',
      });
    });
};

const UserCredentials: React.FC<CredentialsPropsTypes> = (props: CredentialsPropsTypes) => {
  const userId = props.match.params.userId;
  const isEditMode = !!userId;
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  return (
    <Col span={12}>
      <Card title={`${isEditMode ? 'Edit User' : 'Create New User'}`} bordered={false}>
        <HeaderBreadCrumb userId={userId} />
        <div className="form-container">
          <Form
            {...layout}
            onFinish={(values: UserCredentialsFormFields) => submitForm(values, props)}
          >
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
            <Form.Item name="temporary" label="Temporary" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item>
              <Row justify="start">
                <Col span={4}>
                  <Button htmlType="submit" className="reset-password">
                    Reset Password
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </Col>
  );
};

UserCredentials.defaultProps = defaultCredentialsProps;

export { UserCredentials };

/** Interface for connected state to props */
interface DispatchedProps {
  keycloakUser: KeycloakUser | null;
  accessToken: string;
}

// connect to store
const mapStateToProps = (
  state: Partial<Store>,
  ownProps: CredentialsPropsTypes
): DispatchedProps => {
  const userId = ownProps.match.params.userId;
  const keycloakUsersSelector = makeKeycloakUsersSelector();
  const keycloakUsers = keycloakUsersSelector(state, { id: [userId] });
  const keycloakUser = keycloakUsers.length >= 1 ? keycloakUsers[0] : null;
  const accessToken = getAccessToken(state) as string;
  return { keycloakUser, accessToken };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

export const ConnectedUserCredentials = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCredentials);
