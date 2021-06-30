import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import {
  TEAMS_GET,
  PRACTITIONERROLE_DEL,
  PRACTITIONERROLE_GET,
  PRACTITIONER_GET,
} from '../../constants';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { Organization, OrganizationDetail, Practitioner, PractitionerRole } from '../../types';
import { useQueryClient } from 'react-query';

import lang from '../../lang';
import FHIR from 'fhirclient';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField {
  team?: OrganizationDetail;
  name: string;
  active: boolean;
  practitioners: string[];
}

interface Props {
  fhirbaseURL: string;
  allPractitioner: Practitioner[];
  allPractitionerRole?: PractitionerRole[];
  initialValue?: FormField;
}

/**
 * Handle form submission
 *
 * @param {string} fhirbaseURL - base url
 * @param {object} initialValue initialValue of form fields
 * @param {object} values value of form fields
 * @param {Practitioner} practitioner list of practitioner to refer to when adding or removing
 * @param {PractitionerRole} allPractitionerRole list of practitionerRole to remove or add
 */
export async function onSubmit(
  fhirbaseURL: string,
  initialValue: FormField,
  values: FormField,
  practitioner: Practitioner[],
  allPractitionerRole?: PractitionerRole[]
) {
  const officialidentifier = initialValue.team
    ? initialValue.team.identifier?.find((e) => e.use === 'official')?.value
    : v4();

  const payload: Organization = {
    resourceType: 'Organization',
    id: initialValue.team ? initialValue.team.id : '',
    active: values.active,
    identifier: [{ use: 'official', value: officialidentifier }],
    name: values.name,
  };

  const team = await setTeam(fhirbaseURL, payload);

  // Filter and seperate the practitioners uuid
  const toAdd = values.practitioners.filter((val) => !initialValue.practitioners.includes(val));
  const toRem = initialValue.practitioners.filter((val) => !values.practitioners.includes(val));

  await SetPractitioners(fhirbaseURL, team.id, toAdd, toRem, practitioner, allPractitionerRole);
}

/**
 * handle Practitioners
 *
 * @param {string} fhirbaseURL - base url
 * @param {string} teamId id of the team
 * @param {string[]} toAdd list of practitioner uuid to add
 * @param {string[]} toRemove list of practitioner uuid to remove
 * @param {Practitioner[]} practitioner list of practitioner to refer to when adding or removing
 * @param {PractitionerRole[]} practitionerrole list of practitionerRole to remove or add
 */
async function SetPractitioners(
  fhirbaseURL: string,
  teamId: string,
  toAdd: string[],
  toRemove: string[],
  practitioner: Practitioner[],
  practitionerrole?: PractitionerRole[]
) {
  sendInfoNotification(lang.MSG_ASSIGN_PRACTITIONERS);
  const serve = FHIR.client(fhirbaseURL);

  // Api Call to delete practitioners
  const toremoveroles = toRemove
    .map((id) =>
      practitionerrole?.find(
        (role) =>
          role.organization.reference === `Organization/${teamId}` &&
          role.practitioner.reference === `Practitioner/${id}`
      )
    )
    .map((role) => role?.id);
  const rempromises = toremoveroles.map((roles) => serve.delete(`${PRACTITIONERROLE_DEL}${roles}`));
  await Promise.all(rempromises);

  // Api Call to add practitioners
  const toAddPractitioner = practitioner.filter((e) => toAdd.includes(e.id));

  const addpromises = toAddPractitioner.map((prac) => {
    const id = v4();
    const payload: Omit<PractitionerRole, 'meta'> = {
      resourceType: 'PractitionerRole',
      active: true,
      id: id,
      identifier: [{ use: 'official', value: id }],
      practitioner: { reference: 'Practitioner/' + prac.id },
      organization: { reference: 'Organization/' + teamId },
    };
    return serve.create(payload);
  });
  await Promise.all(addpromises);

  sendSuccessNotification(lang.MSG_ASSIGN_PRACTITONERS_SUCCESS);
}

/**
 * Function to make teams API call
 *
 * @param {string} fhirbaseURL - base url
 * @param {Organization} payload payload To send
 */
export async function setTeam(fhirbaseURL: string, payload: Omit<Organization, 'meta'>) {
  const serve = FHIR.client(fhirbaseURL);
  if (payload.id) {
    const resp: Organization = await serve.update(payload);
    sendSuccessNotification(lang.MSG_TEAMS_UPDATE_SUCCESS);
    return resp;
  } else {
    const resp: Organization = await serve.create(payload);
    sendSuccessNotification(lang.MSG_TEAMS_ADD_SUCCESS);
    return resp;
  }
}

export const Form: React.FC<Props> = (props: Props) => {
  const queryClient = useQueryClient();
  const { allPractitioner, allPractitionerRole, fhirbaseURL } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue = props.initialValue ?? {
    active: true,
    name: '',
    practitioners: [],
  };

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) => {
        setIsSubmitting(true);
        onSubmit(fhirbaseURL, initialValue, values, allPractitioner, allPractitionerRole)
          .then(() => {
            queryClient
              .invalidateQueries(TEAMS_GET)
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
            queryClient
              .invalidateQueries(PRACTITIONERROLE_GET)
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
            queryClient
              .invalidateQueries(PRACTITIONER_GET)
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
            queryClient
              .invalidateQueries([TEAMS_GET, initialValue.team?.id])
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
            history.goBack();
          })
          .catch(() => sendErrorNotification(lang.ERROR_OCCURRED))
          .finally(() => setIsSubmitting(false));
      }}
      initialValues={initialValue}
    >
      <AntdForm.Item name="uuid" label={lang.TEAM_NAME} hidden={true}>
        <Input />
      </AntdForm.Item>

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
