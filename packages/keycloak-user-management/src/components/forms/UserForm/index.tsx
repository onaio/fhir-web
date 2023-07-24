import React, { useEffect, useState, FC } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Select, Input, Radio } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import {
  compositionUrlFilter,
  getCompositionOptions,
  getUserGroupsOptions,
  postPutPractitioner,
  submitForm,
  userGroupOptionsFilter,
} from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import '../../../index.css';
import {
  CONTACT_FORM_FIELD,
  FormFields,
  FormFieldsKey,
  SelectOption,
  UserFormProps,
} from './types';
import { SelectProps } from 'antd/lib/select';
import { useTranslation } from '../../../mls';
import { compositionResourceType, PRACTITIONER, SUPERVISOR } from '../../../constants';
import { FhirSelect } from '@opensrp/react-utils';
import { IComposition } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IComposition';

const UserForm: FC<UserFormProps> = (props: UserFormProps) => {
  const {
    initialValues,
    keycloakBaseURL,
    baseUrl,
    practitionerUpdaterFactory,
    extraData,
    userGroups,
    renderFields,
    hiddenFields,
    isFHIRInstance,
  } = props;
  const shouldRender = (fieldName: FormFieldsKey) => !!renderFields?.includes(fieldName);
  const isHidden = (fieldName: FormFieldsKey) => !!hiddenFields?.includes(fieldName);
  const { t } = useTranslation();

  const practitionerUpdater = practitionerUpdaterFactory(baseUrl);

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
    { label: t('Yes'), value: true },
    { label: t('No'), value: false },
  ];

  /**
   * Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initialValues update
   *
   */
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
    <Row className="content-section">
      {/** If email is provided render edit user otherwise add user */}
      <PageHeader
        title={
          props.initialValues.id
            ? t('Edit User | {{username}}', { username: initialValues.username })
            : t('Add User')
        }
      />
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
              userGroups,
              initialValues.userGroups as string[],
              practitionerUpdater,
              t
            )
              .catch((_: Error) => {
                if (props.initialValues.id) {
                  sendErrorNotification(t('There was a problem updating user details'));
                }
                sendErrorNotification(t('There was a problem creating User'));
              })
              .finally(() => setSubmitting(false));
          }}
        >
          <Form.Item
            name="firstName"
            id="firstName"
            label={t('First Name')}
            rules={[{ required: true, message: t('First Name is required') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            id="lastName"
            label={t('Last Name')}
            rules={[{ required: true, message: t('Last Name is required') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" id="email" label={t('Email')}>
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            id="username"
            label={t('Username')}
            rules={[{ required: true, message: t('Username is required') }]}
          >
            <Input disabled={initialValues.id ? true : false} />
          </Form.Item>

          {shouldRender(CONTACT_FORM_FIELD) ? (
            <Form.Item
              id={CONTACT_FORM_FIELD}
              rules={[
                {
                  type: 'string',
                  pattern: /^0\d{9}$/,
                  message: t('Contact should be 10 digits and start with 0'),
                },
                {
                  required: !isHidden(CONTACT_FORM_FIELD),
                  message: t('Contact is required'),
                },
              ]}
              hidden={isHidden(CONTACT_FORM_FIELD)}
              name={CONTACT_FORM_FIELD}
              label={t('Contact')}
            >
              <Input></Input>
            </Form.Item>
          ) : null}

          {isFHIRInstance ? (
            <Form.Item id="userType" name="userType" label={t('User Type')}>
              <Radio.Group
                options={[
                  { label: t('Practitioner'), value: PRACTITIONER },
                  { label: t('Supervisor'), value: SUPERVISOR },
                ]}
                name="userType"
              ></Radio.Group>
            </Form.Item>
          ) : null}

          <Form.Item id="enabled" name="enabled" label={t('Enable user')}>
            <Radio.Group
              options={status}
              name="enabled"
              // watch user's status
              onChange={(e) => setUserEnabled(e.target.value)}
            ></Radio.Group>
          </Form.Item>

          {initialValues.id && initialValues.id !== extraData.user_id ? (
            <Form.Item id="practitionerToggle" name="active" label={t('Mark as Practitioner')}>
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

          <Form.Item name="userGroups" id="userGroups" label={t('Keycloak User Group')}>
            <Select<SelectOption[]>
              mode="multiple"
              allowClear
              placeholder={t('Please select')}
              style={{ width: '100%' }}
              options={getUserGroupsOptions(userGroups)}
              filterOption={userGroupOptionsFilter as SelectProps<SelectOption[]>['filterOption']}
            ></Select>
          </Form.Item>

          {isFHIRInstance ? (
            <Form.Item
              id="fhirCoreAppId"
              name="fhirCoreAppId"
              label={t('Application ID')}
              rules={[{ required: true, message: t('Application Id is required') }]}
              data-testid="fhirCoreAppId"
            >
              <FhirSelect<IComposition>
                baseUrl={baseUrl}
                resourceType={compositionResourceType}
                transformOption={getCompositionOptions}
                extraQueryParams={compositionUrlFilter}
                showSearch={true}
              ></FhirSelect>
            </Form.Item>
          ) : null}

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" className="create-user">
              {isSubmitting ? t('SAVING') : t('Save')}
            </Button>
            <Button onClick={() => history.goBack()} className="cancel-user">
              {t('Cancel')}
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export const defaultUserFormInitialValues: FormFields = {
  firstName: '',
  id: '',
  lastName: '',
  username: '',
  active: true,
  userType: 'practitioner',
  userGroups: undefined,
  practitioner: undefined,
  contact: undefined,
  enabled: true,
  fhirCoreAppId: undefined,
};

UserForm.defaultProps = {
  initialValues: defaultUserFormInitialValues,
  practitionerUpdaterFactory: postPutPractitioner,
};

export { UserForm };
