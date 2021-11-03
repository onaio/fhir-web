import React, { useState } from 'react';
import { Select, Button, Form as AntdForm, Radio, Input } from 'antd';
import { history } from '@onaio/connected-reducer-registry';
import { v4 } from 'uuid';
import {
  ORGANIZATION_ENDPOINT,
  PRACTITIONERROLE_ENDPOINT,
  PRACTITIONER_ENDPOINT,
  ORGANIZATION_RESOURCE_TYPE,
  PRACTITIONERROLE_RESOURCE_TYPE,
} from '../../constants';
import {
  sendSuccessNotification,
  sendInfoNotification,
  sendErrorNotification,
} from '@opensrp/notifications';
import { Organization, Practitioner, PractitionerRole } from '../../types';
import { useQueryClient } from 'react-query';

import lang from '../../lang';
import { SelectProps } from 'antd/lib/select';
import { FHIRServiceClass, Require } from '@opensrp/react-utils';

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 11 } };
const offsetLayout = { wrapperCol: { offset: 8, span: 11 } };

export interface FormField extends Partial<Organization> {
  practitioners: string[];
}

interface Props {
  fhirBaseURL: string;
  practitioners: Practitioner[];
  practitionerRoles?: PractitionerRole[];
  value?: Partial<FormField>;
}

/**
 * Handle form submission
 *
 * @param {string} fhirBaseURL - base url
 * @param {object} initialValue initialValue of form fields
 * @param {object} values value of form fields
 * @param {Practitioner} practitioners list of practitioner to refer to when adding or removing
 * @param {PractitionerRole} PractitionerRoles list of practitionerRole to remove or add
 */
export async function onSubmit(
  fhirBaseURL: string,
  initialValue: Partial<FormField>,
  values: Require<FormField, 'active' | 'name'>,
  practitioners: Practitioner[],
  PractitionerRoles?: PractitionerRole[]
) {
  const officialIdentifier =
    initialValue.identifier?.find((identifier) => identifier.use === 'official')?.value ?? v4();

  const payload: Organization = {
    resourceType: ORGANIZATION_RESOURCE_TYPE,
    id: initialValue.id ?? '',
    active: values.active,
    identifier: [{ use: 'official', value: officialIdentifier }],
    name: values.name,
  };

  const team = await setTeam(fhirBaseURL, payload);

  // Filter and seperate the practitioners uuid
  const toAdd = values.practitioners.filter((val) => !initialValue?.practitioners?.includes(val));
  const toRem = initialValue?.practitioners?.filter((val) => !values.practitioners.includes(val));

  await SetPractitioners(fhirBaseURL, team, toAdd, toRem ?? [], practitioners, PractitionerRoles);
}

/**
 * handle Practitioners
 *
 * @param {string} fhirBaseURL - base url
 * @param {Organization} team Oganization to be used to Practitioner
 * @param {string[]} toAdd list of practitioner uuid to add
 * @param {string[]} toRemove list of practitioner uuid to remove
 * @param {Practitioner[]} practitioner list of practitioner to refer to when adding or removing
 * @param {PractitionerRole[]} practitionerRole list of practitionerRole to remove or add
 */
async function SetPractitioners(
  fhirBaseURL: string,
  team: Organization,
  toAdd: string[],
  toRemove: string[],
  practitioner: Practitioner[],
  practitionerRole?: PractitionerRole[]
) {
  sendInfoNotification(lang.MSG_ASSIGN_PRACTITIONERS);
  const serve = new FHIRServiceClass(fhirBaseURL, PRACTITIONERROLE_RESOURCE_TYPE);

  // Api Call to delete practitioners
  const toRemoveRoles = toRemove
    .map((id) =>
      practitionerRole?.find(
        (role) =>
          role.organization.reference === `Organization/${team.id}` &&
          role.practitioner.reference === `Practitioner/${id}`
      )
    )
    // Filter undefined if nothing is found
    .filter((e) => !!e)
    .map((role) => role?.id);

  const remPromises = toRemoveRoles.map((roles) =>
    serve.delete(`${PRACTITIONERROLE_ENDPOINT}${roles}`)
  );
  await Promise.all(remPromises);

  // Api Call to add practitioners
  const toAddPractitioner = practitioner.filter((e) => toAdd.includes(e.id));

  const addPromises = toAddPractitioner.map((prac) => {
    const id = v4();
    const pracName = prac.name
      .find((e) => e.use === 'official')
      ?.given?.reduce((fullname, name) => `${fullname} ${name}`, '');
    const payload: Omit<PractitionerRole, 'meta'> = {
      resourceType: PRACTITIONERROLE_RESOURCE_TYPE,
      active: true,
      id: id,
      identifier: [{ use: 'official', value: id }],
      practitioner: { display: pracName ?? '', reference: `Practitioner/${prac.id}` },
      organization: { display: team.name, reference: `Organization/${team.id}` },
    };
    return serve.create(payload);
  });
  await Promise.all(addPromises);

  sendSuccessNotification(lang.MSG_ASSIGN_PRACTITONERS_SUCCESS);
}

/**
 * Function to make teams API call
 *
 * @param {string} fhirBaseURL - base url
 * @param {Organization} payload payload To send
 */
export async function setTeam(fhirBaseURL: string, payload: Omit<Organization, 'meta'>) {
  const serve = new FHIRServiceClass<Organization>(fhirBaseURL, ORGANIZATION_RESOURCE_TYPE);
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
  const { practitioners, practitionerRoles, fhirBaseURL } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const initialValue = props.value ?? {
    active: true,
    name: '',
    practitioners: [],
  };

  /** antd select component options */
  interface SelectOption {
    label: string;
    value: string;
  }

  /**
   * compose practitioners to practitioner select options
   *
   * @param practitioners a list of practitioners
   * @returns an array of select options
   */
  const getPractitionersOptions = (practitioners: Practitioner[]): SelectOption[] =>
    practitioners.map((practitioner) => ({
      label:
        practitioner.name
          .find((e) => e.use === 'official')
          ?.given?.reduce((fullName, name) => `${fullName} ${name}`) ?? '',
      value: practitioner.id,
    }));

  /**
   * filter practitioners select on search
   *
   * @param inputValue search term
   * @param option select option to filter against
   * @returns boolean - whether select option matches condition
   */
  const practitionersFilterFunction = (inputValue: string, option?: SelectOption) => {
    return !!option?.label.toLowerCase().includes(inputValue.toLowerCase());
  };

  return (
    <AntdForm
      {...layout}
      onFinish={(values) => {
        setIsSubmitting(true);
        onSubmit(fhirBaseURL, initialValue, values, practitioners, practitionerRoles)
          .then(() => {
            queryClient
              .invalidateQueries(ORGANIZATION_ENDPOINT)
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
            queryClient
              .invalidateQueries(PRACTITIONERROLE_ENDPOINT)
              .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
            queryClient
              .invalidateQueries(PRACTITIONER_ENDPOINT)
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
      <AntdForm.Item
        name="name"
        rules={[{ required: true, message: lang.REQUIRED_FIELD }]}
        label={lang.TEAM_NAME}
      >
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
        rules={[{ required: true, message: lang.REQUIRED_FIELD }]}
      >
        <Select
          allowClear
          mode="multiple"
          optionFilterProp="label"
          placeholder={lang.SELECT_PRACTITIONER}
          options={getPractitionersOptions(props.practitioners)}
          filterOption={practitionersFilterFunction as SelectProps<SelectOption[]>['filterOption']}
        />
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
