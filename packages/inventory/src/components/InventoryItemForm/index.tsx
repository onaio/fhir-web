import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { Form, Button, Input, DatePicker, Select, Card } from 'antd';
import { Redirect, useHistory } from 'react-router';
import { getFetchOptions } from '@opensrp/server-service';
import { ProductCatalogue } from '@opensrp/product-catalogue';
import { isDateFuture, isDatePastOrToday, submitForm } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { InventoryPost } from '../../ducks/inventory';
import { useTranslation } from '../../mls';

/** interface for setting */
export interface Setting {
  key: string;
  value: string;
  label: string;
  description: string;
  uuid: string;
  settingsId: string;
  settingIdentifier: string;
  settingMetadataId: string;
  v1Settings: boolean;
  resolveSettings: boolean;
  documentId: string;
  serverVersion: number;
  type: string;
}
/** interface form fields */
export interface InventoryItemFormFields {
  productName: string | undefined;
  quantity: number | string;
  deliveryDate: dayjs.Dayjs | null;
  accountabilityEndDate: dayjs.Dayjs | null;
  unicefSection: string | undefined;
  donor: string | undefined;
  poNumber: number | string;
  serialNumber?: string | number;
}

/** component props */
export interface InventoryItemFormProps {
  initialValues: InventoryItemFormFields;
  openSRPBaseURL: string; // OpenSRP API base URL
  cancelURL: string; // URL to redirect after pressing cancel button
  redirectURL: string; // URL to redirect to after successful submission
  products: ProductCatalogue[]; // List of products to select from
  UNICEFSections: Setting[]; // List of UNICEF office sections to select the one which procurred the product
  donors: Setting[]; // List of donors to select one who provided the funding
  servicePointId: string; // Service point id to add inventory to
  customFetchOptions?: typeof getFetchOptions; // custom OpenSRP fetch options
  inventoryID?: string; // ID of inventory item to edit
}

/** default form initial values */
export const defaultInitialValues: InventoryItemFormFields = {
  productName: undefined,
  quantity: '',
  deliveryDate: null,
  accountabilityEndDate: null,
  unicefSection: undefined,
  donor: undefined,
  poNumber: '',
};

/** default component props */
export const defaultInventoryFormProps = {
  openSRPBaseURL: '',
  cancelURL: '',
  redirectURL: '',
  products: [],
  donors: [],
  UNICEFSections: [],
  initialValues: defaultInitialValues,
};

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

