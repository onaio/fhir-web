import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { SubmitButton, Form as AntForm, Input, Radio } from 'formik-antd';
import { Button } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { OpenSRPService } from '@opensrp/server-service';
import { getAccessToken } from '@onaio/session-reducer';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { API_BASE_URL, LOCATION_TAG_ALL, LOCATION_TAG_GET } from '../../constants';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import {
  LocationTag,
  LocationTagPayloadPOST,
  LocationTagPayloadPUT,
} from '../../ducks/location-tags';
import { Ripple } from '@onaio/loaders';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

const status = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
];

interface FormField {
  name: string;
  description: string;
  active: boolean;
}

/** yup validations for practitioner data object from form */
const userSchema = Yup.object().shape({
  name: Yup.string().typeError('Name must be a String').required('Name is Required'),
  active: Yup.boolean().typeError('Status must be a Boolean').required('Status is Required'),
  description: Yup.string()
    .typeError('Description must be a String')
    .required('Description is Required'),
});

interface Props {
  id?: string;
}

/**
 * Handle form submission
 *
 * @param {Object} values the form fields
 * @param {string} accessToken api access token
 * @param {object} props component props
 * @param {Function} setSubmitting method to set submission status
 */
export const onSubmit = (
  values: FormField,
  accessToken: string,
  props: Props,
  setSubmitting: (isSubmitting: boolean) => void
) => {
  const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_ALL);

  const payload: LocationTagPayloadPOST | LocationTagPayloadPUT = values;

  if (props.id) {
    (payload as LocationTagPayloadPUT).id = props.id;
    serve
      .update(payload)
      .then(() => {
        sendSuccessNotification('Location Tag updated successfully');
        setSubmitting(false);
        history.goBack();
      })
      .catch((e: Error) => {
        sendErrorNotification(`${e}`);
        setSubmitting(false);
      });
  } else {
    serve
      .create(payload)
      .then(() => {
        sendSuccessNotification('Location Tag successfully');
        setSubmitting(false);
        history.goBack();
      })
      .catch((e: Error) => {
        sendErrorNotification(`${e}`);
        setSubmitting(false);
      });
  }
};

export const Form: React.FC<Props> = (props: Props) => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialValue, setInitialValue] = useState<FormField>({
    name: '',
    description: '',
    active: true,
  });

  useEffect(() => {
    if (isLoading) {
      if (props.id) {
        const serve = new OpenSRPService(accessToken, API_BASE_URL, LOCATION_TAG_GET + props.id);
        serve
          .list()
          .then((response: LocationTag) => {
            setInitialValue({
              active: response.active,
              description: response.description,
              name: response.name,
            });
            setIsLoading(false);
          })
          .catch((e) => sendErrorNotification(`${e}`));
      } else setIsLoading(false);
    }
  }, [accessToken, isLoading, props.id]);

  if (isLoading) return <Ripple />;
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={userSchema}
      onSubmit={(
        values: FormField,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
      ) => onSubmit(values, accessToken, props, setSubmitting)}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <AntForm requiredMark={false} {...layout} onSubmitCapture={handleSubmit}>
            <AntForm.Item label="Location Name" name="name">
              <Input name="name" placeholder="Enter a location group name" />
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
              <SubmitButton id="submit">{isSubmitting ? 'Saving' : 'Save'}</SubmitButton>
              <Button id="cancel" onClick={() => history.goBack()} type="dashed">
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
