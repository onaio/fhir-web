import React from 'react';
import { Button, Form, Col, Row, Input } from 'antd';
import { PageHeader, Resource404 } from '@opensrp/react-utils';
import { NavigateFunction, useNavigate, useParams } from 'react-router';
import { Store } from 'redux';
import { connect, useSelector } from 'react-redux';
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
  cancelUserHandler: (navigate: NavigateFunction) => void;
}

/** interface for data fields for team's form */
export interface UserCredentialsFormFields {
  password: string;
  confirm: string;
  temporary: boolean;
}

/** type intersection for all types that pertain to the props */
export type CredentialsPropsTypes = CredentialsProps;
/**
 * redirect to /admin view
 * find appropriate type for history from usehistory hook
 *
 * @param {Dictionary} genericHistory react-rouet usehistory hook
 */
export const cancelUserHandler = (navigate: NavigateFunction): void => {
  navigate(URL_USER);
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
  t: TFunction,
  navigate: NavigateFunction
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
      navigate(URL_USER);
    })
    .catch((e: HTTPError) => {
      sendErrorNotification(e.description);
    });
};

const keycloakUsersSelector = makeKeycloakUsersSelector();

const UserCredentials: React.FC<CredentialsPropsTypes> = (props: CredentialsPropsTypes) => {
  const { serviceClass, keycloakBaseURL } = props;
  const { t } = useTranslation();
  const params = useParams();
  const userId = params[ROUTE_PARAM_USER_ID];

  if (!userId) {
    return <Resource404 errorMessage={t('Unable to load resource. Unknown user id.')} />;
  }
  
  const keycloakUser = useSelector((state) => {
    const keycloakUsers = keycloakUsersSelector(state, { id: [userId] });
    const keycloakUser = keycloakUsers.length >= 1 ? keycloakUsers[0] : null;
    return keycloakUser
  })
  
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
  const navigate = useNavigate();
  const heading = `${t('User Credentials')} | ${keycloakUser ? keycloakUser.username : ''}`;
  
  return (
    <Row className="content-section">
      <PageHeader title={heading} />
      <Col className="bg-white p-3" span={24}>
        <div className="form-container">
          <Form
            {...layout}
            onFinish={(values: UserCredentialsFormFields) =>
              submitForm(values, userId, serviceClass, keycloakBaseURL, t, navigate)
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
              <Button onClick={() => props.cancelUserHandler(navigate)} className="cancel-user">
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

/** map props to action creators */
const mapDispatchToProps = {
  fetchKeycloakUsersCreator: fetchKeycloakUsers,
};

export const ConnectedUserCredentials = connect(
  undefined,
  mapDispatchToProps
)(UserCredentials);
