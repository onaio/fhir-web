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
import { useTranslation } from '../../mls';

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
  const { t } = useTranslation();
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
        sendSuccessNotification(t('Health care service updated successfully'));
        queryClient.invalidateQueries([healthCareServiceResourceType]).catch(() => {
          sendInfoNotification(t('Failed to refresh data, please refresh the page'));
        });
        goTo(successUrl);
      },
    }
  );

  const statusOptions = [
    { label: t('Inactive'), value: false },
    { label: t('active'), value: true },
  ];

  const orgOptions = getOrgSelectOptions(organizations);
  const validationRules = validationRulesFactory(t);

  return (
    <Form
      requiredMark={false}
      {...formItemLayout}
      onFinish={(values: HealthCareFormFields) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <FormItem hidden={true} id="id" name={id} label={t('Id')}>
        <Input disabled={true} />
      </FormItem>

      <FormItem hidden={true} id="identifier" name={identifier} label={t('Identifier')}>
        <Input disabled={true} />
      </FormItem>

      <FormItem
        id="name"
        name={name}
        className="name"
        rules={validationRules.name}
        label={t('Name')}
      >
        <Input disabled={disabled.includes(name)} placeholder={t('Name')} />
      </FormItem>

      <FormItem
        id="active"
        className="active"
        rules={validationRules.active}
        name={active}
        label={t('Status')}
      >
        <Radio.Group disabled={disabled.includes(active)} options={statusOptions}></Radio.Group>
      </FormItem>

      <FormItem
        id="comment"
        className="comment"
        rules={validationRules.comment}
        name={comment}
        label={t('Comment')}
      >
        <Input.TextArea
          disabled={disabled.includes(comment)}
          rows={2}
          placeholder={t('Enter comment')}
        />
      </FormItem>

      <FormItem
        className="extraDetails"
        id="extraDetails"
        rules={validationRules.extraDetails}
        name={extraDetails}
        label={t('Extra details')}
      >
        <Input.TextArea
          disabled={disabled.includes(extraDetails)}
          rows={4}
          placeholder={t('Enter extra details')}
        />
      </FormItem>

      <FormItem
        className="providedBy"
        id="providedBy"
        name={providedBy}
        rules={validationRules.providedBy}
        label={t('Provided by')}
      >
        <Select
          disabled={disabled.includes(providedBy)}
          placeholder={t('Select organization')}
          options={orgOptions}
          showSearch={true}
          filterOption={orgFilterFunction as SelectProps<SelectOption[]>['filterOption']}
        ></Select>
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

HealthCareForm.defaultProps = defaultProps;

export { HealthCareForm };
