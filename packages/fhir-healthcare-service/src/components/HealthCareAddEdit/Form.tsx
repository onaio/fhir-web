import React from 'react';
import { Select, Button, Form, Radio, Input, Space } from 'antd';
import {
  healthCareServiceResourceType,
  extraDetails,
  providedBy,
  active,
  comment,
  name,
  id,
  identifier,
} from '../../constants';
import {
  sendSuccessNotification,
  sendErrorNotification,
  sendInfoNotification,
} from '@opensrp/notifications';
import { useQueryClient, useMutation } from 'react-query';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { useHistory } from 'react-router';
import {
  generateHealthCarePayload,
  getOrgSelectOptions,
  HealthCareFormFields,
  orgFilterFunction,
  postPutHealthCareService,
  SelectOption,
  validationRulesFactory,
} from './utils';
import { SelectProps } from 'antd/lib/select';

const { Item: FormItem } = Form;

interface HealthCareFormProps {
  fhirBaseUrl: string;
  initialValues: HealthCareFormFields;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
  organizations: IOrganization[];
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

const HealthCareForm = (props: HealthCareFormProps) => {
  const { fhirBaseUrl, initialValues, disabled, cancelUrl, successUrl, organizations } = props;

  const queryClient = useQueryClient();
  const history = useHistory();
  const goTo = (url = '#') => history.push(url);

  const { mutate, isLoading } = useMutation(
    (values: HealthCareFormFields) => {
      const payload = generateHealthCarePayload(values, organizations, initialValues);
      return postPutHealthCareService(fhirBaseUrl, payload);
    },
    {
      onError: (err: Error) => {
        sendErrorNotification(err.message);
      },
      onSuccess: () => {
        sendSuccessNotification('Health care service updated successfully');
        queryClient.invalidateQueries([healthCareServiceResourceType]).catch(() => {
          sendInfoNotification('Failed to refresh data, please refresh the page');
        });
        goTo(successUrl);
      },
    }
  );

  const statusOptions = [
    { label: 'Inactive', value: false },
    { label: 'active', value: true },
  ];

  const orgOptions = getOrgSelectOptions(organizations);
  const validationRules = validationRulesFactory();

  return (
    <Form
      requiredMark={false}
      {...formItemLayout}
      onFinish={(values: HealthCareFormFields) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <FormItem id="id" name={id} label="Id">
        <Input disabled={true} />
      </FormItem>

      <FormItem id="identifier" name={identifier} label="Identifier">
        <Input disabled={true} />
      </FormItem>

      <FormItem id="name" name={name} rules={validationRules.name} label="Name">
        <Input disabled={disabled.includes(name)} placeholder={'Name'} />
      </FormItem>

      <FormItem id="active" rules={validationRules.active} name={active} label="Status">
        <Radio.Group disabled={disabled.includes(active)} options={statusOptions}></Radio.Group>
      </FormItem>

      <FormItem id="comment" rules={validationRules.comment} name={comment} label="Comment">
        <Input.TextArea
          disabled={disabled.includes(comment)}
          rows={2}
          placeholder="Enter comment"
        />
      </FormItem>

      <FormItem
        id="extraDetails"
        rules={validationRules.extraDetails}
        name={extraDetails}
        label="Extra details"
      >
        <Input.TextArea
          disabled={disabled.includes(extraDetails)}
          rows={4}
          placeholder="Enter extra details"
        />
      </FormItem>

      <FormItem
        id="providedBy"
        name={providedBy}
        rules={validationRules.providedBy}
        label="Provided by"
      >
        <Select
          disabled={disabled.includes(providedBy)}
          placeholder="Select organization"
          options={orgOptions}
          allowClear={true}
          showSearch={true}
          filterOption={orgFilterFunction as SelectProps<SelectOption[]>['filterOption']}
        ></Select>
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
            Cancel
          </Button>
        </Space>
      </FormItem>
    </Form>
  );
};

HealthCareForm.defaultProps = defaultProps;

export { HealthCareForm };
