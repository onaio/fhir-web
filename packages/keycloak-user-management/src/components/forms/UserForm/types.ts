import { KeycloakUser, Practitioner, UserAttributes, UserGroup } from '../../../ducks/user';
import { Dictionary } from '@onaio/utils';

export interface FormFields extends KeycloakUser {
  active?: boolean;
  userGroup?: string[];
  practitioner?: Practitioner;
}

export type FormFieldsKey = keyof FormFields | keyof UserAttributes;

/** props for editing a user view */
export interface UserFormProps {
  initialValues: FormFields;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  userGroups: UserGroup[];
  extraData: Dictionary;
  hiddenFields?: FormFieldsKey[];
  renderFields?: FormFieldsKey[];
}

// form field names
export const CONTACT_FORM_FIELD: FormFieldsKey = 'contact';
export const ATTRIBUTES_FORM_FIELD: FormFieldsKey = 'attributes';
