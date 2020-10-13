import React from 'react';
import { RouteComponentProps } from 'react-router';
import { fetchKeycloakUsers, KeycloakUser } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import '../../index.css';
/** inteface for route params */
export interface CredentialsRouteParams {
    userId: string;
}
/** props for editing a user view */
export interface CredentialsProps {
    accessToken: string;
    fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
    keycloakUser: KeycloakUser | null;
    serviceClass: typeof KeycloakService;
}
/** interface for data fields for team's form */
export interface UserCredentialsFormFields {
    password: string;
    confirm: string;
    temporary: boolean;
}
/** type intersection for all types that pertain to the props */
export declare type CredentialsPropsTypes = CredentialsProps & RouteComponentProps<CredentialsRouteParams>;
/** default props for editing user component */
export declare const defaultCredentialsProps: Partial<CredentialsPropsTypes>;
/** Handle form submission */
export declare const submitForm: (values: UserCredentialsFormFields, props: CredentialsPropsTypes) => void;
declare const UserCredentials: React.FC<CredentialsPropsTypes>;
export { UserCredentials };
export declare const ConnectedUserCredentials: import("react-redux").ConnectedComponent<React.FC<CredentialsPropsTypes>, Pick<CredentialsPropsTypes, "location" | "serviceClass" | "history" | "match" | "staticContext"> & CredentialsProps & RouteComponentProps<CredentialsRouteParams, import("react-router").StaticContext, unknown>>;
