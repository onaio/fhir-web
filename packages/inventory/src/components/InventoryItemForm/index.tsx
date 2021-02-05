import React, { useEffect } from 'react';
import moment from 'moment';
import { Form, Button, Input, DatePicker, Select } from 'antd';
import { useHistory } from 'react-router';
import { getFetchOptions } from '@opensrp/server-service';
import {
  ACCOUNTABILITY_END_DATE,
  CANCEL,
  DELIVERY_DATE,
  DONOR,
  ERROR_ACCOUNTABILITY_DATE_REQUIRED,
  ERROR_DELIVERY_DATE_REQUIRED,
  ERROR_PO_NUMBER_REQUIRED,
  ERROR_PRODUCT_NAME_REQUIRED,
  ERROR_UNICEF_SECTION_REQUIRED,
  OPTIONAL,
  PO_NUMBER,
  PRODUCT,
  QUANTITY,
  SAVE,
  SAVING,
  SELECT,
  UNICEF_SECTION,
} from '../../lang';
import { ProductCatalogue } from '@opensrp/product-catalogue';

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

/** component props */
export interface InventoryItemFormProps {
  cancelURL: string;
  products: ProductCatalogue[];
  UNICEFSections: Setting[];
  donors: Setting[];
  customFetchOptions?: typeof getFetchOptions;
}

/** default component props */
export const defaultInventoryFormProps: InventoryItemFormProps = {
  cancelURL: '',
  products: [],
  donors: [],
  UNICEFSections: [],
};

/** interface form fields */
export interface InventoryItemFormFields {
  productName: string | undefined;
  quantity: string;
  deliveryDate: moment.Moment | null;
  accountabilityEndDate: moment.Moment | null;
  unicefSection: string | undefined;
  donor: string | undefined;
  poNumber: string;
}

/** default form initial values */
export const initialValues: InventoryItemFormFields = {
  productName: undefined,
  quantity: '',
  deliveryDate: null,
  accountabilityEndDate: null,
  unicefSection: undefined,
  donor: undefined,
  poNumber: '',
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
  const { cancelURL, UNICEFSections, donors, products } = props;
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = React.useState<ProductCatalogue | null>(null);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = React.useState<moment.Moment | null>(
    null
  );
  const history = useHistory();

  useEffect(() => {
    if (selectedProduct && selectedDeliveryDate) {
      /**
       * Auto-calculate accountability end date by adding the product
       * accountability period (in months) to the entered delivery date
       */
    }
  }, [selectedProduct, selectedDeliveryDate]);

  const handleProductChange = (value: number) => {
    const selected = products.find((product) => product.uniqueId === value);

    if (selected) {
      setSelectedProduct(selected);
    }
  };

  const handleDeliveryDateChange = (date: moment.Moment | null, _: string) => {
    setSelectedDeliveryDate(date);
  };

  return (
    <Form {...layout} initialValues={initialValues}>
      <Form.Item
        name="productName"
        id="productName"
        label={PRODUCT}
        rules={[{ required: true, message: ERROR_PRODUCT_NAME_REQUIRED }]}
      >
        <Select placeholder={SELECT} onChange={handleProductChange}>
          {products.map((product: ProductCatalogue) => (
            <Select.Option key={product.uniqueId} value={product.uniqueId}>
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
        rules={[{ type: 'number', required: true, message: ERROR_PO_NUMBER_REQUIRED }]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          {isSubmitting ? SAVING : SAVE}
        </Button>
        <Button onClick={() => history.push(cancelURL)}>{CANCEL}</Button>
      </Form.Item>
    </Form>
  );
};

InventoryItemForm.defaultProps = defaultInventoryFormProps;

export { InventoryItemForm };
