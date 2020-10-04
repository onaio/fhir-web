import React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Yup from 'yup';
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
/** type intersection for all types that pertain to the props */
export declare type PropsTypes = Props & RouteComponentProps<RouteParams>;
/** default form initial values */
export declare const defaultInitialValues: KeycloakUser;
/** default props for editing user component */
export declare const defaultProps: Partial<PropsTypes>;
/** yup validations for practitioner data object from form */
export declare const userSchema: Yup.ObjectSchema<Yup.Shape<object | undefined, {
    lastName: string;
    firstName: string;
}>, object>;
declare const CreateEditUsers: React.FC<PropsTypes>;
export { CreateEditUsers };
export declare const ConnectedCreateEditUsers: import("react-redux").ConnectedComponent<React.FC<PropsTypes>, Pick<PropsTypes, "location" | "match" | "serviceClass" | "history" | "staticContext"> & Props & RouteComponentProps<RouteParams, import("react-router").StaticContext, import("history").History.UnknownFacade>>;
