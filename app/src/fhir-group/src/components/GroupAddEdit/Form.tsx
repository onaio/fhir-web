import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { GROUP_POST, GROUP_PUT, GROUP_GET } from '../../constants';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { Groups, Patient } from '../../types';
import { FhirObject } from '../../fhirutils';
import { useQueryClient } from 'react-query';

import lang, { Lang } from '../../lang';
import FHIR from 'fhirclient';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  name: string;
  active: boolean;
  comment: string;
  extraDetails: string;
  organizationid: string | undefined;
}

interface Props {
  fhirBaseURL: string;
  id?: string;
  initialValue?: FormField;
  organizations: Patient[];
}

/**
 * Handle form submission
 *
 * @param {string} fhirBaseURL - base url
 * @param {Function} setIsSubmitting function to set IsSubmitting loading process
 * @param {object} initialValue initialValue of form fields
 * @param {object} values value of form fields
 * @param {string} id id of the group
 */
export async function onSubmit(
  fhirBaseURL: string,
  setIsSubmitting: (value: boolean) => void,
  values: FormField,
  id?: string
) {
  setIsSubmitting(true);
  const Groupid = id ?? v4();

  const payload: FhirObject<Omit<Groups, 'meta'>> = {
    resourceType: 'Group',
    id: Groupid,
    active: values.active,
    identifier: [{ use: 'official', value: Groupid }],
    comment: values.comment,
    extraDetails: values.extraDetails,
    providedBy: { reference: 'Organization/' + values.organizationid },
    name: values.name,
  };

  const serve = FHIR.client(fhirBaseURL);
  if (id) {
    await serve.update(payload);
    sendSuccessNotification(lang.MSG_GROUPS_UPDATE_SUCCESS);
  } else {
    await serve.create(payload);
    sendSuccessNotification(lang.MSG_GROUPS_ADD_SUCCESS);
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const queryClient = useQueryClient();
  const { fhirBaseURL, id, organizations } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue: FormField = props.initialValue ?? {
    active: true,
    name: '',
    comment: '',
    extraDetails: '',
    organizationid: undefined,
  };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) =>
        onSubmit(fhirBaseURL, setIsSubmitting, values, id)
          .then(() => {
            queryClient.invalidateQueries(GROUP_GET);
            queryClient.invalidateQueries([GROUP_GET, id]);
            history.goBack();
          })
          .catch(() => sendErrorNotification(lang.ERROR_OCCURRED))
          .finally(() => setIsSubmitting(false))
      }
      initialValues={initialValue}
    >
      <AntdForm.Item name="name" label={lang.GROUP_NAME}>
        <Input placeholder={lang.ENTER_GROUP_NAME} />
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
