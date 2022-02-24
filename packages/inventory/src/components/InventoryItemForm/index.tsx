import React, { useEffect } from 'react';
import moment from 'moment';
import { Form, Button, Input, DatePicker, Select, Card } from 'antd';
import { Redirect, useHistory } from 'react-router';
import { getFetchOptions } from '@opensrp/server-service';
import lang from '../../lang';
import { ProductCatalogue } from '@opensrp/product-catalogue';
import { isDateFuture, isDatePastOrToday, submitForm } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { InventoryPost } from '../../ducks/inventory';

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
  deliveryDate: moment.Moment | null;
  accountabilityEndDate: moment.Moment | null;
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
  const [selectedDeliveryDate, setSelectedDeliveryDate] = React.useState<moment.Moment | null>(
    null
  );
  const [ifDoneHere, setIfDoneHere] = React.useState<boolean>(false);
  const [isProductChanged, setProductChanged] = React.useState<boolean>(false);
  const [isDeliveryDateChanged, setDeliveryDateChanged] = React.useState<boolean>(false);
  const history = useHistory();
  const [form] = Form.useForm();

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
      const accEndDate = moment(selectedDeliveryDate.format('YYYY-MM-DD')).add(
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

  const handleDeliveryDateChange = (date: moment.Moment | null, _: string) => {
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

          submitForm(payload, openSRPBaseURL, setSubmitting, setIfDoneHere, inventoryID).catch(
            (_: Error) => {
              sendErrorNotification(lang.ERROR_GENERIC);
            }
          );
        }}
      >
        <Form.Item
          name="productName"
          id="productName"
          label={lang.PRODUCT}
          rules={[{ required: true, message: lang.ERROR_PRODUCT_NAME_REQUIRED }]}
        >
          <Select placeholder={lang.SELECT} onChange={handleProductChange} disabled={!!inventoryID}>
            {products.map((product: ProductCatalogue) => (
              <Select.Option key={product.uniqueId} value={product.productName}>
                {product.productName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="quantity" id="quantity" label={`${lang.QUANTITY} (${lang.OPTIONAL})`}>
          <Input />
        </Form.Item>
        <Form.Item
          name="deliveryDate"
          id="deliveryDate"
          label={lang.DELIVERY_DATE}
          rules={[{ required: true, message: lang.ERROR_DELIVERY_DATE_REQUIRED }]}
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
          label={lang.ACCOUNTABILITY_END_DATE}
          rules={[{ required: true, message: lang.ERROR_ACCOUNTABILITY_DATE_REQUIRED }]}
        >
          <DatePicker
            // Cannot select today or past dates
            disabledDate={isDatePastOrToday}
          />
        </Form.Item>
        <Form.Item
          name="unicefSection"
          id="unicefSection"
          label={lang.UNICEF_SECTION}
          rules={[{ required: true, message: lang.ERROR_UNICEF_SECTION_REQUIRED }]}
        >
          <Select placeholder={lang.SELECT}>
            {UNICEFSections.map((option: Setting) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="donor" id="donor" label={`${lang.DONOR} (${lang.OPTIONAL})`}>
          <Select placeholder={lang.SELECT}>
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
          label={lang.PO_NUMBER}
          rules={[{ required: true, message: lang.ERROR_PO_NUMBER_REQUIRED }]}
        >
          <Input />
        </Form.Item>
        {selectedProduct?.isAttractiveItem ? (
          <Form.Item
            name="serialNumber"
            id="serialNumber"
            label={lang.SERIAL_NUMBER}
            rules={[{ required: true, message: lang.ERROR_SERIAL_NUMBER_REQUIRED }]}
          >
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {isSubmitting ? lang.SAVING : lang.SAVE}
          </Button>
          <Button onClick={() => history.push(cancelURL)}>{lang.CANCEL}</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

InventoryItemForm.defaultProps = defaultInventoryFormProps;

export { InventoryItemForm };
