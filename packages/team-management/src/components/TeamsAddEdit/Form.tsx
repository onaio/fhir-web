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
import lang, { Lang } from '../../lang';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  name: string;
  active: boolean;
  practitioners: string[];
  practitionersList: Practitioner[];
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
 * @param {Lang} langObj - the translation string lookup
 */
export function onSubmit(
  opensrpBaseURL: string,
  setIsSubmitting: (value: boolean) => void,
  practitioner: Practitioner[],
  initialValue: FormField,
  values: FormField,
  id?: string,
  langObj: Lang = lang
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
      const toAdd = values.practitioners.filter((val) => !initialValue.practitioners.includes(val));
      const toRem = initialValue.practitioners.filter((val) => !values.practitioners.includes(val));

      await SetPractitioners(opensrpBaseURL, practitioner, toAdd, toRem, Teamid);
      history.goBack();
    })
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURRED))
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
 * @param {Lang} langObj - the translation string lookup
 */
async function SetPractitioners(
  opensrpBaseURL: string,
  practitioner: Practitioner[],
  toAdd: string[],
  toRemove: string[],
  id: string,
  langObj: Lang = lang
) {
  sendInfoNotification(langObj.MSG_ASSIGN_PRACTITIONERS);

  // Api Call to delete practitioners
  toRemove.forEach((prac) => {
    const serve = new OpenSRPService(PRACTITIONER_DEL, opensrpBaseURL);
    serve
      .delete({ practitioner: `${prac}`, organization: id })
      .catch(() => sendErrorNotification(langObj.ERROR_OCCURRED));
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
    await serve.create(payload).catch(() => sendErrorNotification(langObj.ERROR_OCCURRED));
  }

  sendSuccessNotification(langObj.MSG_ASSIGN_PRACTITONERS_SUCCESS);
}

/**
 * Function to make teams API call
 *
 * @param {string} opensrpBaseURL - base url
 * @param {OrganizationPOST} payload payload To send
 * @param {string} id of the team if already created
 * @param {Lang} langObj - the translation string lookup
 */
export async function setTeam(
  opensrpBaseURL: string,
  payload: OrganizationPOST,
  id?: string,
  langObj: Lang = lang
) {
  if (id) {
    const serve = new OpenSRPService(TEAMS_PUT + id, opensrpBaseURL);
    await serve.update(payload);
    sendSuccessNotification(langObj.MSG_TEAMS_UPDATE_SUCCESS);
  } else {
    const serve = new OpenSRPService(TEAMS_POST, opensrpBaseURL);
    await serve.create(payload);
    sendSuccessNotification(langObj.MSG_TEAMS_ADD_SUCCESS);
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue = props.initialValue ?? {
    active: true,
    name: '',
    practitioners: [],
    practitionersList: [],
  };

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
      <AntdForm.Item name="name" label={lang.TEAM_NAME}>
        <Input placeholder={lang.ENTER_TEAM_NAME} />
      </AntdForm.Item>

      <AntdForm.Item name="active" label={lang.STATUS}>
        <Radio.Group>
          <Radio value={true}>{lang.ACTIVE}</Radio>
          <Radio value={false}>{lang.INACTIVE}</Radio>
        </Radio.Group>
      </AntdForm.Item>

      <AntdForm.Item
        name="practitioners"
        label={lang.TEAM_MEMBERS}
        tooltip={lang.TIP_REQUIRED_FIELD}
      >
        <Select allowClear mode="multiple" placeholder={lang.SELECT_PRACTITIONER}>
          {initialValue.practitionersList.map((practitioner) => (
            <Select.Option key={practitioner.identifier} value={practitioner.identifier}>
              {practitioner.name}
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
