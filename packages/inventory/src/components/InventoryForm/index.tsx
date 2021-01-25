import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Input, DatePicker } from 'antd';
import { history } from '@onaio/connected-reducer-registry';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  products: string[];
  quantity: string;
  deliveryDate: string;
  accountabilityDate: string;
  unicefSection: string[];
  donor: string[];
  poNumber: string;
  active: boolean;
}

interface Props {
  opensrpBaseURL: string;
  id?: string;
  initialValue?: FormField | null;
  products: string[];
  unicefSection: string[];
  donors: string[];
}

export const InventoryForm: React.FC<Props> = (props: Props) => {
  const [isSubmitting] = useState<boolean>(false);
  const initialValue = props.initialValue ?? { active: true, name: '', practitioners: [] };

  return (
    <div className="inventory-form form-container">
      <AntdForm requiredMark={false} {...layout} initialValues={initialValue}>
        <AntdForm.Item name="product" label="Product">
          <Select defaultValue="lucy">
            <Select placeholder="Select product">
              {props.products.map((product) => (
                <Select.Option key={product} value={product}>
                  {product}
                </Select.Option>
              ))}
            </Select>
          </Select>
        </AntdForm.Item>
        <AntdForm.Item name="quantity" label="Quantity(Optional)">
          <Input placeholder="" />
        </AntdForm.Item>
        <AntdForm.Item name="delivery-date" label="Delivery date">
          <DatePicker />
        </AntdForm.Item>
        <AntdForm.Item name="accountability-date" label="Accountability date">
          <DatePicker />
        </AntdForm.Item>
        <AntdForm.Item name="unicef-section" label="UNICEF section">
          <Select placeholder="Select Unicef section">
            {props.unicefSection.map((unicefSection) => (
              <Select.Option key={unicefSection} value={unicefSection}>
                {unicefSection}
              </Select.Option>
            ))}
          </Select>
        </AntdForm.Item>

        <AntdForm.Item name="donor" label="Donor (optional)">
          <Select defaultValue="lucy">
            <Select placeholder="Select Donor">
              {props.donors.map((donor) => (
                <Select.Option key={donor} value={donor}>
                  {donor}
                </Select.Option>
              ))}
            </Select>
          </Select>
        </AntdForm.Item>
        <AntdForm.Item name="po-number" label="PO number">
          <Input placeholder="" />
        </AntdForm.Item>
        <AntdForm.Item {...offsetLayout}>
          <Button id="submit" loading={isSubmitting} type="primary" htmlType="submit">
            {isSubmitting ? 'Saving' : 'Save'}
          </Button>
          <Button id="cancel" onClick={() => history.goBack()}>
            Cancel
          </Button>
        </AntdForm.Item>
      </AntdForm>
    </div>
  );
};

export default InventoryForm;
