import React from 'react';
import { KeycloakUser } from '@opensrp/store';
interface Props {
    keycloakUsers: KeycloakUser[];
    accessToken: string;
}
export declare const Form: React.FC<Props>;
export default Form;
