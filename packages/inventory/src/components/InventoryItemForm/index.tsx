import React, { Dispatch, SetStateAction } from 'react';
import moment from 'moment';
import { Form, Button, Input, DatePicker, Select } from 'antd';
import { useHistory } from 'react-router';
import { ControlledProductSelect, OpenSRPService, OptionValueProperty } from '@opensrp/react-utils';
import {
  ACCOUNTABILITY_END_DATE,
  CANCEL,
  DELIVERY_DATE,
  ERROR_ACCOUNTABILITY_DATE_REQUIRED,
  ERROR_DELIVERY_DATE_REQUIRED,
  ERROR_PRODUCT_NAME_REQUIRED,
  ERROR_UNICEF_SECTION_REQUIRED,
  OPTIONAL,
  QUANTITY,
  SAVE,
  SAVING,
  SELECT,
  UNICEF_SECTION,
} from '../../lang';
import { Inventory } from '../../ducks/inventory';
import { Dictionary } from '@onaio/utils';
import { getUnicefSectionOptions } from './utils';

/** component props */
export interface InventoryItemFormProps {
  openSRPBaseURL: string;
  cancelURL: string;
  openSRPService: typeof OpenSRPService;
}

/** default component props */
export const defaultInventoryFormProps: InventoryItemFormProps = {
  openSRPBaseURL: '',
  cancelURL: '',
  openSRPService: OpenSRPService,
};

/** default form initial values */
export const initialValues: Partial<Inventory> = {
  productName: undefined,
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
  const { cancelURL, openSRPBaseURL, openSRPService } = props;
  const [isSubmitting, setSubmitting] = React.useState<boolean>(false);
  const history = useHistory();
  const productSelectProps = {
    openSRPBaseURL,
    name: 'productName',
    id: 'productName',
    rules: [{ required: true, message: ERROR_PRODUCT_NAME_REQUIRED }],
    openSRPService,
    optionValueProperty: 'productName' as OptionValueProperty,
  };

  return (
    <Form {...layout} initialValues={initialValues}>
      <ControlledProductSelect {...productSelectProps} />
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
          {getUnicefSectionOptions().map((option: Dictionary) => (
            <Select.Option key={option.value} value={option.value}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" className="create-user">
          {isSubmitting ? SAVING : SAVE}
        </Button>
        <Button onClick={() => history.push(cancelURL)} className="cancel-user">
          {CANCEL}
        </Button>
      </Form.Item>
    </Form>
  );
};

InventoryItemForm.defaultProps = defaultInventoryFormProps;

export { InventoryItemForm };
