import { ErrorMessage, Field, Formik } from 'formik';
// import moment from 'moment';
import React, { Dispatch, SetStateAction } from 'react';
// import { Redirect } from 'react-router';
import { Button, Form, Col, notification, Card, Row, Select } from 'antd';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';
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
  UserAction,
} from '../../../../store/ducks/keycloak';
import { KeycloakService } from '../../../../services';
import './CreateEditUser.css';
import Ripple from '../../../../components/page/Loading';
import {
  LABEL_CONFIGURE_OTP,
  LABEL_UPDATE_PASSWORD,
  LABEL_VERIFY_EMAIL,
  LABEL_UPDATE_USER_LOCALE,
  LABEL_UPDATE_PROFILE,
} from '../../../../constants';

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
  keycloakUser: defaultInitialValues,
  serviceClass: KeycloakService,
};

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  lastName: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
});

/** Handle required actions change */
export const handleUserActionsChange = (
  selected: UserAction[],
  setRequiredActions: Dispatch<SetStateAction<UserAction[]>>
): void => {
  setRequiredActions(selected);
};

const CreateEditUsers: React.FC<PropsTypes> = (props: PropsTypes) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [requiredActions, setRequiredActions] = React.useState<UserAction[]>([]);
  const { serviceClass, fetchKeycloakUsersCreator, keycloakUser } = props;
  const userId = props.match.params.userId;
  const isEditMode = !!userId;
  const { Option } = Select;

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
  }, []);

  React.useEffect(() => {
    setRequiredActions(
      keycloakUser && keycloakUser.requiredActions ? keycloakUser.requiredActions : []
    );
  }, [keycloakUser]);

  const layout = {
    labelCol: { span: 12 },
    wrapperCol: { span: 16 },
  };

  if (isLoading) {
    return <Ripple />;
  }

  return (
    <Col span={12}>
      <Card title={`${isEditMode ? 'Edit User' : 'Create New User'}`} bordered={false}>
        <HeaderBreadCrumb userId={userId} />
        <div className="form-container">
          <Formik
            initialValues={keycloakUser as KeycloakUser}
            validationSchema={userSchema}
            // tslint:disable-next-line: jsx-no-lambda
            onSubmit={(values, { setSubmitting }) => {
              if (isEditMode) {
                const serve = new serviceClass(`/users/${userId}`);
                serve
                  .update({
                    ...values,
                    requiredActions,
                  })
                  .then(() => {
                    setSubmitting(false);
                    history.push('/admin');
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
                    history.push('/admin');
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
                <Form.Item label={'User Id'}>
                  <Field
                    readOnly={true}
                    type="text"
                    name="id"
                    id="id"
                    // disabled={disabledFields.includes('name')}
                    className={errors.id ? `form-control is-invalid` : `form-control`}
                  />
                </Form.Item>
                <Form.Item
                  label={'First Name'}
                  rules={[
                    { required: true, message: 'Please input your First Name!', whitespace: true },
                  ]}
                >
                  <Field
                    type="text"
                    name="firstName"
                    id="firstName"
                    // disabled={disabledFields.includes('name')}
                    className={errors.firstName ? `form-control is-invalid` : `form-control`}
                  />
                </Form.Item>
                <Form.Item
                  label={'Last Name'}
                  rules={[
                    { required: true, message: 'Please input your Last Name!', whitespace: true },
                  ]}
                >
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
                    readOnly={isEditMode}
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
                <Form.Item label={'Required User Actions'}>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Please select"
                    onChange={(selected) => handleUserActionsChange(selected, setRequiredActions)}
                    style={{ width: '100%' }}
                    defaultValue={requiredActions}
                  >
                    <Option key={UserAction.CONFIGURE_TOTP} value={UserAction.CONFIGURE_TOTP}>
                      {LABEL_CONFIGURE_OTP}
                    </Option>
                    <Option key={UserAction.UPDATE_PASSWORD} value={UserAction.UPDATE_PASSWORD}>
                      {LABEL_UPDATE_PASSWORD}
                    </Option>
                    <Option key={UserAction.UPDATE_PROFILE} value={UserAction.UPDATE_PROFILE}>
                      {LABEL_UPDATE_PROFILE}
                    </Option>
                    <Option key={UserAction.VERIFY_EMAIL} value={UserAction.VERIFY_EMAIL}>
                      {LABEL_VERIFY_EMAIL}
                    </Option>
                    <Option
                      key={UserAction.UPDATE_USER_LOCALE}
                      value={UserAction.UPDATE_USER_LOCALE}
                    >
                      {LABEL_UPDATE_USER_LOCALE}
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Row justify="start">
                    <Col span={4}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="create-user"
                        disabled={isSubmitting || Object.keys(errors).length > 0}
                      >
                        {isSubmitting ? 'Saving' : 'Save User'}
                      </Button>
                    </Col>
                    <Col span={4}>
                      <Button
                        htmlType="submit"
                        onClick={() => history.push('/admin')}
                        className="cancel-user"
                        disabled={isSubmitting || Object.keys(errors).length > 0}
                      >
                        Cancel
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
