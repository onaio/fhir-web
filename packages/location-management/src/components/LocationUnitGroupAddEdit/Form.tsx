import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
import { SubmitButton, Form as AntForm, Input, Radio } from 'formik-antd';
import { Button, Spin } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { OpenSRPService } from '@opensrp/react-utils';
import { Formik } from 'formik';
import { LOCATION_UNIT_GROUP_ALL, LOCATION_UNIT_GROUP_GET } from '../../constants';
import { useTranslation } from '../../mls';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import {
  LocationUnitGroup,
  LocationUnitGroupPayloadPOST,
  LocationUnitGroupPayloadPUT,
} from '../../ducks/location-unit-groups';
import type { TFunction } from '@opensrp/i18n';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

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
 * @param values the form fields
 * @param opensrpBaseURL - base url
 * @param props component props
 * @param setSubmitting method to set submission status
 * @param t - translations object lookup
 */
export const onSubmit = (
  values: FormField,
  opensrpBaseURL: string,
  props: Props,
  setSubmitting: (isSubmitting: boolean) => void,
  t: TFunction
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
        sendErrorNotification(t('There was a problem updating Location Unit Group'));
        setSubmitting(false);
      });
  } else {
    serve
      .create(payload)
      .then(() => {
        sendSuccessNotification('Location Unit Group created successfully');
        setSubmitting(false);
        history.goBack();
      })
      .catch(() => {
        sendErrorNotification(t('There was a problem creating Location Unit Group'));
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
  const { t } = useTranslation();

  const status = [
    { label: t('Active'), value: true },
    { label: t('Inactive'), value: false },
  ];

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
          .catch(() => sendErrorNotification(t('There was a problem submitting ')));
      } else setIsLoading(false);
    }
  }, [isLoading, props.id, opensrpBaseURL, setEditTitle, t]);

  if (isLoading) return <Spin className="custom-spinner" size={'large'} />;
  return (
    <Formik
      initialValues={initialValue}
      validationSchema={userSchema}
      onSubmit={(
        values: FormField,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
      ) => onSubmit(values, opensrpBaseURL, props, setSubmitting, t)}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <AntForm requiredMark={false} {...layout} onSubmitCapture={handleSubmit}>
            <AntForm.Item label={t('Location Name')} name="name">
              <Input name="name" placeholder={t('Enter a location group name')} />
            </AntForm.Item>

            <AntForm.Item label={t('Status')} name="active" valuePropName="checked">
              <Radio.Group name="active" defaultValue={initialValue.active}>
                {status.map((e) => (
                  <Radio name="active" key={e.label} value={e.value}>
                    {e.label}
                  </Radio>
                ))}
              </Radio.Group>
            </AntForm.Item>

            <AntForm.Item name="description" label={t('Description')}>
              <Input.TextArea name="description" rows={4} placeholder={t('Description')} />
            </AntForm.Item>

            <AntForm.Item name={'buttons'} {...offsetLayout}>
              <SubmitButton id="submit">{isSubmitting ? t('Saving') : t('Save')}</SubmitButton>
              <Button id="cancel" onClick={() => history.goBack()} type="dashed">
                {t('Cancel')}
              </Button>
            </AntForm.Item>
          </AntForm>
        );
      }}
    </Formik>
  );
};

export default Form;
