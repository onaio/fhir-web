import * as React from 'react';
import { Button, Form, Input, Radio, Select } from 'antd';
import { Helmet } from 'react-helmet';

interface Props {}

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 8 } };

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

const location = [
  { name: 'Option 1', value: 'Option1' },
  { name: 'Option 2', value: 'Option2' },
  { name: 'Option 3', value: 'Option3' },
];

const status = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

const initialvalue = { status: 'active' };

export const LocationUnitGroupAdd: React.FC<Props> = () => {
  function filter(input: string, option: any) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>

      <h5 className="mb-3">Add Location Unit Group</h5>

      <div className="bg-white p-5">
        <Form
          {...layout}
          requiredMark="optional"
          name="location-add"
          validateMessages={validateMessages}
          initialValues={initialvalue}
        >
          <Form.Item label="Location Name" name="name" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Enter a location group name"
              optionFilterProp="children"
              filterOption={filter}
            >
              {location.map((e) => (
                <Select.Option chec key={e.value} value={e.value}>
                  {e.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            valuePropName="checked"
            rules={[{ required: true }]}
          >
            <Radio.Group defaultValue={initialvalue.status}>
              {status.map((e) => (
                <Radio key={e.value} value={e.value}>
                  {e.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Description" />
          </Form.Item>

          <Form.Item {...offsetLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button type="default" htmlType="reset">
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

export default LocationUnitGroupAdd;
