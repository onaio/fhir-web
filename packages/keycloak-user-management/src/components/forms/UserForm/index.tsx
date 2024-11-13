import React, { useEffect, useState, FC } from 'react';
import { useHistory } from 'react-router';
import { Button, Col, Row, Form, Select, Input, Radio } from 'antd';
import { BodyLayout } from '@opensrp/react-utils';
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
import { FormFields, FormFieldsKey, SelectOption, UserFormProps } from './types';
import { SelectProps } from 'antd/lib/select';
import { useTranslation } from '../../../mls';
import {
  compositionResourceType,
  emailField,
  enabledField,
  fhirCoreAppIdField,
  firstNameField,
  lastNameField,
  NATIONAL_ID_FORM_FIELD,
  PHONE_NUMBER_FORM_FIELD,
  PRACTITIONER,
  SUPERVISOR,
  userGroupsField,
  usernameField,
  userTypeField,
} from '../../../constants';
import { PaginatedAsyncSelect } from '@opensrp/react-utils';
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
  } = props;
  const shouldRender = (fieldName: FormFieldsKey) => {
    if (renderFields === undefined) {
      return true;
    }
    return !!renderFields.includes(fieldName);
  };

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
  const pageTitle = props.initialValues.id
    ? t('Edit User | {{username}}', { username: initialValues.username })
    : t('Add User');
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Row>
        {/** If email is provided render edit user otherwise add user */}
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
            {shouldRender(firstNameField) ? (
              <Form.Item
                name={firstNameField}
                id={firstNameField}
                hidden={isHidden(firstNameField)}
                label={t('First Name')}
                rules={[{ required: true, message: t('First Name is required') }]}
              >
                <Input />
              </Form.Item>
            ) : null}

            {shouldRender(lastNameField) ? (
              <Form.Item
                name={lastNameField}
                id={lastNameField}
                hidden={isHidden(lastNameField)}
                label={t('Last Name')}
                rules={[{ required: true, message: t('Last Name is required') }]}
              >
                <Input />
              </Form.Item>
            ) : null}

            {shouldRender(NATIONAL_ID_FORM_FIELD) ? (
              <Form.Item
                name={NATIONAL_ID_FORM_FIELD}
                id={NATIONAL_ID_FORM_FIELD}
                hidden={isHidden(NATIONAL_ID_FORM_FIELD)}
                label={t('National Id')}
                rules={[
                  {
                    pattern: /^\d{16}$/,
                    message: t('National Id number with 16 digits'),
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null}

            {shouldRender(PHONE_NUMBER_FORM_FIELD) ? (
              <Form.Item
                hidden={isHidden(PHONE_NUMBER_FORM_FIELD)}
                name={PHONE_NUMBER_FORM_FIELD}
                id={PHONE_NUMBER_FORM_FIELD}
                label={t('Mobile Phone Number')}
                rules={[
                  {
                    pattern: /^\d{10,16}$/,
                    required: true,
                    message: t('Please enter a Phone number with 10 to 16 digits.'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null}

            {shouldRender(emailField) ? (
              <Form.Item name={emailField} id={emailField} label={t('Email')}>
                <Input />
              </Form.Item>
            ) : null}

            {shouldRender(usernameField) ? (
              <Form.Item
                name={usernameField}
                id={usernameField}
                label={t('Username')}
                rules={[{ required: true, message: t('Username is required') }]}
              >
                <Input disabled={initialValues.id ? true : false} />
              </Form.Item>
            ) : null}

            {shouldRender(userTypeField) ? (
              <Form.Item
                id={userTypeField}
                name={userTypeField}
                label={t('User Type')}
                hidden={isHidden(userTypeField)}
              >
                <Radio.Group
                  options={[
                    { label: t('Practitioner'), value: PRACTITIONER },
                    { label: t('Supervisor'), value: SUPERVISOR },
                  ]}
                ></Radio.Group>
              </Form.Item>
            ) : null}

            <Form.Item
              id={enabledField}
              name={enabledField}
              label={t('Enable user')}
              hidden={isHidden(enabledField)}
            >
              <Radio.Group
                options={status}
                // watch user's status
                onChange={(e) => setUserEnabled(e.target.value)}
              ></Radio.Group>
            </Form.Item>

            {initialValues.id &&
            initialValues.id !== extraData.user_id &&
            shouldRender('active') ? (
              <Form.Item
                id="practitionerToggle"
                name="active"
                label={t('Mark as Practitioner')}
                hidden={isHidden('active')}
              >
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

            {shouldRender(userGroupsField) ? (
              <Form.Item
                name={userGroupsField}
                id={userGroupsField}
                hidden={isHidden(userGroupsField)}
                label={t('Keycloak User Group')}
              >
                <Select<SelectOption[]>
                  mode="multiple"
                  allowClear
                  placeholder={t('Please select')}
                  style={{ width: '100%' }}
                  options={getUserGroupsOptions(userGroups)}
                  filterOption={
                    userGroupOptionsFilter as SelectProps<SelectOption[]>['filterOption']
                  }
                ></Select>
              </Form.Item>
            ) : null}

            {shouldRender(fhirCoreAppIdField) ? (
              <Form.Item
                hidden={isHidden(fhirCoreAppIdField)}
                id={fhirCoreAppIdField}
                name={fhirCoreAppIdField}
                label={t('Application ID')}
                rules={[{ required: true, message: t('Application Id is required') }]}
                data-testid="fhirCoreAppId"
              >
                <PaginatedAsyncSelect<IComposition>
                  baseUrl={baseUrl}
                  resourceType={compositionResourceType}
                  transformOption={getCompositionOptions}
                  extraQueryParams={compositionUrlFilter}
                  showSearch={true}
                ></PaginatedAsyncSelect>
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
    </BodyLayout>
  );
};

export const defaultUserFormInitialValues: FormFields = {
  firstName: '',
  id: '',
  lastName: '',
  nationalId: '',
  phoneNumber: '',
  username: '',
  active: true,
  userType: 'practitioner',
  userGroups: undefined,
  practitioner: undefined,
  enabled: true,
  fhirCoreAppId: undefined,
};

export const commonFhirFields: FormFieldsKey[] = [
  firstNameField,
  lastNameField,
  emailField,
  usernameField,
  userTypeField,
  enabledField,
  'active',
  userGroupsField,
  fhirCoreAppIdField,
];

UserForm.defaultProps = {
  initialValues: defaultUserFormInitialValues,
  practitionerUpdaterFactory: postPutPractitioner,
  renderFields: commonFhirFields,
};

export { UserForm };
