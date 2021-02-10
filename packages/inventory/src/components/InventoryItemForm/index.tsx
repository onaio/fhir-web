import React, { useEffect } from 'react';
import moment from 'moment';
import { Form, Button, Input, DatePicker, Select, Card } from 'antd';
import { Redirect, useHistory } from 'react-router';
import { getFetchOptions } from '@opensrp/server-service';
import {
  ACCOUNTABILITY_END_DATE,
  CANCEL,
  DELIVERY_DATE,
  DONOR,
  ERROR_ACCOUNTABILITY_DATE_REQUIRED,
  ERROR_DELIVERY_DATE_REQUIRED,
  ERROR_GENERIC,
  ERROR_PO_NUMBER_REQUIRED,
  ERROR_PRODUCT_NAME_REQUIRED,
  ERROR_SERIAL_NUMBER_REQUIRED,
  ERROR_UNICEF_SECTION_REQUIRED,
  OPTIONAL,
  PO_NUMBER,
  PRODUCT,
  QUANTITY,
  SAVE,
  SAVING,
  SELECT,
  SERIAL_NUMBER,
  UNICEF_SECTION,
} from '../../lang';
import { ProductCatalogue } from '@opensrp/product-catalogue';
import { InventoryItemPayloadPOST, submitForm } from './utils';
import { sendErrorNotification } from '@opensrp/notifications';

/** interface for setting **/
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
  serialNumber?: string;
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
  const [selectedProduct, setSelectedProduct] = React.useState<ProductCatalogue | null>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = React.useState<moment.Moment | null>(
    null
  );
  const [ifDoneHere, setIfDoneHere] = React.useState(false);
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    if (selectedProduct && selectedDeliveryDate) {
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
  }, [selectedProduct, selectedDeliveryDate, form]);

  /** Update form initial values when initialValues prop changes, without this
   * the form fields initial values will not change if props.initiaValues is updated
   * **/
  React.useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
    });
  }, [form, initialValues]);

  const handleProductChange = (value: string) => {
    const selected = products.find((product) => product.productName === value);

    if (selected) {
      setSelectedProduct(selected);
    }
  };

  const handleDeliveryDateChange = (date: moment.Moment | null, _: string) => {
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
          let payload: InventoryItemPayloadPOST = {
            productName,
            quantity: parseInt(quantity),
            deliveryDate: deliveryDate.format('YYYY-MM-DD'),
            accountabilityEndDate: accountabilityEndDate.format('YYYY-MM-DD'),
            unicefSection,
            donor,
            poNumber: parseInt(poNumber),
            servicePointId,
          };

          if (serialNumber) {
            payload = {
              ...payload,
              serialNumber,
            };
          }
          submitForm(payload, openSRPBaseURL, setSubmitting, setIfDoneHere, inventoryID).catch(
            () => {
              sendErrorNotification(ERROR_GENERIC);
            }
          );
        }}
      >
        <Form.Item
          name="productName"
          id="productName"
          label={PRODUCT}
          rules={[{ required: true, message: ERROR_PRODUCT_NAME_REQUIRED }]}
        >
          <Select placeholder={SELECT} onChange={handleProductChange}>
            {products.map((product: ProductCatalogue) => (
              <Select.Option key={product.uniqueId} value={product.productName}>
                {product.productName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="quantity" id="quantity" label={`${QUANTITY} (${OPTIONAL})`}>
          <Input />
        </Form.Item>
        <Form.Item
          name="deliveryDate"
          id="deliveryDate"
          label={DELIVERY_DATE}
          rules={[{ required: true, message: ERROR_DELIVERY_DATE_REQUIRED }]}
        >
          <DatePicker
            disabledDate={(current: moment.Moment) => {
              // Cannot select future date
              return current > moment().endOf('day');
            }}
            onChange={handleDeliveryDateChange}
          />
        </Form.Item>
        <Form.Item
          name="accountabilityEndDate"
          id="accountabilityEndDate"
          label={ACCOUNTABILITY_END_DATE}
          rules={[{ required: true, message: ERROR_ACCOUNTABILITY_DATE_REQUIRED }]}
        >
          <DatePicker
            disabledDate={(current: moment.Moment) => {
              // Only select future date
              return current < moment().endOf('day');
            }}
          />
        </Form.Item>
        <Form.Item
          name="unicefSection"
          id="unicefSection"
          label={UNICEF_SECTION}
          rules={[{ required: true, message: ERROR_UNICEF_SECTION_REQUIRED }]}
        >
          <Select placeholder={SELECT}>
            {UNICEFSections.map((option: Setting) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="donor" id="donor" label={`${DONOR} (${OPTIONAL})`}>
          <Select placeholder={SELECT}>
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
          label={PO_NUMBER}
          rules={[{ required: true, message: ERROR_PO_NUMBER_REQUIRED }]}
        >
          <Input />
        </Form.Item>
        {selectedProduct?.isAttractiveItem ? (
          <Form.Item
            name="serialNumber"
            id="serialNumber"
            label={SERIAL_NUMBER}
            rules={[{ required: true, message: ERROR_SERIAL_NUMBER_REQUIRED }]}
          >
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {isSubmitting ? SAVING : SAVE}
          </Button>
          <Button onClick={() => history.push(cancelURL)}>{CANCEL}</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

InventoryItemForm.defaultProps = defaultInventoryFormProps;

export { InventoryItemForm };
