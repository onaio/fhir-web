import React from 'react';
import { RouteComponentProps } from 'react-router';
import { fetchKeycloakUsers, KeycloakUser } from '@opensrp/store';
import { KeycloakService } from '@opensrp/keycloak-service';
import '../../index.css';
/** inteface for route params */
export interface RouteParams {
    userId: string;
}
/** props for editing a user view */
export interface Props {
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
export declare type PropsTypes = Props & RouteComponentProps<RouteParams>;
/** default props for editing user component */
export declare const defaultProps: Partial<PropsTypes>;
/** Handle form submission */
export declare const submitForm: (values: UserCredentialsFormFields, props: PropsTypes) => void;
declare const UserCredentials: React.FC<PropsTypes>;
export { UserCredentials };
export declare const ConnectedUserCredentials: import("react-redux").ConnectedComponent<React.FC<PropsTypes>, Pick<PropsTypes, "location" | "match" | "serviceClass" | "history" | "staticContext"> & Props & RouteComponentProps<RouteParams, import("react-router").StaticContext, import("history").History.UnknownFacade>>;
