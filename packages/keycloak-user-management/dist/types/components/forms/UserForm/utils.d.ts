import { Dictionary } from '@onaio/utils';
import { Dispatch, SetStateAction } from 'react';
import { KeycloakService } from '@opensrp/keycloak-service';
import { KeycloakUser } from '../../../ducks/user';
/**
 * Handle form submission
 *
 * @param {Dictionary} values - form values
 * @param {string} accessToken - keycloak API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 * @param {Function} setSubmitting - method to set submission status
 * @param {string} userId - keycloak user id, required when editing a user
 */
export declare const submitForm: (values: Partial<KeycloakUser>, accessToken: string, keycloakBaseURL: string, keycloakServiceClass: typeof KeycloakService, setSubmitting: (isSubmitting: boolean) => void, userId?: string | undefined) => void;
/** interface user action */
export interface UserAction {
    alias: string;
    name: string;
    providerId: string;
    enabled: boolean;
    defaultAction: boolean;
    priority: number;
    config: Dictionary;
}
/**
 * Fetch keycloak user action options
 *
 * @param {string} accessToken - keycloak API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} setUserActionOptions - method to set state for selected actions
 * @param {KeycloakService} keycloakServiceClass - keycloak API service class
 */
export declare const fetchRequiredActions: (accessToken: string, keycloakBaseURL: string, setUserActionOptions: Dispatch<SetStateAction<UserAction[]>>, keycloakServiceClass: typeof KeycloakService) => void;
