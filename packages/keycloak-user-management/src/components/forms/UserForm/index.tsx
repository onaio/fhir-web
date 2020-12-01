import React, { Dispatch, SetStateAction } from 'react';
import { Button, Col, Row } from 'antd';
import { Form, Select, Input } from 'formik-antd';
import { history } from '@onaio/connected-reducer-registry';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { KeycloakUser } from '../../../ducks/user';
import { URL_ADMIN, CANCEL } from '../../../constants';
import { submitForm, fetchRequiredActions, UserAction } from './utils';
import '../../../index.css';

/** props for editing a user view */
export interface UserFormProps {
  accessToken: string;
  initialValues: KeycloakUser;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
}

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
export const defaultProps: Partial<UserFormProps> = {
  accessToken: '',
  initialValues: defaultInitialValues,
  serviceClass: KeycloakService,
};

const userSchema = Yup.object().shape({
  lastName: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
  email: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
});

/**
 * Handle required actions change
 *
 * @param {string} selected - selected action
 * @param {Dispatch<SetStateAction<string[]>>} setRequiredActions - selected action dispatcher
 */
export const handleUserActionsChange = (
  selected: string[],
  setRequiredActions: Dispatch<SetStateAction<string[]>>
): void => {
  setRequiredActions(selected);
};

const UserForm: React.FC<UserFormProps> = (props: UserFormProps) => {
  const { initialValues, serviceClass, accessToken, keycloakBaseURL } = props;
  const [requiredActions, setRequiredActions] = React.useState<string[]>([]);
  const [userActionOptions, setUserActionOptions] = React.useState<UserAction[]>([]);
  const layout = {
    labelCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 2, span: 10 },
      md: { offset: 0, span: 8 },
      lg: { offset: 0, span: 6 },
    },
    wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 12 }, lg: { span: 10 } },
  };

  const tailLayout = {
    wrapperCol: {
      xs: { offset: 0, span: 16 },
      sm: { offset: 12, span: 24 },
      md: { offset: 8, span: 16 },
      lg: { offset: 6, span: 14 },
    },
  };
  const { Option } = Select;

  React.useEffect(() => {
    fetchRequiredActions(accessToken, keycloakBaseURL, setUserActionOptions, serviceClass);
  }, [accessToken, keycloakBaseURL, serviceClass]);

  React.useEffect(() => {
    setRequiredActions(initialValues.requiredActions ? initialValues.requiredActions : []);
  }, [initialValues.requiredActions]);

  return (
    <Row className="layout-content">
      {/** If email is provided render edit user otherwise add user */}
      <h5 className="mb-3">{props.initialValues.email ? 'Edit User' : 'User addition'}</h5>
      <Col className="bg-white p-3" span={24}>
        <Formik
          initialValues={initialValues}
          validationSchema={userSchema}
          onSubmit={(values, { setSubmitting }) =>
            submitForm(
              {
                ...values,
                requiredActions,
              },
              accessToken,
              keycloakBaseURL,
              serviceClass,
              setSubmitting,
              initialValues.id
            )
          }
        >
          {({ isSubmitting }) => (
            <Form className=" bg-white p-3 form-container" {...layout}>
              <Form.Item name="firstName" label="First Name">
                <Input id="firstName" name="firstName" />
              </Form.Item>

              <Form.Item name="lastName" label="Last Name">
                <Input id="lastName" name="lastName" />
              </Form.Item>

              <Form.Item name="email" label="Email">
                <Input id="email" name="email" />
              </Form.Item>

              <Form.Item name="username" label="Username">
                <Input id="username" name="username" disabled={initialValues.id ? true : false} />
              </Form.Item>

              <Form.Item name="requiredActions" label="Required Actions">
                <Select
                  id="requiredActions"
                  name="requiredActions"
                  mode="multiple"
                  allowClear
                  placeholder="Please select"
                  onChange={(selected: string[]) =>
                    handleUserActionsChange(selected, setRequiredActions)
                  }
                  style={{ width: '100%' }}
                >
                  {userActionOptions.map((option: UserAction, index: number) => (
                    <Option key={`${index}`} value={option.alias}>
                      {option.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item {...tailLayout} name="tail">
                <Button type="primary" htmlType="submit" className="create-user">
                  {isSubmitting ? 'Saving' : 'Save'}
                </Button>
                <Button onClick={() => history.push(URL_ADMIN)} className="cancel-user">
                  {CANCEL}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};

UserForm.defaultProps = defaultProps;

export { UserForm };
