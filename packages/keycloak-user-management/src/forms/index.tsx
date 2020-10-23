import React, { Dispatch, SetStateAction } from 'react';
import { Button, Form, Select, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { KeycloakUser } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Dictionary } from '@onaio/utils/dist/types/types';
import { URL_ADMIN } from '../constants';
import { submitForm, fetchRequiredActions } from './utils';

/** props for editing a user view */
export interface UserFormProps {
  accessToken: string;
  initialValues: KeycloakUser;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
}

/** interface user action */
export interface UserAction {
  alias: string;
  name: string;
  providerId: string;
  enabled: boolean;
  defaultAction: boolean;
  priority: number;
  config: Dictionary;
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
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
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
    <div className="form-container">
      <Form
        initialValues={initialValues}
        {...layout}
        onFinish={(values: Partial<KeycloakUser>) => {
          submitForm(
            {
              ...values,
              requiredActions,
            },
            accessToken,
            keycloakBaseURL,
            serviceClass,
            setIsSubmitting,
            initialValues.id
          );
        }}
      >
        <Form.Item
          label={'First Name'}
          name="firstName"
          hasFeedback
          rules={[{ required: true, message: 'First Name required', whitespace: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={'Last Name'}
          name="lastName"
          hasFeedback
          rules={[{ required: true, message: 'Last Name required', whitespace: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={'Username'}
          name="username"
          hasFeedback
          rules={[{ required: true, message: 'Username required', whitespace: true }]}
        >
          <Input disabled={initialValues.id ? true : false} />
        </Form.Item>
        <Form.Item
          label={'Email'}
          name="email"
          hasFeedback
          rules={[{ required: true, message: 'Email required', whitespace: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="requiredActions" label={'Required User Actions'}>
          <Select
            mode="multiple"
            allowClear
            placeholder="Please select"
            onChange={(selected: string[]) => handleUserActionsChange(selected, setRequiredActions)}
            style={{ width: '100%' }}
          >
            {userActionOptions.map((option: UserAction, index: number) => (
              <Option key={`${index}`} value={option.alias}>
                {option.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" className="create-user">
            {isSubmitting ? 'Saving' : 'Save'}
          </Button>
          <Button htmlType="submit" onClick={() => history.push(URL_ADMIN)} className="cancel-user">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

UserForm.defaultProps = defaultProps;

export { UserForm };
