import { KeycloakUser } from '..';
export declare const keycloakUsersArray: KeycloakUser[];
export declare const keycloakUser: {
    id: string;
    createdTimestamp: number;
    username: string;
    enabled: boolean;
    totp: boolean;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    email: string;
    disableableCredentialTypes: never[];
    requiredActions: never[];
    notBefore: number;
    access: {
        manageGroupMembership: boolean;
        view: boolean;
        mapRoles: boolean;
        impersonate: boolean;
        manage: boolean;
    };
};
