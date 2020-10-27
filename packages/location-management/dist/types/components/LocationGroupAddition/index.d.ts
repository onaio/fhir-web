import React from 'react';
import { KeycloakUser } from '@opensrp/store';
interface Props {
    keycloakUsers: KeycloakUser[];
    accessToken: string;
}
export declare const LocationUnitGroupAdd: React.FC<Props>;
export declare const ConnectedLocationUnitGroupAdd: import("react-redux").ConnectedComponent<React.FC<Props>, Pick<Props, never> & import("@opensrp/user-management/dist/types").EditUserProps & import("react-router").RouteComponentProps<import("@opensrp/user-management/dist/types").RouteParams, import("react-router").StaticContext, unknown>>;
export {};
