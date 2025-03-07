import { KeycloakUser, Practitioner, UserAttributes, UserGroup } from '../../../ducks/user';
import { Dictionary } from '@onaio/utils';
import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { TFunction } from '@opensrp/i18n';
import { IPractitionerRole } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitionerRole';
import {
  fhirCoreAppIdField,
  passwordField,
  PRACTITIONER,
  SUPERVISOR,
  userGroupsField,
  userTypeField,
} from '../../../constants';

export interface FormFields
  extends Pick<
    KeycloakUser,
    | 'id'
    | 'username'
    | 'firstName'
    | 'lastName'
    | 'nationalId'
    | 'phoneNumber'
    | 'email'
    | 'enabled'
  > {
  active?: boolean;
  [userTypeField]?: typeof PRACTITIONER | typeof SUPERVISOR;
  [userGroupsField]?: string[];
  practitioner?: Practitioner | IPractitioner;
  keycloakUser?: KeycloakUser;
  practitionerRole?: IPractitionerRole;
  [fhirCoreAppIdField]?: string;
  [passwordField]?: string;
}

export type FormFieldsKey = keyof FormFields | keyof UserAttributes;
export type PractitionerUpdaterFun = (
  values: FormFields,
  userId: string,
  t: TFunction
) => Promise<void>;
export type PractitionerUpdaterFactory = (baseUrl: string) => PractitionerUpdaterFun;

/** props for editing a user view */
export interface UserFormProps {
  initialValues: FormFields;
  keycloakBaseURL: string;
  baseUrl: string;
  userGroups: UserGroup[];
  extraData: Dictionary;
  hiddenFields?: FormFieldsKey[];
  renderFields?: FormFieldsKey[];
  practitionerUpdaterFactory: PractitionerUpdaterFactory;
}

/** descibes antd select component options */
export interface SelectOption {
  label: string;
  value: string;
}

// form field names
export const CONTACT_FORM_FIELD: FormFieldsKey = 'contact';
