import React from 'react';
import { Select, Button, Form, Input, Space, Col } from 'antd';

const { Item: FormItem } = Form;
const { TextArea } = Input;

export interface FlagFormFields {
  id?: string;
  servicePoint?: string;
  product?: boolean;
  status?: string;
  comments?: string;
}
interface FlagFormProps {
  fhirBaseUrl: string;
  initialValues: FlagFormFields;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

const FlagForm = (props: FlagFormProps) => {
  const { initialValues } = props;

  return (
    <Col className="bg-white p-3" span={24}>
      <Form initialValues={initialValues}>
        <FormItem id="service-point" label="Service Point">
          <Input disabled value="service-point" />
        </FormItem>

        <FormItem name="product" id="product" label="Product">
          <Input value="product" disabled />
        </FormItem>

        <FormItem id="type" label="Type">
          <Select
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
          />
        </FormItem>

        <FormItem id="type" label="Type">
          <TextArea />
        </FormItem>

        <FormItem>
          <Space>
            <Button type="primary" id="submit-button" htmlType="submit">
              Save
            </Button>
            <Button id="cancel-button">Cancel</Button>
          </Space>
        </FormItem>
      </Form>
    </Col>
  );
};

FlagForm.defaultProps = defaultProps;

export { FlagForm };
