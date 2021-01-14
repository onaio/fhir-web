import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import {
  API_BASE_URL,
  TEAMS_POST,
  PRACTITIONER_POST,
  PRACTITIONER_DEL,
  TEAMS_PUT,
  ERROR_OCCURRED,
} from '../../constants';
import { OpenSRPService } from '@opensrp/server-service';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { OrganizationPOST } from '../../ducks/organizations';
import { Practitioner, PractitionerPOST } from '../../ducks/practitioners';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };
const layoutFull = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
const offsetLayoutFull = { wrapperCol: { offset: 8, span: 16 } };

export interface FormField {
  name: string;
  active: boolean;
  practitioners: string[];
}

interface Props {
  id?: string;
  practitioner: Practitioner[];
  initialValue?: FormField | null;
  accessToken: string;
}

/**
 * Handle form submission
 *
 * @param {Function} setIsSubmitting function to set IsSubmitting loading process
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {string} accessToken Token for api calles
 * @param {object} values value of form fields
 * @param {object} initialValue initialValue of form fields
 * @param {string} id id of the team
 */
export function onSubmit(
  setIsSubmitting: (value: boolean) => void,
  practitioner: Practitioner[],
  accessToken: string,
  initialValue: FormField,
  values: FormField,
  id?: string
) {
  setIsSubmitting(true);
  const Teamid = id ?? v4();

  const payload: OrganizationPOST = {
    active: values.active,
    identifier: Teamid,
    name: values.name,
    type: {
      coding: [
        {
          code: 'team',
          display: 'Team',
          system: 'http://terminology.hl7.org/CodeSystem/organization-type',
        },
      ],
    },
  };

  setTeam(accessToken, payload, id)
    .then(async () => {
      // Filter and seperate the practitioners uuid
      // const toBe = initialValue.practitioners.filter((val) => values.practitioners.includes(val));
      const toAdd = values.practitioners.filter((val) => !initialValue.practitioners.includes(val));
      const toRem = initialValue.practitioners.filter((val) => !values.practitioners.includes(val));

      await SetPractitioners(practitioner, toAdd, toRem, accessToken, Teamid);
      history.goBack();
    })
    .catch(() => sendErrorNotification(ERROR_OCCURRED))
    .finally(() => setIsSubmitting(false));
}

/**
 * handle Practitioners
 *
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {Array<string>} toAdd list of practitioner uuid to add
 * @param {Array<string>} toRemove list of practitioner uuid to remove
 * @param {string} accessToken Token for api calles
 * @param {string} id id of the team
 */
async function SetPractitioners(
  practitioner: Practitioner[],
  toAdd: string[],
  toRemove: string[],
  accessToken: string,
  id: string
) {
  sendInfoNotification('Assigning Practitioners');

  // Api Call to delete practitioners
  toRemove.forEach((prac) => {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, PRACTITIONER_DEL + prac);
    serve.delete().catch(() => sendErrorNotification(ERROR_OCCURRED));
  });

  // Api Call to add practitioners
  const toAddPractitioner = practitioner.filter((e) => toAdd.includes(e.identifier));
  const payload: PractitionerPOST[] = toAddPractitioner.map((prac) => {
    return {
      active: true,
      identifier: v4(),
      practitioner: prac.identifier,
      organization: id,
      code: { text: 'Community Health Worker' },
    };
  });
  if (toAdd.length) {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, PRACTITIONER_POST);
    await serve.create(payload).catch(() => sendErrorNotification(ERROR_OCCURRED));
  }

  sendSuccessNotification('Successfully Assigned Practitioners');
}

/**
 * Function to make teams API call
 *
 * @param {string} accessToken Token for api calles
 * @param {OrganizationPOST} payload payload To send
 * @param {string} id of the team if already created
 */
export async function setTeam(accessToken: string, payload: OrganizationPOST, id?: string) {
  if (id) {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAMS_PUT + id);
    await serve.update(payload);
    sendSuccessNotification('Successfully Updated Teams');
  } else {
    const serve = new OpenSRPService(accessToken, API_BASE_URL, TEAMS_POST);
    await serve.create(payload);
    sendSuccessNotification('Successfully Added Teams');
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue = props.initialValue ?? { active: true, name: '', practitioners: [] };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) =>
        onSubmit(
          setIsSubmitting,
          props.practitioner,
          props.accessToken,
          values,
          initialValue,
          props.id
        )
      }
      initialValues={initialValue}
    >
      <AntdForm.Item name="name" label="Team Name">
        <Input placeholder="Enter a team name" />
      </AntdForm.Item>

      <AntdForm.Item name="active" label="Status">
        <Radio.Group>
          <Radio value={true}>Active</Radio>
          <Radio value={false}>Inactive</Radio>
        </Radio.Group>
      </AntdForm.Item>

      <AntdForm.Item name="practitioners" label="Team Members" tooltip="This is a required field">
        <Select allowClear mode="multiple" placeholder="Select user (practitioners only)">
          {props.practitioner.map((practitioner) => (
            <Select.Option key={practitioner.identifier} value={practitioner.identifier}>
              {practitioner.name}
            </Select.Option>
          ))}
        </Select>
      </AntdForm.Item>

      <AntdForm.Item {...offsetLayout}>
        <Button id="submit" loading={isSubmitting} type="primary" htmlType="submit">
          {isSubmitting ? 'Saving' : 'Save'}
        </Button>
        <Button id="cancel" onClick={() => history.goBack()} type="dashed">
          Cancel
        </Button>
      </AntdForm.Item>
    </AntdForm>
  );
};

export default Form;
