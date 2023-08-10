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
import { useTranslation } from '../../mls';
import type { TFunction } from '@opensrp/i18n';

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
  practitioners: Practitioner[];
  initialValue?: FormField | null;
  disableTeamMemberReassignment: boolean;
}

/**
 * Handle form submission
 *
 * @param opensrpBaseURL - base url
 * @param setIsSubmitting function to set IsSubmitting loading process
 * @param practitioner list of practitioner to filter the selected one from
 * @param initialValue initialValue of form fields
 * @param values value of form fields
 * @param t - the translation string lookup
 * @param id id of the team
 */
export function onSubmit(
  opensrpBaseURL: string,
  setIsSubmitting: (value: boolean) => void,
  practitioner: Practitioner[],
  initialValue: FormField,
  values: FormField,
  t: TFunction,
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

  setTeam(opensrpBaseURL, payload, t, id)
    .then(async () => {
      // Filter and seperate the practitioners uuid
      const toAdd = values.practitioners.filter((val) => !initialValue.practitioners.includes(val));
      const toRem = initialValue.practitioners.filter((val) => !values.practitioners.includes(val));

      await SetPractitioners(opensrpBaseURL, practitioner, toAdd, toRem, Teamid, t);
      history.goBack();
    })
    .catch(() => sendErrorNotification(t('There was a problem updating teams')))
    .finally(() => setIsSubmitting(false));
}

/**
 * handle Practitioners
 *
 * @param opensrpBaseURL - base url
 * @param practitioner list of practitioner to filter the selected one from
 * @param toAdd list of practitioner uuid to add
 * @param toRemove list of practitioner uuid to remove
 * @param id id of the team
 * @param t - the translation string lookup
 */
async function SetPractitioners(
  opensrpBaseURL: string,
  practitioner: Practitioner[],
  toAdd: string[],
  toRemove: string[],
  id: string,
  t: TFunction
) {
  sendInfoNotification(t('Assigning Practitioners'));

  // Api Call to delete practitioners
  toRemove.forEach((prac) => {
    const serve = new OpenSRPService(PRACTITIONER_DEL, opensrpBaseURL);
    serve
      .delete({ practitioner: `${prac}`, organization: id })
      .catch(() => sendErrorNotification(t('There was a problem deleting practitioner')));
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
    await serve
      .create(payload)
      .catch(() => sendErrorNotification(t('There was a problem adding practitioner')));
  }

  sendSuccessNotification(t('Successfully Assigned Practitioners'));
}

/**
 * Function to make teams API call
 *
 * @param opensrpBaseURL - base url
 * @param payload payload To send
 * @param t - the translator function
 * @param id of the team if already created
 */
export async function setTeam(
  opensrpBaseURL: string,
  payload: OrganizationPOST,
  t: TFunction,
  id?: string
) {
  if (id) {
    const serve = new OpenSRPService(TEAMS_PUT + id, opensrpBaseURL);
    await serve.update(payload);
    sendSuccessNotification(t('Successfully Updated Teams'));
  } else {
    const serve = new OpenSRPService(TEAMS_POST, opensrpBaseURL);
    await serve.create(payload);
    sendSuccessNotification(t('Successfully Added Teams'));
  }
}

export const Form: React.FC<Props> = ({
  initialValue: initialValueProp,
  practitioners,
  opensrpBaseURL,
  id,
  disableTeamMemberReassignment,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { t } = useTranslation();
  const initialValue = initialValueProp ?? {
    active: true,
    name: '',
    practitioners: [],
    practitionersList: [],
  };

  // when team member reassignment is disabled,
  // current team members are filtered out of the practitioners list.
  // hence the concat back
  const practitionersList = disableTeamMemberReassignment
    ? [...initialValue.practitionersList, ...practitioners]
    : practitioners;

  /**
   * function to filter select options by text - passed all select options to filter from
   *
   * @param input - typed in search text
   * @param option - a select option to be evaluated - with it's key, value, and children props
   * @param option.key - the Select.Option 'key' prop
   * @param option.value - the Select.Option 'value' prop
   * @param option.children - the Select.Option 'children' prop
   * @param option.label - the Select.Option 'label' prop
   * @returns {boolean} - matcher function that evaluates to boolean - whether to include option in filtered set or not
   */
  // Todo: type-check options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function filterFunction(input: string, option: any): boolean {
    let expr1 = false,
      expr2 = false;
    if (option.children) expr1 = option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    if (option.label) expr2 = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    return expr1 || expr2;
  }

  return (
    <AntdForm
      requiredMark={false}
      {...layout}
      onFinish={(values) =>
        onSubmit(opensrpBaseURL, setIsSubmitting, practitioners, initialValue, values, t, id)
      }
      initialValues={initialValue}
    >
      <AntdForm.Item name="name" label={t('Team Name')}>
        <Input placeholder={t('Enter a team name')} />
      </AntdForm.Item>

      <AntdForm.Item name="active" label={t('Status')}>
        <Radio.Group>
          <Radio value={true}>{t('Active')}</Radio>
          <Radio value={false}>{t('Inactive')}</Radio>
        </Radio.Group>
      </AntdForm.Item>

      <AntdForm.Item
        name="practitioners"
        label={t('Team Members')}
        tooltip={t('This is a required field')}
      >
        <Select
          allowClear
          mode="multiple"
          placeholder={t('Select users (practitioners only)')}
          showSearch
          optionFilterProp="children"
          filterOption={filterFunction}
        >
          {practitionersList.map((practitioner) => (
            <Select.Option key={practitioner.identifier} value={practitioner.identifier}>
              {`${practitioner.name} (${practitioner.username})`}
            </Select.Option>
          ))}
        </Select>
      </AntdForm.Item>

      <AntdForm.Item {...offsetLayout}>
        <Button id="submit" loading={isSubmitting} type="primary" htmlType="submit">
          {isSubmitting ? t('Saving') : t('Save')}
        </Button>
        <Button id="cancel" onClick={() => history.goBack()} type="dashed">
          {t('Cancel')}
        </Button>
      </AntdForm.Item>
    </AntdForm>
  );
};

export default Form;
