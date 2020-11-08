import * as Yup from 'yup';
import React from 'react';
import { SubmitButton, Form as AntForm, Input, Radio } from 'formik-antd';
import { notification, Button } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { API_BASE_URL, LOCATION_TAG_ALL } from '../../constants';
import { LocationTagPayloadPOST, LocationTagPayloadPUT } from '../../ducks/location-tags';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

const status = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

interface formfield {
  name: string;
  description: string;
  active: boolean;
}

const initialValue: formfield = {
  name: '',
  description: '',
  active: true,
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
}

export const Form: React.FC<Props> = (props: Props) => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);

  // function filter(input: string, option: any) {
  //   return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  // }

  function onSubmit(
    values: formfield,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) {
    console.log('values :', values);

    const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);

    const payload: LocationTagPayloadPOST | LocationTagPayloadPUT = values;

    if (props.id) {
      console.log('payload :', payload);
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
    } else {
      (payload as LocationTagPayloadPUT).id = props.id;
      console.log('payload :', payload);
      serve
        .update(payload)
        .then(() => {
          notification.success({ message: 'User updated successfully', description: '' });
          setSubmitting(false);
          history.goBack();
        })
        .catch((e: Error) => {
          notification.error({ message: `${e}`, description: '' });
          setSubmitting(false);
        });
    }
  }

  return (
    <Formik initialValues={initialValue} validationSchema={userSchema} onSubmit={onSubmit}>
      {({ values, errors, isSubmitting, handleSubmit }) => {
        console.log('values :', values, ' errors :', errors);

        return (
          <AntForm requiredMark={false} {...layout} onSubmitCapture={handleSubmit}>
            <AntForm.Item label="Location Name" name="name">
              <Input name="name" placeholder="Enter a location group name" />
              {/* <Select
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
              </Select> */}
            </AntForm.Item>

            <AntForm.Item label="Status" name="active" valuePropName="checked">
              <Radio.Group name="active" defaultValue={initialValue.active}>
                {status.map((e) => (
                  <Radio name="active" key={e.label} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </AntForm.Item>

            <AntForm.Item name="description" label="Type">
              <Input.TextArea name="description" rows={4} placeholder="Description" />
            </AntForm.Item>

            <AntForm.Item name={'buttons'} {...offsetLayout}>
              <SubmitButton>{isSubmitting ? 'Saving' : 'Save'}</SubmitButton>
              <Button onClick={() => history.goBack()} type="dashed">
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
