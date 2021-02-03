import React, { Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Select, Input, Radio } from 'antd';
import { KeycloakService } from '@opensrp/keycloak-service';
import { KeycloakUser } from '../../../ducks/user';
import { URL_USER } from '../../../constants';
import {
  CANCEL,
  EDIT_USER,
  ADD_USER,
  FIRST_NAME,
  LAST_NAME,
  EMAIL,
  USERNAME,
  MARK_AS_PRACTITIONER,
  REQUIRED_ACTIONS,
  PLEASE_SELECT,
  SAVE,
  SAVING,
  FIRST_NAME_REQUIRED,
  LAST_NAME_REQUIRED,
  USERNAME_REQUIRED,
} from '../../../lang';
import { submitForm, fetchRequiredActions, UserAction } from './utils';
import '../../../index.css';
import { OpenSRPService } from '@opensrp/react-utils';
import { Dictionary } from '@onaio/utils';
/** Interface for practitioner json object */
export interface Practitioner {
  active: boolean;
  identifier: string;
  name: string;
  userId: string;
  username: string;
}
/** props for editing a user view */
export interface UserFormProps {
  initialValues: KeycloakUser;
  serviceClass: typeof KeycloakService;
  opensrpServiceClass: typeof OpenSRPService;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  practitioner: Practitioner | undefined;
  extraData: Dictionary;
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
  initialValues: defaultInitialValues,
  opensrpServiceClass: OpenSRPService,
  practitioner: undefined,
  serviceClass: KeycloakService,
  extraData: {},
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
  const {
    initialValues,
    serviceClass,
    keycloakBaseURL,
    opensrpServiceClass,
    opensrpBaseURL,
    practitioner,
    extraData,
  } = props;
  const [requiredActions, setRequiredActions] = React.useState<string[]>([]);
  const [userActionOptions, setUserActionOptions] = React.useState<UserAction[]>([]);
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const history = useHistory();
  const [form] = Form.useForm();
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
  const status = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  const { Option } = Select;
  React.useEffect(() => {
    fetchRequiredActions(keycloakBaseURL, setUserActionOptions, serviceClass);
  }, [keycloakBaseURL, serviceClass]);
  React.useEffect(() => {
    setRequiredActions(initialValues.requiredActions ? initialValues.requiredActions : []);
  }, [initialValues.requiredActions]);

  /** Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initiaValues is updated
   * **/
  React.useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      active: !!practitioner && practitioner.active,
    });
  }, [form, initialValues, practitioner]);

  return (
    <Row className="layout-content">
      {/** If email is provided render edit user otherwise add user */}
      <h5 className="mb-3 header-title">
        {props.initialValues.id ? `${EDIT_USER} | ${initialValues.username}` : ADD_USER}
      </h5>
      <Col className="bg-white p-3" span={24}>
        <Form
          {...layout}
          form={form}
          initialValues={{
            ...initialValues,
            active: !!practitioner && practitioner.active,
          }}
          onFinish={(values) => {
            submitForm(
              {
                ...values,
                requiredActions,
              },
              keycloakBaseURL,
              opensrpBaseURL,
              serviceClass,
              opensrpServiceClass,
              setSubmitting,
              practitioner,
              initialValues.id
            );
          }}
        >
          <Form.Item
            name="firstName"
            id="firstName"
            label={FIRST_NAME}
            rules={[{ required: true, message: FIRST_NAME_REQUIRED }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            id="lastName"
            label={LAST_NAME}
            rules={[{ required: true, message: LAST_NAME_REQUIRED }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" id="email" label={EMAIL}>
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            id="username"
            label={USERNAME}
            rules={[{ required: true, message: USERNAME_REQUIRED }]}
          >
            <Input disabled={initialValues.id ? true : false} />
          </Form.Item>
          {initialValues.id && initialValues.id !== extraData.user_id ? (
            <Form.Item id="practitionerToggle" name="active" label={MARK_AS_PRACTITIONER}>
              <Radio.Group name="active">
                {status.map((e) => (
                  <Radio name="active" key={e.label} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          ) : null}
          {initialValues.id !== extraData.user_id ? (
            <Form.Item name="requiredActions" id="requiredActions" label={REQUIRED_ACTIONS}>
              <Select
                mode="multiple"
                allowClear
                placeholder={PLEASE_SELECT}
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
          ) : null}
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="create-user">
              {isSubmitting ? SAVING : SAVE}
            </Button>
            <Button onClick={() => history.push(URL_USER)} className="cancel-user">
              {CANCEL}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
UserForm.defaultProps = defaultProps;
export { UserForm };
