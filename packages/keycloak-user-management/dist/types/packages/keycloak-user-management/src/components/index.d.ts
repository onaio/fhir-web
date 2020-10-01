/// <reference types="react" />
import '../Home/Home.css';
import { KeycloakService } from '../services';
import { KeycloakUser, fetchKeycloakUsers, removeKeycloakUsers } from '../ducks';
export interface Props {
    serviceClass: typeof KeycloakService;
    fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
    removeKeycloakUsersCreator: typeof removeKeycloakUsers;
    keycloakUsers: KeycloakUser[];
}
/** default props for UserIdSelect component */
export declare const defaultProps: {
    serviceClass: typeof KeycloakService;
    fetchKeycloakUsersCreator: (usersList?: KeycloakUser[]) => import("../ducks").FetchKeycloakUsersAction;
    removeKeycloakUsersCreator: () => import("../ducks").RemoveKeycloakUsersAction;
    keycloakUsers: never[];
};
/**
 * Handle user deletion
 */
export declare const deleteUser: (serviceClass: typeof KeycloakService, userId: string, fetchKeycloakUsersCreator: (usersList?: KeycloakUser[]) => import("../ducks").FetchKeycloakUsersAction, removeKeycloakUsersCreator: () => import("../ducks").RemoveKeycloakUsersAction) => void;
declare const Admin: {
    (props: Props): JSX.Element;
    defaultProps: {
        serviceClass: typeof KeycloakService;
        fetchKeycloakUsersCreator: (usersList?: KeycloakUser[]) => import("../ducks").FetchKeycloakUsersAction;
        removeKeycloakUsersCreator: () => import("../ducks").RemoveKeycloakUsersAction;
        keycloakUsers: never[];
    };
};
export { Admin };
declare const ConnectedAdminView: import("react-redux").ConnectedComponent<{
    (props: Props): JSX.Element;
    defaultProps: {
        serviceClass: typeof KeycloakService;
        fetchKeycloakUsersCreator: (usersList?: KeycloakUser[]) => import("../ducks").FetchKeycloakUsersAction;
        removeKeycloakUsersCreator: () => import("../ducks").RemoveKeycloakUsersAction;
        keycloakUsers: never[];
    };
}, Pick<Props, "serviceClass"> & import("./CreateEditUser").Props & import("react-router").RouteComponentProps<import("./CreateEditUser").RouteParams, import("react-router").StaticContext, unknown>>;
export default ConnectedAdminView;
