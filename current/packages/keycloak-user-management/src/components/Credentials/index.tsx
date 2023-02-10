import React from 'react';
import { Button, Form, Col, Row, Input, PageHeader } from 'antd';
import { RouteComponentProps, useHistory } from 'react-router';
import { Store } from 'redux';
import { connect } from 'react-redux';
import reducerRegistry from '@onaio/redux-reducer-registry';
import { KeycloakService, HTTPError } from '@opensrp/keycloak-service';
import { history } from '@onaio/connected-reducer-registry';
import '../../index.css';
import {
  KEYCLOAK_URL_USERS,
  KEYCLOAK_URL_RESET_PASSWORD,
  ROUTE_PARAM_USER_ID,
  URL_USER,
} from '../../constants';
import { useTranslation } from '../../mls';
import {
  reducer as keycloakUsersReducer,
  reducerName as keycloakUsersReducerName,
  fetchKeycloakUsers,
  makeKeycloakUsersSelector,
  KeycloakUser,
} from '../../ducks/user';
import { Dictionary } from '@onaio/utils';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import type { TFunction } from '@opensrp/i18n';

reducerRegistry.register(keycloakUsersReducerName, keycloakUsersReducer);

/** inteface for route params */

export interface CredentialsRouteParams {
  userId: string;
}

/** props for editing a user view */
export interface CredentialsProps {
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
  cancelUserHandler: (genericHistory: Dictionary) => void;
}

/** interface for data fields for team's form */
export interface UserCredentialsFormFields {
  password: string;
  confirm: string;
  temporary: boolean;
}

/** type intersection for all types that pertain to the props */
export type CredentialsPropsTypes = CredentialsProps & RouteComponentProps<CredentialsRouteParams>;
/**
 * redirect to /admin view
 * find appropriate type for history from usehistory hook
 *
 * @param {Dictionary} genericHistory react-rouet usehistory hook
 */
export const cancelUserHandler = (genericHistory: Dictionary): void => {
  genericHistory.push(URL_USER);
};

/** default props for editing user component */
export const defaultCredentialsProps: Partial<CredentialsPropsTypes> = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
  keycloakUser: null,
  serviceClass: KeycloakService,
  cancelUserHandler: cancelUserHandler,
};
/**
 * Handle form submission
 *
 * @param values - submitted values
 * @param userId - user id
 * @param serviceClass - KeycloakService
 * @param keycloakBaseURL - Keycloak API base URL
 * @param t - the translations look up object
 */
export const submitForm = (
  values: UserCredentialsFormFields,
  userId: string,
  serviceClass: typeof KeycloakService,
  keycloakBaseURL: string,
  t: TFunction
): void => {
  const serve = new serviceClass(
    `${KEYCLOAK_URL_USERS}/${userId}${KEYCLOAK_URL_RESET_PASSWORD}`,
    keycloakBaseURL
  );
  const { password } = values;
  serve
    .update({
      temporary: false,
      type: 'password',
      value: password,
    })
    .then(() => {
      sendSuccessNotification(t('Credentials updated successfully'));
      history.push(URL_USER);
    })
    .catch((e: HTTPError) => {
      sendErrorNotification(e.description);
    });
};

const UserCredentials: React.FC<CredentialsPropsTypes> = (props: CredentialsPropsTypes) => {
  const { serviceClass, match, keycloakBaseURL, keycloakUser } = props;
  const userId = match.params[ROUTE_PARAM_USER_ID];
  const { t } = useTranslation();
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
  const history = useHistory();
  const heading = `${t('User Credentials')} | ${keycloakUser ? keycloakUser.username : ''}`;
  return (
    <Row className="content-section">
      <PageHeader className="page-header" title={heading} />
      <Col className="bg-white p-3" span={24}>
        <div className="form-container">
          <Form
            {...layout}
            onFinish={(values: UserCredentialsFormFields) =>
              submitForm(values, userId, serviceClass, keycloakBaseURL, t)
            }
          >
            <Form.Item
              name="password"
              label={t('Password')}
              rules={[
                {
                  required: true,
                  message: t('Password is required'),
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="confirm"
              label={t('Confirm Password')}
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t('Confirm Password is required'),
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(t('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" className="reset-password">
                {t('Set password')}
              </Button>
              <Button onClick={() => props.cancelUserHandler(history)} className="cancel-user">
                {t('Cancel')}
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
  return { keycloakUser };
};

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

export const ConnectedUserCredentials = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCredentials);
