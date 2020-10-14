import * as React from 'react';
import { Button, Form, Input, Radio, Select } from 'antd';
import { Helmet } from 'react-helmet';

interface Props {}

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 8 } };

export const LocationUnitGroupAdd: React.FC<Props> = () => {
  return (
    <section>
      <Helmet>
        <title>Add Location Unit Group</title>
      </Helmet>
      <h5 className="mb-3">Add Location Unit Group</h5>
      <div className="bg-white p-5">
        <Form {...layout} requiredMark="optional" name="basic" initialValues={{ remember: true }}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please Select A location group!' }]}
          >
            <Select
              showSearch
              placeholder="Enter a location group name"
              optionFilterProp="children"
              filterOption={(input: string, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Select.Option value="group1">Group 1</Select.Option>
              <Select.Option value="group2">Group 2</Select.Option>
              <Select.Option value="group3">Group 3</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Radio.Group
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              defaultValue="active"
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please Enter type description!' }]}
          >
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
