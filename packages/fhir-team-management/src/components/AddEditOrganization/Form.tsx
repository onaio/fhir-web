import React from 'react';
import { Select, Button, Form, Radio, Input, Space } from 'antd';
import {
  identifier,
  active,
  alias,
  id,
  name,
  type,
  members,
  organizationResourceType,
} from '../../constants';
import { useQueryClient, useMutation } from 'react-query';
import { useTranslation } from '../../mls';
import { SelectProps } from 'antd/lib/select';
import {
  practitionersFilterFunction,
  postPutOrganization,
  updatePractitionerRoles,
} from '../../utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import {
  sendErrorNotification,
  sendInfoNotification,
  sendSuccessNotification,
} from '@opensrp/notifications';
import { useHistory } from 'react-router';
import {
  generateOrgPayload,
  getPractitionerOptions,
  getOrgTypeSelectOptions,
  OrganizationFormFields,
  validationRulesFactory,
} from './utils';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';

const { Item: FormItem } = Form;
interface OrganizationFormProps {
  fhirBaseUrl: string;
  initialValues: OrganizationFormFields;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
  practitioners: IPractitioner[];
  existingPractitionerRoles: IPractitionerRole[];
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

const OrganizationForm = (props: OrganizationFormProps) => {
  const {
    fhirBaseUrl,
    initialValues,
    disabled,
    cancelUrl,
    successUrl,
    practitioners,
    existingPractitionerRoles,
  } = props;

  const queryClient = useQueryClient();
  const history = useHistory();
  const { t } = useTranslation();
  const goTo = (url = '#') => history.push(url);

  const { mutate, isLoading } = useMutation(
    (values: OrganizationFormFields) => {
      const payload = generateOrgPayload(values);
      return postPutOrganization(fhirBaseUrl, payload).then((organization) => {
        sendSuccessNotification(t('Organization updated successfully'));
        return updatePractitionerRoles(
          fhirBaseUrl,
          values,
          initialValues,
          organization,
          practitioners,
          existingPractitionerRoles
        ).then(() => {
          sendSuccessNotification(t('Practitioner assignments updated successfully'));
        });
      });
    },
    {
      onError: (err: Error) => {
        sendErrorNotification(err.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([organizationResourceType]).catch(() => {
          sendInfoNotification(t('Failed to refresh data, please refresh the page'));
        });
        goTo(successUrl);
      },
    }
  );

  /** antd select component options */
  interface SelectOption {
    label: string;
    value: string;
  }

  const statusOptions = [
    { label: t('Inactive'), value: false },
    { label: t('active'), value: true },
  ];

  const practitionersSelectOptions = getPractitionerOptions(practitioners);
  const validationRules = validationRulesFactory(t);

  return (
    <Form
      {...formItemLayout}
      onFinish={(values) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <FormItem name={id} label={t('Id')} id="id" hidden={true}>
        <Input />
      </FormItem>

      <FormItem name={identifier} label={t('Identifier')} id="identifier" hidden={true}>
        <Input />
      </FormItem>

      <FormItem name={name} rules={validationRules.name} id="name" label={t('Name')}>
        <Input placeholder={t('Enter team name')} />
      </FormItem>

      <FormItem name={alias} rules={validationRules.alias} id="alias" label={t('Alias')}>
        <Input placeholder={t('Enter team alias')} />
      </FormItem>

      <FormItem id="status" name={active} label="Status" rules={validationRules.status}>
        <Radio.Group disabled={disabled.includes(active)} options={statusOptions}></Radio.Group>
      </FormItem>

      <FormItem id="type" name={type} label="Type" rules={validationRules.type}>
        <Select disabled={disabled.includes(type)} options={getOrgTypeSelectOptions()}></Select>
      </FormItem>

      <FormItem
        id="members"
        name={members}
        label={t('Practitioners')}
        rules={validationRules.members}
      >
        <Select
          allowClear
          mode="multiple"
          optionFilterProp="label"
          placeholder={t('Select user (practitioners only)')}
          options={practitionersSelectOptions}
          filterOption={practitionersFilterFunction as SelectProps<SelectOption[]>['filterOption']}
        />
      </FormItem>

      <FormItem {...tailLayout}>
        <Space>
          <Button type="primary" id="submit-button" disabled={isLoading} htmlType="submit">
            {isLoading ? t('Saving') : t('save')}
          </Button>
          <Button
            id="cancel-button"
            onClick={() => {
              goTo(cancelUrl);
            }}
          >
            {t('Cancel')}
          </Button>
        </Space>
      </FormItem>
    </Form>
  );
};

OrganizationForm.defaultProps = defaultProps;

export { OrganizationForm };
