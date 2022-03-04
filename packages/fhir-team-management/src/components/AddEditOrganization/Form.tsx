import React, { useState } from 'react';
import { Select, Button, Form, Radio, Input, Space } from 'antd';
import { identifier, active, alias, id, name, type, members } from '../../constants';
import { useQueryClient } from 'react-query';
import lang from '../../lang';
import { SelectProps } from 'antd/lib/select';
import {
  getOrgTypeSelectOptions,
  OrganizationFormFields,
  practitionersFilterFunction,
  getPractitionerOptions,
  generateOrgPayload,
  postPutOrganization,
  updatePractitionerRoles,
} from '../../utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';

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
  cancelHandler?: () => void;
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
    cancelHandler,
    practitioners,
    existingPractitionerRoles,
  } = props;
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  return (
    <Form
      {...formItemLayout}
      onFinish={(values) => {
        setIsSubmitting(true);
        const payload = generateOrgPayload(values);
        postPutOrganization(fhirBaseUrl, payload)
          .then((organization) => {
            console.log('Updating organization response', organization);
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
          })
          .catch((err) => {
            sendErrorNotification(err.message);
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }}
      initialValues={initialValues}
    >
      <FormItem name={id} label={'id'} hidden={true}>
        <Input />
      </FormItem>

      <FormItem name={identifier} label={'identifier'} hidden={true}>
        <Input />
      </FormItem>

      <FormItem name={name} rules={[{ required: true, message: lang.REQUIRED_FIELD }]} label="Name">
        <Input placeholder="Enter team name" />
      </FormItem>

      <FormItem
        name={alias}
        rules={[{ required: true, message: lang.REQUIRED_FIELD }]}
        label="Alias"
      >
        <Input placeholder="Enter team name" />
      </FormItem>

      <FormItem name={active} label="status">
        <Radio.Group disabled={disabled.includes(active)} options={statusOptions}></Radio.Group>
      </FormItem>

      <FormItem name={type} label="status">
        <Select
          mode="multiple"
          disabled={disabled.includes(type)}
          options={getOrgTypeSelectOptions()}
        ></Select>
      </FormItem>

      <FormItem
        name={members}
        label="Members"
        rules={[{ required: true, message: lang.REQUIRED_FIELD }]}
      >
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
          <Button
            type="primary"
            id="location-form-submit-button"
            disabled={isSubmitting}
            htmlType="submit"
          >
            {isSubmitting ? lang.SAVING : lang.SAVE}
          </Button>
          <Button id="location-form-cancel-button" onClick={cancelHandler}>
            {lang.CANCEL}
          </Button>
        </Space>
      </FormItem>
    </Form>
  );
};

OrganizationForm.defaultProps = defaultProps;

export { OrganizationForm };
