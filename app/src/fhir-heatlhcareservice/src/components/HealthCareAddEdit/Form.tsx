import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { HEALTHCARES_POST, HEALTHCARES_PUT, HEALTHCARES_GET } from '../../constants';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { HealthcareService } from '../../types';
import { FhirObject } from '../../fhirutils';
import { useQueryClient } from 'react-query';

import lang, { Lang } from '../../lang';
import FHIR from 'fhirclient';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  name: string;
  active: boolean;
}

interface Props {
  fhirBaseURL: string;
  id?: string;
  initialValue?: FormField;
}

/**
 * Handle form submission
 *
 * @param {string} fhirBaseURL - base url
 * @param {Function} setIsSubmitting function to set IsSubmitting loading process
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {object} initialValue initialValue of form fields
 * @param {object} values value of form fields
 * @param {string} id id of the healthcare
 */
export async function onSubmit(
  fhirBaseURL: string,
  setIsSubmitting: (value: boolean) => void,
  initialValue: FormField,
  values: FormField,
  id?: string
) {
  setIsSubmitting(true);
  const Healthcareid = id ?? v4();

  //   const payload: FhirObject<HealthcareService> = {
  //     resourceType: 'HealthcareService',
  //     id: Healthcareid,
  //     active: values.active,
  //     identifier: [{ use: 'official', value: Healthcareid }],
  //     name: values.name,
  //   };

  //   await setHealthcare(fhirBaseURL, payload, id);

  //   // Filter and seperate the practitioners uuid

  //   const toAdd = values.practitioners.filter((val) => !initialValue.practitioners.includes(val));
  //   const toRem = initialValue.practitioners.filter((val) => !values.practitioners.includes(val));
}

/**
 * Function to make healthcares API call
 *
 * @param {string} fhirBaseURL - base url
 * @param {HealthcareService} payload payload To send
 * @param {string} id of the healthcare if already created
 * @param {Lang} langObj - the translation string lookup
 */
export async function setHealthcare(
  fhirBaseURL: string,
  payload: FhirObject<Omit<HealthcareService, 'meta'>>,
  id?: string,
  langObj: Lang = lang
) {
  const serve = FHIR.client(fhirBaseURL);
  if (id) {
    console.log(payload, fhirBaseURL + HEALTHCARES_PUT + id);
    await serve.update(payload);
    sendSuccessNotification(langObj.MSG_HEALTHCARES_UPDATE_SUCCESS);
  } else {
    console.log(payload, fhirBaseURL + HEALTHCARES_POST);
    await serve.create(payload);
    sendSuccessNotification(langObj.MSG_HEALTHCARES_ADD_SUCCESS);
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const queryClient = useQueryClient();
  const { fhirBaseURL, id } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue = props.initialValue ?? { active: true, name: '', practitioners: [] };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) =>
        onSubmit(fhirBaseURL, setIsSubmitting, initialValue, values, id)
          .then(() => {
            queryClient.invalidateQueries(HEALTHCARES_GET);
            queryClient.invalidateQueries([HEALTHCARES_GET, id]);
            history.goBack();
          })
          .catch(() => sendErrorNotification(lang.ERROR_OCCURRED))
          .finally(() => setIsSubmitting(false))
      }
      initialValues={initialValue}
    >
      <AntdForm.Item name="name" label={lang.HEALTHCARE_NAME}>
        <Input placeholder={lang.ENTER_HEALTHCARE_NAME} />
      </AntdForm.Item>

      <AntdForm.Item name="active" label={lang.STATUS}>
        <Radio.Group>
          <Radio value={true}>{lang.ACTIVE}</Radio>
          <Radio value={false}>{lang.INACTIVE}</Radio>
        </Radio.Group>
      </AntdForm.Item>
``
      <AntdForm.Item name="comment" label={lang.COMMENT}>
        <Input.TextArea rows={2} placeholder={lang.ENTER_COMMENT} />
      </AntdForm.Item>

      <AntdForm.Item name="extraDetails" label={lang.EXTRADETAILS}>
        <Input.TextArea rows={4} placeholder={lang.ENTER_EXTRADETAILS} />
      </AntdForm.Item>

      <AntdForm.Item {...offsetLayout}>
        <Button id="submit" loading={isSubmitting} type="primary" htmlType="submit">
          {isSubmitting ? lang.SAVING : lang.SAVE}
        </Button>
        <Button id="cancel" onClick={() => history.goBack()} type="dashed">
          {lang.CANCEL}
        </Button>
      </AntdForm.Item>
    </AntdForm>
  );
};

export default Form;
