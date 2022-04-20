import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { SubmitButton, Form as AntForm, Input, Radio } from 'formik-antd';
import { Button, Spin } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { OpenSRPService } from '@opensrp/react-utils';
import { Formik } from 'formik';
import { LOCATION_UNIT_GROUP_ALL, LOCATION_UNIT_GROUP_GET } from '../../constants';
import lang, { Lang } from '../../lang';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import {
  LocationUnitGroup,
  LocationUnitGroupPayloadPOST,
  LocationUnitGroupPayloadPUT,
} from '../../ducks/location-unit-groups';

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
  description: Yup.string().typeError('Description must be a String'),
});

interface Props {
  id?: string;
  opensrpBaseURL: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setEditTitle: Function;
}

/**
 * Handle form submission
 *
 * @param {Object} values the form fields
 * @param {string} opensrpBaseURL - base url
 * @param {object} props component props
 * @param {Function} setSubmitting method to set submission status
 * @param {Lang} langObj - translations object lookup
 */
export const onSubmit = (
  values: FormField,
  opensrpBaseURL: string,
  props: Props,
  setSubmitting: (isSubmitting: boolean) => void,
  langObj: Lang = lang
) => {
  const serve = new OpenSRPService(LOCATION_UNIT_GROUP_ALL, opensrpBaseURL);

  const payload: LocationUnitGroupPayloadPOST | LocationUnitGroupPayloadPUT = values;

  if (props.id) {
    (payload as LocationUnitGroupPayloadPUT).id = props.id;
    serve
      .update(payload)
      .then(() => {
        sendSuccessNotification('Location Unit Group updated successfully');
        setSubmitting(false);
        history.goBack();
      })
      .catch(() => {
        sendErrorNotification(langObj.ERROR_OCCURED);
        setSubmitting(false);
      });
  } else {
    serve
      .create(payload)
      .then(() => {
        sendSuccessNotification('Location Unit Group successfully');
        setSubmitting(false);
        history.goBack();
      })
      .catch(() => {
        sendErrorNotification(langObj.ERROR_OCCURED);
        setSubmitting(false);
      });
  }
};

export const Form: React.FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialValue, setInitialValue] = useState<FormField>({
    name: '',
    description: '',
    active: true,
  });
  const { opensrpBaseURL, setEditTitle } = props;

  useEffect(() => {
    if (isLoading) {
      if (props.id) {
        const serve = new OpenSRPService(LOCATION_UNIT_GROUP_GET + props.id, opensrpBaseURL);
        serve
          .list()
          .then((response: LocationUnitGroup) => {
            setInitialValue({
              active: response.active,
              description: response.description,
              name: response.name,
            });
            setEditTitle(response.name);
            setIsLoading(false);
          })
          .catch(() => sendErrorNotification(lang.ERROR_OCCURED));
      } else setIsLoading(false);
    }
  }, [isLoading, props.id, opensrpBaseURL, setEditTitle]);

  if (isLoading) return <Spin className="custom-spinner" size={'large'} />;
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={userSchema}
      onSubmit={(
        values: FormField,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
      ) => onSubmit(values, opensrpBaseURL, props, setSubmitting)}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <AntForm requiredMark={false} {...layout} onSubmitCapture={handleSubmit}>
            <AntForm.Item label={lang.LOCATION_NAME} name="name">
              <Input name="name" placeholder={lang.ENTER_LOCATION_GROUP_NAME} />
            </AntForm.Item>

            <AntForm.Item label={lang.STATUS} name="active" valuePropName="checked">
              <Radio.Group name="active" defaultValue={initialValue.active}>
                {status.map((e) => (
                  <Radio name="active" key={e.label} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </AntForm.Item>

            <AntForm.Item name="description" label={lang.DESCRIPTION}>
              <Input.TextArea name="description" rows={4} placeholder={lang.DESCRIPTION} />
            </AntForm.Item>

            <AntForm.Item name={'buttons'} {...offsetLayout}>
              <SubmitButton id="submit">{isSubmitting ? lang.SAVING : lang.SAVE}</SubmitButton>
              <Button id="cancel" onClick={() => history.goBack()} type="dashed">
                {lang.CANCEL}
              </Button>
            </AntForm.Item>
          </AntForm>
        );
      }}
    </Formik>
  );
};

export default Form;
