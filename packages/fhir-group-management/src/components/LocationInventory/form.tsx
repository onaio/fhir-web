import React from 'react';
import { Form, Button, Input, DatePicker, Space } from 'antd';
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
  productName,
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
} from '../../constants';
import { groupSelectfilterFunction, SelectOption } from '../ProductForm/utils';
import { FHIRServiceClass, AsyncSelect } from '@opensrp/react-utils';
import { IValueSet } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IValueSet';
import { getValuesetSelectOptions, projectOptions } from './utils';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

const { Item: FormItem } = Form;

export interface LocationInventoryFormProps {
  fhirBaseURL: string;
  initialValues: Dictionary;
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
    (values: Dictionary) => {
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

  const unicefSectionProps: AsyncSelectProps<IValueSet> = {
    id: 'unicefSection',
    name: unicefSection,
    label: t('UNICEF section'),
    optionsGetter: getValuesetSelectOptions,
    selectProps: {
      placeholder: t('Select section'),
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
    name: productName,
    label: t('Product name'),
    optionsGetter: projectOptions,
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
      onFinish={(values: Dictionary) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      {/* <FormItem id="productName" name={productName} label={t('Product name')}>
        <Select
          placeholder={t('Select product')}
          options={projectOptions}
          showSearch={true}
          filterOption={groupSelectfilterFunction as SelectProps<SelectOption[]>['filterOption']}
        />
      </FormItem> */}

      <AsyncSelect {...projectsSelectProps} />

      <FormItem id="quantity" name={quantity} label={t('Quantity (Optional)')}>
        <Input required={false} type="number" />
      </FormItem>

      <FormItem id="deliveryDate" name={deliveryDate} label={t('Delivery date')}>
        <DatePicker />
      </FormItem>

      <FormItem
        id="accounterbilityEndDate"
        name={accountabilityEndDate}
        label={t('Accountability end date')}
      >
        <DatePicker />
      </FormItem>

      <FormItem id="expiryDate" name={expiryDate} label={t('Expiry date (Optional)')}>
        <DatePicker />
      </FormItem>

      <AsyncSelect {...unicefSectionProps} />

      <FormItem id="serialNumber" name={serialNumber} label={t('Serial Number')}>
        <Input type="number" />
      </FormItem>

      <AsyncSelect {...donorSelectProps} />

      <FormItem id="poNumber" name={PONumber} label={t('PO number')}>
        <Input type="number" />
      </FormItem>

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
