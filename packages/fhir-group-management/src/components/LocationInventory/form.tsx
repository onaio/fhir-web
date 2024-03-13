import React from 'react';
import { Form, Button, Input, DatePicker, Space } from 'antd';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { useQueryClient, useMutation } from 'react-query';
import { Dictionary } from '@onaio/utils';
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
} from '../../constants';

const { Item: FormItem } = Form;

interface LocationInventoryFormProps {
  fhirBaseUrl: string;
  initialValues: Dictionary;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

/**
 * Add location inventory form
 *
 * @param  props - LocationInventoryFormProps component props
 * @returns returns form to add location inventories
 */
const AddLocationInventoryForm = (props: LocationInventoryFormProps) => {
  const { fhirBaseUrl, initialValues } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    (values: Dictionary) => {
      return postLocationInventory(fhirBaseUrl, values);
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

  return (
    <Form
      requiredMark={false}
      {...formItemLayout}
      onFinish={(values: Dictionary) => {
        mutate(values);
      }}
      initialValues={initialValues}
    >
      <FormItem id="productName" name={productName} label={t('Product name')}>
        <Input type="text" />
      </FormItem>

      <FormItem id="quantity" name={quantity} label={t('Quantity')}>
        <Input type="number" />
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

      <FormItem id="expiryDate" name={expiryDate} label={t('Expiry date')}>
        <DatePicker />
      </FormItem>

      <FormItem id="unicefSection" name={unicefSection} label={t('UNICEF section')}>
        <Input />
      </FormItem>

      <FormItem id="serialNumber" name={serialNumber} label={t('Serial Number')}>
        <Input type="number" />
      </FormItem>

      <FormItem id="donor" name={donor} label={t('Donor')}>
        <Input />
      </FormItem>

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
