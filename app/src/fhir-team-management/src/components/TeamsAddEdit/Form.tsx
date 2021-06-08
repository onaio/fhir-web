import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import { TEAMS_POST, TEAMS_PUT, TEAMS_GET, PRACTITIONERROLE_DEL } from '../../constants';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { Organization, Practitioner, PractitionerRole } from '../../types';
import { FhirObject } from '../../fhirutils';
import { useQueryClient } from 'react-query';

import lang, { Lang } from '../../lang';
import FHIR from 'fhirclient';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  name: string;
  active: boolean;
  practitioners: string[];
}

interface Props {
  fhirbaseURL: string;
  id?: string;
  allPractitioner: Practitioner[];
  initialValue?: FormField;
}

/**
 * Handle form submission
 *
 * @param {string} fhirbaseURL - base url
 * @param {Function} setIsSubmitting function to set IsSubmitting loading process
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {object} initialValue initialValue of form fields
 * @param {object} values value of form fields
 * @param {string} id id of the team
 */
export async function onSubmit(
  fhirbaseURL: string,
  setIsSubmitting: (value: boolean) => void,
  practitioner: Practitioner[],
  initialValue: FormField,
  values: FormField,
  id?: string
) {
  setIsSubmitting(true);
  const Teamid = id ?? v4();

  const payload: FhirObject<Organization> = {
    resourceType: 'Organization',
    id: Teamid,
    active: values.active,
    identifier: [{ use: 'official', value: Teamid }],
    name: values.name,
  };

  await setTeam(fhirbaseURL, payload, id);

  // Filter and seperate the practitioners uuid

  const toAdd = values.practitioners.filter((val) => !initialValue.practitioners.includes(val));
  const toRem = initialValue.practitioners.filter((val) => !values.practitioners.includes(val));
  console.log(toAdd, toRem);

  await SetPractitioners(fhirbaseURL, practitioner, toAdd, toRem, Teamid);
}

/**
 * handle Practitioners
 *
 * @param {string} fhirbaseURL - base url
 * @param {Practitioner} practitioner list of practitioner to filter the selected one from
 * @param {Array<string>} toAdd list of practitioner uuid to add
 * @param {Array<string>} toRemove list of practitioner uuid to remove
 * @param {string} teamId id of the team
 * @param {Lang} langObj - the translation string lookup
 */
async function SetPractitioners(
  fhirbaseURL: string,
  practitioner: Practitioner[],
  toAdd: string[],
  toRemove: string[],
  teamId: string,
  langObj: Lang = lang
) {
  sendInfoNotification(langObj.MSG_ASSIGN_PRACTITIONERS);
  const serve = FHIR.client(fhirbaseURL);

  // Api Call to delete practitioners
  let promises = toRemove.map((prac) => serve.delete(PRACTITIONERROLE_DEL + prac));
  await Promise.all(promises);

  // Api Call to add practitioners
  const toAddPractitioner = practitioner.filter((e) => toAdd.includes(e.identifier.official.value));
  promises = toAddPractitioner.map((prac) => {
    const id = v4();
    const payload: FhirObject<Omit<PractitionerRole, 'meta'>> = {
      resourceType: 'PractitionerRole',
      active: true,
      id: id,
      identifier: [{ use: 'official', value: id }],
      practitioner: { reference: 'Practitioner/' + prac.identifier.official.value },
      organization: { reference: 'Organization/' + teamId },
    };
    return serve.create(payload);
  });
  await Promise.all(promises);

  sendSuccessNotification(langObj.MSG_ASSIGN_PRACTITONERS_SUCCESS);
}

/**
 * Function to make teams API call
 *
 * @param {string} fhirbaseURL - base url
 * @param {Organization} payload payload To send
 * @param {string} id of the team if already created
 * @param {Lang} langObj - the translation string lookup
 */
export async function setTeam(
  fhirbaseURL: string,
  payload: FhirObject<Omit<Organization, 'meta'>>,
  id?: string,
  langObj: Lang = lang
) {
  const serve = FHIR.client(fhirbaseURL);
  if (id) {
    console.log(payload, fhirbaseURL + TEAMS_PUT + id);
    await serve.update(payload);
    sendSuccessNotification(langObj.MSG_TEAMS_UPDATE_SUCCESS);
  } else {
    console.log(payload, fhirbaseURL + TEAMS_POST);
    await serve.create(payload);
    sendSuccessNotification(langObj.MSG_TEAMS_ADD_SUCCESS);
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const queryClient = useQueryClient();
  const { allPractitioner, fhirbaseURL, id } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue = props.initialValue ?? { active: true, name: '', practitioners: [] };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) =>
        onSubmit(fhirbaseURL, setIsSubmitting, allPractitioner, initialValue, values, id)
          .then(() => {
            queryClient.invalidateQueries(TEAMS_GET);
            queryClient.invalidateQueries([TEAMS_GET, id]);
            history.goBack();
          })
          .catch(() => sendErrorNotification(lang.ERROR_OCCURRED))
          .finally(() => setIsSubmitting(false))
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
          {props.allPractitioner.map((prac) => (
            <Select.Option key={prac.id} value={prac.id}>
              {prac.name[0].given?.reduce((fullname, name) => `${fullname} ${name}`)}
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
