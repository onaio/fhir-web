import React from 'react';
import * as Yup from 'yup';
import { KeycloakUser } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import { Dictionary } from '@onaio/utils/dist/types/types';
/** props for editing a user view */
export interface UserFormProps {
  accessToken: string;
  initialValues: KeycloakUser;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
}
/** interface user action */
export interface UserAction {
  alias: string;
  name: string;
  providerId: string;
  enabled: boolean;
  defaultAction: boolean;
  priority: number;
  config: Dictionary;
}
/** default form initial values */
export declare const defaultInitialValues: KeycloakUser;
/** default props for editing user component */
export declare const defaultProps: Partial<UserFormProps>;
/** yup validations for practitioner data object from form */
export declare const userSchema: Yup.ObjectSchema<
  Yup.Shape<
    object | undefined,
    {
      lastName: string;
      firstName: string;
    }
  >,
  object
>;
/**
 * Handle required actions change
 *
 * @param {string} selected - selected action
 * @param {Dispatch<SetStateAction<string[]>>} setRequiredActions - selected action dispatcher
 */
export declare const handleUserActionsChange: (
  selected: string[],
  setRequiredActions: React.Dispatch<React.SetStateAction<string[]>>
) => void;
declare const UserForm: React.FC<UserFormProps>;
export { UserForm };
