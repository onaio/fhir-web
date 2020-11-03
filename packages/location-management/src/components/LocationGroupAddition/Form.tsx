import { Formik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { SubmitButton, Form as AntForm, Input, Radio, Select, ResetButton } from 'formik-antd';
import { notification } from 'antd';
import { history } from '@onaio/connected-reducer-registry';

import { KeycloakUser } from '@opensrp/store';
import { OpenSRPService } from '@opensrp/server-service';
import { LocationTagPayloadPOST } from 'location-management/src/ducks/location-tags';

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
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

const initialValue = {
  name: '',
  description: '',
  active: 'active',
};

/** yup validations for practitioner data object from form */
export const userSchema = Yup.object().shape({
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  active: Yup.boolean().typeError('Status must be a Boolean').required('Status is Required'),
  description: Yup.string()
    .typeError('Description must be a String')
    .required('Description is Required'),
});

interface Props {
  id?: any;
  keycloakUsers: KeycloakUser[];
  accessToken: string;
}

export const Form: React.FC<Props> = (props: Props) => {
  function filter(input: string, option: any) {
    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={userSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log('values :', JSON.stringify(values));

        const serve = new OpenSRPService(
          props.accessToken,
          'https://opensrp-stage.smartregister.org/opensrp/rest/',
          'location-tag'
        );

        const payload: LocationTagPayloadPOST = { ...values, active: values.active === 'active' };
        serve
          .create(payload)
          .then(() => {
            notification.success({ message: 'User created successfully', description: '' });
            setSubmitting(false);
            history.goBack();
          })
          .catch((e: Error) => {
            notification.error({ message: `${e}`, description: '' });
            setSubmitting(false);
          });
      }}
    >
      {({ errors, isSubmitting, handleSubmit }) => {
        console.log('errors :', errors);

        return (
          <AntForm
            validateMessages={validateMessages}
            requiredMark={false}
            {...layout}
            onSubmitCapture={handleSubmit}
          >
            <AntForm.Item label="Location Name" name="name">
              <Select
                name="name"
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
              name="active"
              valuePropName="checked"
              // className={errors.active ? `form-control is-invalid` : `form-control`}
            >
              <Radio.Group name="active" defaultValue={initialValue.active}>
                {status.map((e) => (
                  <Radio name="active" key={e.label} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </AntForm.Item>

            <AntForm.Item
              // className={errors.type ? `form-control is-invalid` : `form-control`}
              name="description"
              label="Type"
            >
              <Input.TextArea name="description" rows={4} placeholder="Description" />
            </AntForm.Item>

            <AntForm.Item name={'buttons'} {...offsetLayout}>
              <SubmitButton>{isSubmitting ? 'Saving' : 'Save'}</SubmitButton>
              <ResetButton onClick={() => history.goBack()}>Cancel</ResetButton>
            </AntForm.Item>
          </AntForm>
        );
      }}
    </Formik>
  );
};

export default Form;
