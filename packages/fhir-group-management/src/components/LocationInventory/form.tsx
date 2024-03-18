import React from 'react';
import { Form, Button, Input, DatePicker, Space, Switch, InputNumber } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { AsyncSelectProps, formItemLayout, tailLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { useQueryClient, useMutation } from 'react-query';
import { Dictionary } from '@onaio/utils';
import { supplyMgSnomedCode, snomedCodeSystem } from '../../helpers/utils';
import {
  sendSuccessNotification,
  sendErrorNotification,
  sendInfoNotification,
} from '@opensrp/notifications';
import {
  product,
  quantity,
  deliveryDate,
  accountabilityEndDate,
  expiryDate,
  unicefSection,
  serialNumber,
  donor,
  PONumber,
  groupResourceType,
  valuesetResourceType,
  UNICEF_SECTION_ENDPOINT,
  id,
  identifier,
  active,
  name,
  type,
  actual,
} from '../../constants';
import { groupSelectfilterFunction, SelectOption } from '../ProductForm/utils';
import { FHIRServiceClass, AsyncSelect } from '@opensrp/react-utils';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import {
  getLocationInventoryPayload,
  getValuesetSelectOptions,
  handleDisabledFutureDates,
  handleDisabledPastDates,
  projectOptions,
  validationRulesFactory,
} from './utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';
import { GroupFormFields } from './types';

const { Item: FormItem } = Form;

export interface LocationInventoryFormProps {
  fhirBaseURL: string;
  initialValues: GroupFormFields;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

const productQueryFilters = {
  code: `${snomedCodeSystem}|${supplyMgSnomedCode}`,
};

/**
 * Add location inventory form
 *
 * @param  props - LocationInventoryFormProps component props
 * @returns returns form to add location inventories
 */
const AddLocationInventoryForm = (props: LocationInventoryFormProps) => {
  const { fhirBaseURL, initialValues } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (values: GroupFormFields) => {
      const payload = getLocationInventoryPayload(values);
      return postLocationInventory(fhirBaseURL, values);
    },
    {
      onError: (error: Error) => {
        sendErrorNotification(error.message);
      },
      onSuccess: () => {
        sendSuccessNotification(t('Location inventory created successfully'));
        queryClient.invalidateQueries([groupResourceType]).catch(() => {
          sendInfoNotification(t('Failed to refresh data, please refresh the page'));
        });
      },
    }
  );

  const validationRules = validationRulesFactory(t);

  const unicefSectionProps: AsyncSelectProps<IValueSet> = {
    id: 'unicefSection',
    name: unicefSection,
    label: t('UNICEF section'),
    optionsGetter: getValuesetSelectOptions,
    rules: validationRules[unicefSection],
    selectProps: {
      placeholder: t('Select UNICEF section'),
      showSearch: true,
      filterOption: groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption'],
    },
    useQueryParams: {
      key: [valuesetResourceType, UNICEF_SECTION_ENDPOINT],
      queryFn: async () =>
        new FHIRServiceClass<IValueSet>(fhirBaseURL, valuesetResourceType).read(
          UNICEF_SECTION_ENDPOINT as string
        ),
    },
  };

  const donorSelectProps: AsyncSelectProps<IValueSet> = {
    id: 'donor',
    name: donor,
    label: t('Donor'),
    optionsGetter: getValuesetSelectOptions,
    selectProps: {
      placeholder: t('Select donor'),
      showSearch: true,
      filterOption: groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption'],
    },
    useQueryParams: {
      key: [valuesetResourceType, UNICEF_SECTION_ENDPOINT],
      queryFn: async () =>
        new FHIRServiceClass<IValueSet>(fhirBaseURL, valuesetResourceType).read(
          UNICEF_SECTION_ENDPOINT as string
        ),
    },
  };

  const projectsSelectProps: AsyncSelectProps<IBundle> = {
    id: 'project',
    name: product,
    label: t('Product name'),
    optionsGetter: projectOptions,
    rules: validationRules[product],
    selectProps: {
      placeholder: t('Select product'),
      showSearch: true,
      filterOption: groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption'],
    },
    useQueryParams: {
      key: [groupResourceType],
      queryFn: async () =>
        new FHIRServiceClass<IBundle>(fhirBaseURL, groupResourceType).list(productQueryFilters),
    },
  };

  return (
    <Form
      requiredMark={false}
      {...formItemLayout}
      onFinish={(values: GroupFormFields) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <AsyncSelect {...projectsSelectProps} />

      <FormItem id="quantity" name={quantity} label={t('Quantity (Optional)')}>
        <Input placeholder={t('Quantity')} type="number" />
      </FormItem>

      <FormItem
        id="deliveryDate"
        rules={validationRules[deliveryDate]}
        name={deliveryDate}
        label={t('Delivery date')}
      >
        <DatePicker disabledDate={handleDisabledFutureDates} />
      </FormItem>

      <FormItem
        id="accounterbilityEndDate"
        name={accountabilityEndDate}
        label={t('Accountability end date')}
        rules={validationRules[accountabilityEndDate]}
      >
        <DatePicker disabledDate={handleDisabledPastDates} />
      </FormItem>

      <FormItem id="expiryDate" name={expiryDate} label={t('Expiry date (Optional)')}>
        <DatePicker disabledDate={handleDisabledPastDates} />
      </FormItem>

      <AsyncSelect {...unicefSectionProps} />

      <FormItem
        id="serialNumber"
        rules={validationRules[serialNumber]}
        name={serialNumber}
        label={t('Serial number')}
      >
        <InputNumber placeholder={t('Serial number')} style={{ width: '100%' }} />
      </FormItem>

      <AsyncSelect {...donorSelectProps} />

      <FormItem
        id="poNumber"
        rules={validationRules[PONumber]}
        name={PONumber}
        label={t('PO number')}
      >
        <InputNumber placeholder={t('PO number')} style={{ width: '100%' }} />
      </FormItem>

      {/* start hidden fields */}
      <FormItem hidden={true} id="id" name={id} label={t('Commodity Id')}>
        <Input disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="identifier" name={identifier} label={t('Identifier')}>
        <Input disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="active" name={active} label={t('Active')}>
        <Switch checked={initialValues.active} disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="actual" name={actual} label={t('Actual')}>
        <Switch checked={initialValues.actual} disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="name" name={name} label={t('Name')}>
        <Input disabled={true} />
      </FormItem>
      <FormItem hidden={true} id="type" name={type} label={t('Type')}>
        <Input disabled={true} />
      </FormItem>
      {/* End hidden fields */}

      <FormItem {...tailLayout}>
        <Space>
          {/* todo: might remove cancel btn */}
          <Button type="primary" id="submit-button" disabled={isLoading} htmlType="submit">
            {isLoading ? t('Saving') : t('save')}
          </Button>
          <Button id="cancel-button">{t('Cancel')}</Button>
        </Space>
      </FormItem>
    </Form>
  );
};

AddLocationInventoryForm.defaultProps = defaultProps;

export { AddLocationInventoryForm };

// to remove
/**
 * @param fhirBaseUrl - base url
 * @param values - values
 */
function postLocationInventory(fhirBaseUrl: string, values: Dictionary): Promise<unknown> {
  console.log(values);
  console.log(fhirBaseUrl);
  throw new Error('Function not implemented.');
}
