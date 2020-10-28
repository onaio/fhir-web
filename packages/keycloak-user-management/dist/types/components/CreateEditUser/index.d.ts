import React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';
import { KeycloakUser, fetchKeycloakUsers } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import '../../index.css';
/** inteface for route params */
export interface RouteParams {
  userId: string;
}
/** props for editing a user view */
export interface EditUserProps {
  accessToken: string;
  keycloakUser: KeycloakUser | null;
  serviceClass: typeof KeycloakService;
  keycloakBaseURL: string;
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
}
/** type intersection for all types that pertain to the props */
export declare type CreateEditPropTypes = EditUserProps & RouteComponentProps<RouteParams>;
/** default form initial values */
export declare const defaultInitialValues: KeycloakUser;
/** default props for editing user component */
export declare const defaultEditUserProps: EditUserProps;
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
 *
 * @param props - CreateEditUser component props
 */
declare const CreateEditUser: React.FC<CreateEditPropTypes>;
export { CreateEditUser };
export declare const ConnectedCreateEditUser: import('react-redux').ConnectedComponent<
  React.FC<CreateEditPropTypes>,
  Pick<
    CreateEditPropTypes,
    | 'location'
    | 'fetchKeycloakUsersCreator'
    | 'keycloakBaseURL'
    | 'serviceClass'
    | 'history'
    | 'match'
    | 'staticContext'
  > &
    EditUserProps &
    RouteComponentProps<RouteParams, import('react-router').StaticContext, unknown>
>;
