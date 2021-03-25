import React from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Select, Input, Radio } from 'antd';
import { KeycloakUser, Practitioner, UserAction, UserGroup } from '../../../ducks/user';
import { URL_USER } from '../../../constants';
import lang from '../../../lang';
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
  const [form] = Form.useForm();
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
        {props.initialValues.id ? `${lang.EDIT_USER} | ${initialValues.username}` : lang.ADD_USER}
      </h5>
      <Col className="bg-white p-3" span={24}>
        <Form
          {...layout}
          form={form}
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
              sendErrorNotification(lang.ERROR_OCCURED);
            });
          }}
        >
          <Form.Item
            name="firstName"
            id="firstName"
            label={lang.FIRST_NAME}
            rules={[{ required: true, message: lang.FIRST_NAME_REQUIRED }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            id="lastName"
            label={lang.LAST_NAME}
            rules={[{ required: true, message: lang.LAST_NAME_REQUIRED }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" id="email" label={lang.EMAIL}>
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            id="username"
            label={lang.USERNAME}
            rules={[{ required: true, message: lang.USERNAME_REQUIRED }]}
          >
            <Input disabled={initialValues.id ? true : false} />
          </Form.Item>
          <Form.Item id="enabled" name="enabled" label={lang.ENABLE_USER}>
            <Radio.Group options={status} name="enabled"></Radio.Group>
          </Form.Item>
          {initialValues.id && initialValues.id !== extraData.user_id ? (
            <Form.Item id="practitionerToggle" name="active" label={lang.MARK_AS_PRACTITIONER}>
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
            <Form.Item name="requiredActions" id="requiredActions" label={lang.REQUIRED_ACTIONS}>
              <Select
                mode="multiple"
                allowClear
                placeholder={lang.PLEASE_SELECT}
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
          <Form.Item name="userGroup" id="userGroup" label={lang.GROUP}>
            <Select
              mode="multiple"
              allowClear
              placeholder={lang.PLEASE_SELECT}
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
              {isSubmitting ? lang.SAVING : lang.SAVE}
            </Button>
            <Button onClick={() => history.push(URL_USER)} className="cancel-user">
              {lang.CANCEL}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export { UserForm };
