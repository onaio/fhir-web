import React, { useEffect, useState, FC } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Select, Input, Radio } from 'antd';
import { KeycloakUser, Practitioner, UserGroup } from '../../../ducks/user';
import lang from '../../../lang';
import { submitForm } from './utils';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification } from '@opensrp/notifications';
import '../../../index.css';
import { ATTRIBUTES_FORM_FIELD, CONTACT_FORM_FIELD } from '../../../constants';

/** props for editing a user view */
export interface UserFormProps {
  initialValues: FormFields;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  userGroups: UserGroup[];
  extraData: Dictionary;
  hidden?: string[];
}

/** adhoc attributes that can be applied to a user */
export interface UserAttributes {
  contact?: string;
}

export interface FormFields extends KeycloakUser {
  active?: boolean;
  userGroup?: string[];
  practitioner?: Practitioner;
  attributes?: UserAttributes;
}

const UserForm: FC<UserFormProps> = (props: UserFormProps) => {
  const { initialValues, keycloakBaseURL, opensrpBaseURL, extraData, userGroups, hidden } = props;
  const isHidden = (fieldName: string) => !!hidden?.includes(fieldName);

  // hook into the form lifecycle methods
  const [form] = Form.useForm();

  const [isSubmitting, setSubmitting] = useState<boolean>(false);
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

  /** Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initialValues update
   * **/
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  // get the status of user at mount
  const [userEnabled, setUserEnabled] = useState<boolean>(initialValues.enabled ?? false);

  // if user is disabled also disable practitioner
  // else show default practitioner value
  useEffect(() => {
    if (!userEnabled) {
      form.setFields([
        {
          name: 'active',
          value: false,
        },
      ]);
    } else {
      form.setFields([
        {
          name: 'active',
          value: initialValues.active,
        },
      ]);
    }
  }, [form, initialValues, userEnabled]);

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
              { ...initialValues, ...values },
              keycloakBaseURL,
              opensrpBaseURL,
              userGroups,
              initialValues.userGroup as string[]
            )
              .catch((_: Error) => {
                sendErrorNotification(lang.ERROR_OCCURED);
              })
              .finally(() => setSubmitting(false));
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

          <Form.Item
            id={CONTACT_FORM_FIELD}
            rules={[
              {
                type: 'string',
                pattern: /^0\d{9}/,
                message: lang.CONTACT_REGEX_ERROR,
              },
              { required: !isHidden(CONTACT_FORM_FIELD), message: lang.CONTACT_IS_REQUIRED_ERROR },
            ]}
            hidden={isHidden(CONTACT_FORM_FIELD)}
            name={[ATTRIBUTES_FORM_FIELD, CONTACT_FORM_FIELD]}
            label={lang.CONTACT}
          >
            <Input></Input>
          </Form.Item>

          <Form.Item id="enabled" name="enabled" label={lang.ENABLE_USER}>
            <Radio.Group
              options={status}
              name="enabled"
              // watch user's status
              onChange={(e) => setUserEnabled(e.target.value)}
            ></Radio.Group>
          </Form.Item>
          {initialValues.id && initialValues.id !== extraData.user_id ? (
            <Form.Item id="practitionerToggle" name="active" label={lang.MARK_AS_PRACTITIONER}>
              <Radio.Group name="active">
                {status.map((e) => (
                  <Radio
                    name="active"
                    key={e.label}
                    value={e.value}
                    // disable field if user is disabled
                    disabled={!userEnabled}
                  >
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
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
            <Button onClick={() => history.goBack()} className="cancel-user">
              {lang.CANCEL}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

const defaultProps = {
  hidden: [CONTACT_FORM_FIELD],
};

UserForm.defaultProps = defaultProps;

export { UserForm };
