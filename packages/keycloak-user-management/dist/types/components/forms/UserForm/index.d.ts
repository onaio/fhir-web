import React from 'react';
import { KeycloakUser } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import * as Yup from 'yup';
import '../../index.css';
/** props for editing a user view */
export interface UserFormProps {
  accessToken: string;
  initialValues: KeycloakUser;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
}
/** default form initial values */
export declare const defaultInitialValues: KeycloakUser;
/** default props for editing user component */
export declare const defaultProps: Partial<UserFormProps>;
export declare const userSchema: Yup.ObjectSchema<
  Yup.Shape<
    object | undefined,
    {
      lastName: string;
      firstName: string;
      email: string;
      username: string;
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
