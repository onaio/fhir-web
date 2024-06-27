import React from 'react';
import { Select, Button, Form, Input, Space, Col, Row } from 'antd';
import { BodyLayout } from '@opensrp/react-utils';
import { formItemLayout, tailLayout } from '@opensrp/react-utils';
import { CloseFlagFormFields } from '../Utils/utils';

const { Item: FormItem } = Form;
const { TextArea } = Input;

interface CloseFlagFormProps {
  fhirBaseUrl: string;
  initialValues: CloseFlagFormFields;
  disabled: string[];
  cancelUrl?: string;
  successUrl?: string;
}

const defaultProps = {
  initialValues: {},
  disabled: [],
};

const headerProps = {
  pageHeaderProps: {
    title: 'Close Flag',
    onBack: undefined,
  },
};

const CloseFlagForm = (props: CloseFlagFormProps) => {
  const { initialValues } = props;
  console.log('initialValues', initialValues);

  return (
    <BodyLayout headerProps={headerProps}>
      <Row className="user-group">
        <Col className="bg-white p-3" span={24}>
          <Form
            {...formItemLayout}
            initialValues={initialValues}
            onFinish={(values: CloseFlagFormFields) => {
              console.log('values-------', values);
            }}
          >
            <FormItem
              name="locationName"
              id="locationName"
              label="Service Point"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </FormItem>

            <FormItem name="productName" id="productName" label="Product">
              <Input disabled />
            </FormItem>

            <FormItem id="status" label="Status" name="status" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </FormItem>

            <FormItem id="comments" label="Comments" name="comments" rules={[{ required: true }]}>
              <TextArea />
            </FormItem>

            <FormItem {...tailLayout}>
              <Button type="primary" id="submit-button" htmlType="submit">
                Save
              </Button>
              <Button id="cancel-button">Cancel</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </BodyLayout>
  );
};

CloseFlagForm.defaultProps = defaultProps;

export { CloseFlagForm };
