import * as Yup from 'yup';
import { Formik } from 'formik';
import React from 'react';
import { Button, Form as AntForm, Input, Radio, Select } from 'antd';
import { history } from '@onaio/connected-reducer-registry';

import { KeycloakUser } from '@opensrp/store';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 8 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 8 } };

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  number: {
    len: 'lenth should be ${label}',
    min: 'should be greater than ${label}',
    max: 'should be lesser than ${label}',
    range: '${label} must be between ${min} and ${max}',
  },
  default: '${label} defauslt',
  enum: '${label} enum',
  whitespace: '${label} whitespace',
  date: {
    format: '${label} format',
    parse: '${label} parse',
    invalid: '${label} invalid',
  },
  types: {
    string: '${label} is not a valid string',
    method: '${label} is not a valid method',
    array: '${label} is not a valid array',
    object: '${label} is not a valid object',
    number: '${label} is not a valid number',
    date: '${label} is not a valid date',
    boolean: '${label} is not a valid boolean',
    integer: '${label} is not a valid integer',
    float: '${label} is not a valid float',
    regexp: '${label} is not a valid regexp',
    email: '${label} is not a valid email',
    url: '${label} is not a valid url',
    hex: '${label} is not a valid hex',
  },
  string: {
    len: '${label} len',
    min: '${label} min',
    max: '${label} max',
    range: '${label} range',
  },
  array: {
    len: '${label} len',
    min: '${label} min',
    max: '${label} max',
    range: '${label} range',
  },
  pattern: {
    mismatch: '${label} mismatch',
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

const initialValue = {
  name: null,
  type: null,
  status: 'active',
};

interface Props {
  keycloakUsers: KeycloakUser[];
  accessToken: string;
}

export const Form: React.FC<Props> = () => {
  function filter(input: string, option: any) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  return (
    <Formik
      initialValues={initialValue}
      // tslint:disable-next-line: jsx-no-lambda
      onSubmit={(values, { setSubmitting }) => {
        console.log('asd', values);
        setSubmitting(false);
      }}
    >
      {({ errors, isSubmitting, handleSubmit }) => {
        console.log('errors :', errors);
        console.log('isSubmitting :', isSubmitting);

        return (
          <AntForm
            validateMessages={validateMessages}
            requiredMark={false}
            initialValues={initialValue}
            {...layout}
            onSubmitCapture={handleSubmit}
          >
            <AntForm.Item
              label="Location Name"
              name="name"
              rules={[{ required: true, whitespace: true }]}
            >
              <Select
                showSearch
                placeholder="Enter a location group name"
                optionFilterProp="children"
                filterOption={filter}
              >
                {location.map((e) => (
                  <Select.Option key={e.value} value={e.value}>
                    {e.name}
                  </Select.Option>
                ))}
              </Select>
            </AntForm.Item>

            <AntForm.Item
              label="Status"
              name="status"
              valuePropName="checked"
              // className={errors.status ? `form-control is-invalid` : `form-control`}
              rules={[{ required: true }]}
            >
              <Radio.Group defaultValue={initialValue.status}>
                {status.map((e) => (
                  <Radio key={e.value} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </AntForm.Item>

            <AntForm.Item
              // className={errors.type ? `form-control is-invalid` : `form-control`}
              name="type"
              label="Type"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input.TextArea rows={4} placeholder="Description" />
            </AntForm.Item>

            <AntForm.Item {...offsetLayout}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={Object.keys(errors).length > 0}
              >
                {isSubmitting ? 'Saving' : 'Save'}
              </Button>
              <Button htmlType="submit" onClick={() => history.goBack()}>
                Cancel
              </Button>
            </AntForm.Item>
          </AntForm>
        );
      }}
    </Formik>
  );
};

export default Form;
