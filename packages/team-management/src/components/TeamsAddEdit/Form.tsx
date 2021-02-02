import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { TEAMS_POST, PRACTITIONER_POST, PRACTITIONER_DEL, TEAMS_PUT } from '../../constants';
import { OpenSRPService } from '@opensrp/react-utils';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { OrganizationPOST } from '../../ducks/organizations';
import { Practitioner, PractitionerPOST } from '../../ducks/practitioners';
import {
  ACTIVE,
  CANCEL,
  ENTER_TEAM_NAME,
  ERROR_OCCURRED,
  INACTIVE,
  MSG_ASSIGN_PRACTITIONERS,
  MSG_ASSIGN_PRACTITONERS_SUCCESS,
  MSG_TEAMS_ADD_SUCCESS,
  MSG_TEAMS_UPDATE_SUCCESS,
  SAVE,
  SAVING,
  SELECT_PRACTITIONER,
  STATUS,
  TEAM_MEMBERS,
  TEAM_NAME,
  TIP_REQUIRED_FIELD,
} from '../../lang';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  name: string;
  active: boolean;
  practitioners: string[];
}

interface Props {
  opensrpBaseURL: string;
  id?: string;
  practitioner: Practitioner[];
  initialValue?: FormField | null;
}

/**
 * Handle form submission
 *
 * @param {string} opensrpBaseURL - base url
 * @param {Function} setIsSubmitting function to set IsSubmitting loading process
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {object} initialValue initialValue of form fields
 * @param {object} values value of form fields
 * @param {string} id id of the team
 */
export function onSubmit(
  opensrpBaseURL: string,
  setIsSubmitting: (value: boolean) => void,
  practitioner: Practitioner[],
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

  setTeam(opensrpBaseURL, payload, id)
    .then(async () => {
      // Filter and seperate the practitioners uuid
      // const toBe = initialValue.practitioners.filter((val) => values.practitioners.includes(val));
      const toAdd = values.practitioners.filter((val) => !initialValue.practitioners.includes(val));
      const toRem = initialValue.practitioners.filter((val) => !values.practitioners.includes(val));

      await SetPractitioners(opensrpBaseURL, practitioner, toAdd, toRem, Teamid);
      history.goBack();
    })
    .catch(() => sendErrorNotification(ERROR_OCCURRED))
    .finally(() => setIsSubmitting(false));
}

/**
 * handle Practitioners
 *
 * @param {string} opensrpBaseURL - base url
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {Array<string>} toAdd list of practitioner uuid to add
 * @param {Array<string>} toRemove list of practitioner uuid to remove
 * @param {string} id id of the team
 */
async function SetPractitioners(
  opensrpBaseURL: string,
  practitioner: Practitioner[],
  toAdd: string[],
  toRemove: string[],
  id: string
) {
  sendInfoNotification(MSG_ASSIGN_PRACTITIONERS);

  // Api Call to delete practitioners
  toRemove.forEach((prac) => {
    const serve = new OpenSRPService(PRACTITIONER_DEL + prac, opensrpBaseURL);
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
    const serve = new OpenSRPService(PRACTITIONER_POST, opensrpBaseURL);
    await serve.create(payload).catch(() => sendErrorNotification(ERROR_OCCURRED));
  }

  sendSuccessNotification(MSG_ASSIGN_PRACTITONERS_SUCCESS);
}

/**
 * Function to make teams API call
 *
 * @param {string} opensrpBaseURL - base url
 * @param {OrganizationPOST} payload payload To send
 * @param {string} id of the team if already created
 */
export async function setTeam(opensrpBaseURL: string, payload: OrganizationPOST, id?: string) {
  if (id) {
    const serve = new OpenSRPService(TEAMS_PUT + id, opensrpBaseURL);
    await serve.update(payload);
    sendSuccessNotification(MSG_TEAMS_UPDATE_SUCCESS);
  } else {
    const serve = new OpenSRPService(TEAMS_POST, opensrpBaseURL);
    await serve.create(payload);
    sendSuccessNotification(MSG_TEAMS_ADD_SUCCESS);
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
          props.opensrpBaseURL,
          setIsSubmitting,
          props.practitioner,
          initialValue,
          values,
          props.id
        )
      }
      initialValues={initialValue}
    >
      <AntdForm.Item name="name" label={TEAM_NAME}>
        <Input placeholder={ENTER_TEAM_NAME} />
      </AntdForm.Item>

      <AntdForm.Item name="active" label={STATUS}>
        <Radio.Group>
          <Radio value={true}>{ACTIVE}</Radio>
          <Radio value={false}>{INACTIVE}</Radio>
        </Radio.Group>
      </AntdForm.Item>

      <AntdForm.Item name="practitioners" label={TEAM_MEMBERS} tooltip={TIP_REQUIRED_FIELD}>
        <Select allowClear mode="multiple" placeholder={SELECT_PRACTITIONER}>
          {props.practitioner.map((practitioner) => (
            <Select.Option key={practitioner.identifier} value={practitioner.identifier}>
              {practitioner.name}
            </Select.Option>
          ))}
        </Select>
      </AntdForm.Item>

      <AntdForm.Item {...offsetLayout}>
        <Button id="submit" loading={isSubmitting} type="primary" htmlType="submit">
          {isSubmitting ? SAVING : SAVE}
        </Button>
        <Button id="cancel" onClick={() => history.goBack()} type="dashed">
          {CANCEL}
        </Button>
      </AntdForm.Item>
    </AntdForm>
  );
};

export default Form;
