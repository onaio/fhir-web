import { KeycloakUser, Practitioner, UserAttributes, UserGroup } from '../../../ducks/user';
import { Dictionary } from '@onaio/utils';

export interface FormFields
  extends Pick<KeycloakUser, 'id' | 'username' | 'firstName' | 'lastName' | 'email' | 'enabled'> {
  active?: boolean;
  userGroups?: string[];
  practitioner?: Practitioner;
  keycloakUser?: KeycloakUser;
  contact?: string;
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
