import * as Yup from 'yup';
import React from 'react';
import { KeycloakUser } from '@opensrp/store';
/** yup validations for practitioner data object from form */
export declare const userSchema: Yup.ObjectSchema<Yup.Shape<object | undefined, {
    name: string;
    status: string;
    type: string;
}>, object>;
interface Props {
    keycloakUsers: KeycloakUser[];
    accessToken: string;
}
export declare const Form: React.FC<Props>;
export default Form;
