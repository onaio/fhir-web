import React from 'react';
import { Button, Form, Col, Row, Input, Switch, notification } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { makeAPIStateSelector } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import '../../index.css';
import {
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_RESET_PASSWORD,
  ROUTE_PARAM_USER_ID,
  URL_ADMIN,
} from '../../constants';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  makeKeycloakUsersSelector,
  KeycloakUser,
} from '../../ducks/user';
import { Dictionary } from '@onaio/utils';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

// Define selector instance
const getAccessToken = makeAPIStateSelector();

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
 * @param {Dictionary} values - submitted values
 * @param {string} userId - user id
 * @param {string} serviceClass - KeycloakService
 * @param {string} accessToken - Keycloak API access token
 * @param {string} keycloakBaseURL - Keycloak API base URL
 */
export const submitForm = (
  values: UserCredentialsFormFields,
  userId: string,
  serviceClass: typeof KeycloakService,
  accessToken: string,
  keycloakBaseURL: string
): void => {
  const serve = new serviceClass(
    accessToken,
    `${KEYCLOAK_URL_USERS}/${userId}${KEYCLOAK_URL_RESET_PASSWORD}`,
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
      useHistory().push(URL_ADMIN);
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
  const { serviceClass, match, accessToken, keycloakBaseURL } = props;
  const userId = match.params[ROUTE_PARAM_USER_ID];
  const layout = {
    labelCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 2, span: 10 },
      md: { offset: 0, span: 12 },
      lg: { offset: 0, span: 8 },
    },
    wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 12 }, lg: { span: 10 } },
  };
  const tailLayout = {
    wrapperCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 12, span: 24 },
      md: { offset: 10, span: 16 },
      lg: { offset: 8, span: 14 },
    },
  };
  // todo: replace any with appropriate type
  const history = useHistory();
  return (
    <Row>
      <h5 className="mb-3">Credentials</h5>
      <Col className="bg-white p-3" span={24}>
        <div className="form-container">
          <Form
            {...layout}
            onFinish={(values: UserCredentialsFormFields) =>
              submitForm(values, userId, serviceClass, accessToken, keycloakBaseURL)
            }
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
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" className="reset-password">
                Reset Password
              </Button>
              <Button onClick={() => history.push(URL_ADMIN)} className="cancel-user">
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
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
  const userId = ownProps.match.params[ROUTE_PARAM_USER_ID];
  const keycloakUsersSelector = makeKeycloakUsersSelector();
  const keycloakUsers = keycloakUsersSelector(state, { id: [userId] });
  const keycloakUser = keycloakUsers.length >= 1 ? keycloakUsers[0] : null;
  const accessToken = getAccessToken(state, { accessToken: true });
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
