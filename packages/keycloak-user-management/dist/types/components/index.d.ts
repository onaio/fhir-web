/// <reference types="react" />
import { KeycloakService } from '@opensrp/keycloak-service';
import { KeycloakUser, fetchKeycloakUsers, removeKeycloakUsers } from '@opensrp/store';
export interface Props {
    serviceClass: typeof KeycloakService;
    fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
    removeKeycloakUsersCreator: typeof removeKeycloakUsers;
    keycloakUsers: KeycloakUser[];
    accessToken: string;
}
/** default props for UserIdSelect component */
export declare const defaultProps: {
    accessToken: string;
    serviceClass: typeof KeycloakService;
    fetchKeycloakUsersCreator: (usersList?: KeycloakUser[] | undefined) => import("@opensrp/store/dist/types").FetchKeycloakUsersAction;
    removeKeycloakUsersCreator: () => import("@opensrp/store/dist/types").RemoveKeycloakUsersAction;
    keycloakUsers: never[];
};
/**
 * Handle user deletion
 */
export declare const deleteUser: (props: Props, userId: string) => void;
declare const Admin: {
    (props: Props): JSX.Element;
    defaultProps: {
        accessToken: string;
        serviceClass: typeof KeycloakService;
        fetchKeycloakUsersCreator: (usersList?: KeycloakUser[] | undefined) => import("@opensrp/store/dist/types").FetchKeycloakUsersAction;
        removeKeycloakUsersCreator: () => import("@opensrp/store/dist/types").RemoveKeycloakUsersAction;
        keycloakUsers: never[];
    };
};
export { Admin };
export declare const ConnectedAdminView: import("react-redux").ConnectedComponent<{
    (props: Props): JSX.Element;
    defaultProps: {
        accessToken: string;
        serviceClass: typeof KeycloakService;
        fetchKeycloakUsersCreator: (usersList?: KeycloakUser[] | undefined) => import("@opensrp/store/dist/types").FetchKeycloakUsersAction;
        removeKeycloakUsersCreator: () => import("@opensrp/store/dist/types").RemoveKeycloakUsersAction;
        keycloakUsers: never[];
    };
}, Pick<Props, "serviceClass"> & import("./CreateEditUser").Props & import("react-router").RouteComponentProps<import("./CreateEditUser").RouteParams, import("react-router").StaticContext, import("history").History.UnknownFacade>>;
