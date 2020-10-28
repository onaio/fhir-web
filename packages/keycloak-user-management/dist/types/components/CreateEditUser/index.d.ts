import React from 'react';
import { RouteComponentProps } from 'react-router';
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
/** default props for editing user component */
export declare const defaultEditUserProps: EditUserProps;
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
    | 'keycloakBaseURL'
    | 'fetchKeycloakUsersCreator'
    | 'serviceClass'
    | 'history'
    | 'match'
    | 'staticContext'
  > &
    EditUserProps &
    RouteComponentProps<RouteParams, import('react-router').StaticContext, unknown>
>;
