import React, { useState } from 'react';
import { Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { FHIRService } from '@opensrp/react-utils';
import { GROUP_GET } from '../../constants';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import { Groups } from '../../types';
import { useQueryClient } from 'react-query';

import lang from '../../lang';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  name: string;
  active: boolean;
}

interface Props {
  fhirBaseURL: string;
  initialValue?: FormField & Partial<Groups>;
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
  initialValue: FormField & Partial<Groups>
) {
  setIsSubmitting(true);
  const Groupid = initialValue.id ? initialValue.id : v4();

  const payload: Omit<Groups, 'meta'> = {
    resourceType: 'Group',
    id: Groupid,
    active: values.active,
    identifier: [{ use: 'official', value: Groupid }],
    name: values.name,
  };

  const serve = await FHIRService(fhirBaseURL);
  if (initialValue.id) {
    await serve.update(payload);
    sendSuccessNotification(lang.MSG_GROUPS_UPDATE_SUCCESS);
  } else {
    await serve.create(payload);
    sendSuccessNotification(lang.MSG_GROUPS_ADD_SUCCESS);
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const queryClient = useQueryClient();
  const { fhirBaseURL } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue = props.initialValue ?? {
    active: true,
    name: '',
  };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values: FormField) =>
        onSubmit(fhirBaseURL, setIsSubmitting, values, initialValue)
          .then(() => {
            queryClient.invalidateQueries(GROUP_GET);
            queryClient.invalidateQueries([GROUP_GET, initialValue?.id]);
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
