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
import lang from '../../lang';
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

const { Item: FormItem } = Form;

// TODO - dry this out, does not need to change across packages.
/** responsive layout for the form labels and columns */
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
    md: {
      span: 4,
    },
    lg: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 18,
    },
    md: {
      span: 16,
    },
    lg: {
      span: 14,
    },
  },
};

const tailLayout = {
  wrapperCol: {
    xs: { offset: 0, span: 16 },
    sm: { offset: 12, span: 24 },
    md: { offset: 8, span: 16 },
    lg: { offset: 6, span: 14 },
  },
};

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
  const goTo = (url = '#') => history.push(url);

  const { mutate, isLoading } = useMutation(
    (values: OrganizationFormFields) => {
      const payload = generateOrgPayload(values);
      return postPutOrganization(fhirBaseUrl, payload).then((organization) => {
        sendSuccessNotification('Organization updated successfully');
        updatePractitionerRoles(
          fhirBaseUrl,
          values,
          initialValues,
          organization,
          practitioners,
          existingPractitionerRoles
        )
          .then(() => {
            sendSuccessNotification('Practitioner assignments updated successfully');
          })
          .catch(() => {
            throw new Error('Failed to update practitioner assignments');
          });
      });
    },
    {
      onError: (err: Error) => {
        sendErrorNotification(err.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries([organizationResourceType]).catch((err) => {
          sendInfoNotification('Failed to refresh data, please refresh the page');
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
    { label: 'Inactive', value: false },
    { label: 'active', value: true },
  ];

  const practitionersSelectOptions = getPractitionerOptions(practitioners);
  const validationRules = validationRulesFactory();

  return (
    <Form
      {...formItemLayout}
      onFinish={(values) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <FormItem name={id} label="Id" id="id" hidden={true}>
        <Input />
      </FormItem>

      <FormItem name={identifier} label="Identifier" id="identifier" hidden={true}>
        <Input />
      </FormItem>

      <FormItem name={name} rules={validationRules.name} id="name" label="Name">
        <Input placeholder="Enter team name" />
      </FormItem>

      <FormItem name={alias} rules={validationRules.alias} id="alias" label="Alias">
        <Input placeholder="Enter team alias" />
      </FormItem>

      <FormItem id="status" name={active} label="Status" rules={validationRules.status}>
        <Radio.Group disabled={disabled.includes(active)} options={statusOptions}></Radio.Group>
      </FormItem>

      <FormItem id="type" name={type} label="Type" rules={validationRules.type}>
        <Select disabled={disabled.includes(type)} options={getOrgTypeSelectOptions()}></Select>
      </FormItem>

      <FormItem id="members" name={members} label="Practitioners" rules={validationRules.members}>
        <Select
          allowClear
          mode="multiple"
          optionFilterProp="label"
          placeholder={lang.SELECT_PRACTITIONER}
          options={practitionersSelectOptions}
          filterOption={practitionersFilterFunction as SelectProps<SelectOption[]>['filterOption']}
        />
      </FormItem>

      <FormItem {...tailLayout}>
        <Space>
          <Button type="primary" id="submit-button" disabled={isLoading} htmlType="submit">
            {isLoading ? 'Saving' : 'save'}
          </Button>
          <Button
            id="cancel-button"
            onClick={() => {
              goTo(cancelUrl);
            }}
          >
            {lang.CANCEL}
          </Button>
        </Space>
      </FormItem>
    </Form>
  );
};

OrganizationForm.defaultProps = defaultProps;

export { OrganizationForm };
