import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { HEALTHCARES_GET, ORGANIZATION_GET } from '../../constants';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import { HealthcareService, Organization } from '../../types';
import { useQueryClient } from 'react-query';

import lang from '../../lang';
import FHIR from 'fhirclient';
import { ProcessFHIRObject } from 'fhir-heatlhcareservice/src/fhirutils';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField extends Partial<HealthcareService> {
  name: string;
  active: boolean;
  comment: string;
  extraDetails: string;
}

interface Props {
  fhirBaseURL: string;
  initialValue?: FormField;
  organizations: Organization[];
}

/**
 * Handle form submission
 *
 * @param {string} fhirBaseURL - base url
 * @param {object} values value of form fields
 */
export async function onSubmit(fhirBaseURL: string, values: FormField) {
  const identifier = values.id ? ProcessFHIRObject(values).identifier?.official?.value : v4();

  const payload: Omit<HealthcareService, 'meta'> = {
    resourceType: 'HealthcareService',
    id: values.id ? values.id : '',
    active: values.active,
    identifier: [{ use: 'official', value: identifier }],
    comment: values.comment,
    extraDetails: values.extraDetails,
    providedBy: { reference: `Organization/${values?.providedBy?.reference?.split('/')[1]}` },
    name: values.name,
  };

  const serve = FHIR.client(fhirBaseURL);
  if (values.id) {
    await serve.update(payload);
    sendSuccessNotification(lang.MSG_HEALTHCARES_UPDATE_SUCCESS);
  } else {
    await serve.create(payload);
    sendSuccessNotification(lang.MSG_HEALTHCARES_ADD_SUCCESS);
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const queryClient = useQueryClient();
  const { fhirBaseURL, organizations } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue: FormField = props.initialValue ?? {
    active: true,
    name: '',
    comment: '',
    extraDetails: '',
  };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) => {
        setIsSubmitting(true);
        onSubmit(fhirBaseURL, values)
          .then(() => {
            queryClient.invalidateQueries(ORGANIZATION_GET);
            queryClient.invalidateQueries(HEALTHCARES_GET);
            queryClient.invalidateQueries([HEALTHCARES_GET, initialValue?.id]);
            history.goBack();
          })
          .catch(() => sendErrorNotification(lang.ERROR_OCCURRED))
          .finally(() => setIsSubmitting(false));
      }}
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

      <AntdForm.Item name="comment" label={lang.COMMENT}>
        <Input.TextArea rows={2} placeholder={lang.ENTER_COMMENT} />
      </AntdForm.Item>

      <AntdForm.Item name="extraDetails" label={lang.EXTRADETAILS}>
        <Input.TextArea rows={4} placeholder={lang.ENTER_EXTRADETAILS} />
      </AntdForm.Item>

      <AntdForm.Item name="organizationid" label={lang.ORGANIZATION}>
        <Select placeholder={lang.ENTER_ORGANIZATION}>
          {organizations.map((org) => (
            <Select.Option key={org.id} value={org.id}>
              {org.name}
            </Select.Option>
          ))}
        </Select>
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
