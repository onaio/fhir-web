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

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  status: Yup.string().required('Required'),
  type: Yup.string().required('Required'),
});

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
      validationSchema={userSchema}
      // tslint:disable-next-line: jsx-no-lambda
      onSubmit={(values, { setSubmitting }) => {
        console.log('asd');
        setSubmitting(false);
      }}
    >
      {({ errors, isSubmitting, handleSubmit }) => (
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
            // className={errors.name ? `form-control is-invalid` : `form-control`}
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
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
              {isSubmitting ? 'Saving' : 'Save User'}
            </Button>
            <Button htmlType="submit" onClick={() => history.goBack()}>
              Cancel
            </Button>
          </AntForm.Item>
        </AntForm>
      )}
    </Formik>
  );
};

export default Form;
