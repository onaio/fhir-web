import React from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Select, Input, Radio } from 'antd';
import { KeycloakUser, Practitioner, UserAction, UserGroup } from '../../../ducks/user';
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
  GROUP,
  ERROR_OCCURED,
} from '../../../lang';
import { submitForm, fetchRequiredActions } from './utils';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification } from '@opensrp/notifications';
import '../../../index.css';

/** props for editing a user view */
export interface UserFormProps {
  initialValues: FormFields;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  userGroups: UserGroup[];
  extraData: Dictionary;
}

export interface FormFields extends KeycloakUser {
  active?: boolean;
  userGroup?: string[];
  practitioner?: Practitioner;
}

const UserForm: React.FC<UserFormProps> = (props: UserFormProps) => {
  const { initialValues, keycloakBaseURL, opensrpBaseURL, extraData, userGroups } = props;

  const [requiredActions, setRequiredActions] = React.useState<string[]>([]);
  const [userActionOptions, setUserActionOptions] = React.useState<UserAction[]>([]);
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const history = useHistory();
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

  React.useEffect(() => {
    fetchRequiredActions(keycloakBaseURL, setUserActionOptions);
  }, [keycloakBaseURL]);

  React.useEffect(() => {
    setRequiredActions(initialValues.requiredActions ? initialValues.requiredActions : []);
  }, [initialValues.requiredActions]);

  return (
    <Row className="layout-content">
      {/** If email is provided render edit user otherwise add user */}
      <h5 className="mb-3 header-title">
        {props.initialValues.id ? `${EDIT_USER} | ${initialValues.username}` : ADD_USER}
      </h5>
      <Col className="bg-white p-3" span={24}>
        <Form
          {...layout}
          initialValues={initialValues}
          onFinish={(values) => {
            setSubmitting(true);
            submitForm(
              { ...initialValues, ...values, requiredActions },
              keycloakBaseURL,
              opensrpBaseURL,
              userGroups
            ).catch((_: Error) => {
              setSubmitting(false);
              sendErrorNotification(ERROR_OCCURED);
            });
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
                onChange={(selected: string[]) => setRequiredActions(selected)}
                style={{ width: '100%' }}
              >
                {userActionOptions.map((option: UserAction, index: number) => (
                  <Select.Option key={`${index}`} value={option.alias}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : null}
          <Form.Item name="userGroup" id="userGroup" label={GROUP}>
            <Select
              mode="multiple"
              allowClear
              placeholder={PLEASE_SELECT}
              style={{ width: '100%' }}
            >
              {userGroups.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
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

export { UserForm };