const InventoryItemForm: React.FC<InventoryItemFormProps> = (props: InventoryItemFormProps) => {
  const {
    cancelURL,
    UNICEFSections,
    donors,
    products,
    openSRPBaseURL,
    redirectURL,
    servicePointId,
    initialValues,
    inventoryID,
  } = props;

  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductCatalogue | undefined>(
    undefined
  );
  const [selectedDeliveryDate, setSelectedDeliveryDate] = React.useState<dayjs.Dayjs | null>(null);
  const [ifDoneHere, setIfDoneHere] = React.useState<boolean>(false);
  const [isProductChanged, setProductChanged] = React.useState<boolean>(false);
  const [isDeliveryDateChanged, setDeliveryDateChanged] = React.useState<boolean>(false);
  const history = useHistory();
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    if (
      selectedProduct &&
      selectedDeliveryDate &&
      // Make sure we do not update accountabilityEndDate during form initialization
      (isProductChanged || isDeliveryDateChanged)
    ) {
      /**
       * Auto-calculate accountability end date by adding the product
       * accountability period (in months) to the entered delivery date
       */
      const accEndDate = dayjs(selectedDeliveryDate.format('YYYY-MM-DD')).add(
        selectedProduct.accountabilityPeriod,
        'months'
      );
      form.setFieldsValue({
        accountabilityEndDate: accEndDate,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, selectedDeliveryDate, form]);

  /**
   * Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initiaValues is updated
   *
   */
  React.useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
    });
    const { productName, deliveryDate } = initialValues;
    // When props.initialValues change, update selected product
    const selected = products.find((product) => product.productName === productName);
    setSelectedProduct(selected);

    // when props.initialValues change, updated selected date
    setSelectedDeliveryDate(deliveryDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, initialValues]);

  const handleProductChange = (value: string) => {
    if (!isProductChanged) setProductChanged(true);
    const selected = products.find((product) => product.productName === value);
    setSelectedProduct(selected);
  };

  const handleDeliveryDateChange = (date: dayjs.Dayjs | null, _: string) => {
    if (!isDeliveryDateChanged) setDeliveryDateChanged(true);
    setSelectedDeliveryDate(date);
  };

  if (ifDoneHere) {
    return <Redirect to={redirectURL} />;
  }

  return (
    <Card>
      <Form
        form={form}
        {...layout}
        initialValues={initialValues}
        onFinish={(values) => {
          const {
            poNumber,
            productName,
            accountabilityEndDate,
            deliveryDate,
            donor,
            quantity,
            unicefSection,
            serialNumber,
          } = values;
          let payload: InventoryPost = {
            productName,
            deliveryDate: deliveryDate.format('YYYY-MM-DD'),
            accountabilityEndDate: accountabilityEndDate.format('YYYY-MM-DD'),
            unicefSection,
            donor,
            poNumber,
            servicePointId,
          };

          if (serialNumber) {
            payload = {
              ...payload,
              serialNumber,
            };
          }

          if (quantity) {
            payload = {
              ...payload,
              quantity,
            };
          }

          submitForm(payload, openSRPBaseURL, setSubmitting, setIfDoneHere, t, inventoryID).catch(
            (_: Error) => {
              sendErrorNotification(t('An error occurred'));
            }
          );
        }}
      >
        <Form.Item
          name="productName"
          id="productName"
          label={t('Product')}
          rules={[{ required: true, message: t('Product is required') }]}
        >
          <Select placeholder={t('Select')} onChange={handleProductChange} disabled={!!inventoryID}>
            {products.map((product: ProductCatalogue) => (
              <Select.Option key={product.uniqueId} value={product.productName}>
                {product.productName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="quantity" id="quantity" label={`${t('Quantity (Optional)')}`}>
          <Input />
        </Form.Item>
        <Form.Item
          name="deliveryDate"
          id="deliveryDate"
          label={t('Delivery date')}
          rules={[{ required: true, message: t('Delivery date is required') }]}
        >
          <DatePicker
            // Cannot select future date
            disabledDate={isDateFuture}
            onChange={handleDeliveryDateChange}
          />
        </Form.Item>
        <Form.Item
          name="accountabilityEndDate"
          id="accountabilityEndDate"
          label={t('Accountability end date')}
          rules={[{ required: true, message: t('Accountability end date is required') }]}
        >
          <DatePicker
            // Cannot select today or past dates
            disabledDate={isDatePastOrToday}
          />
        </Form.Item>
        <Form.Item
          name="unicefSection"
          id="unicefSection"
          label={t('UNICEF section')}
          rules={[{ required: true, message: t('UNICEF section is required') }]}
        >
          <Select placeholder={t('Select')}>
            {UNICEFSections.map((option: Setting) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="donor" id="donor" label={t('Donor')}>
          <Select placeholder={t('Select')}>
            {donors.map((option: Setting) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="poNumber"
          id="poNumber"
          label={t('PO number')}
          rules={[{ required: true, message: t('PO number is required') }]}
        >
          <Input />
        </Form.Item>
        {selectedProduct?.isAttractiveItem ? (
          <Form.Item
            name="serialNumber"
            id="serialNumber"
            label={t('Serial number')}
            rules={[{ required: true, message: t('Serial number is required') }]}
          >
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {isSubmitting ? t('Saving') : t('Save')}
          </Button>
          <Button onClick={() => history.push(cancelURL)}>{t('Cancel')}</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

InventoryItemForm.defaultProps = defaultInventoryFormProps;

export { InventoryItemForm };
