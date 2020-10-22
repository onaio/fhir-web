import { KeycloakUser } from '@opensrp/store';
/**
 * Delete keycloak user
 *
 * @param {Function} fetchKeycloakUsersCreator - fetch users action creator
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} accessToken - access token
 * @param {string} keycloakBaseURL - keycloak api base URL
 * @param {string} userId - id of user to be deleted
 * @returns {void}
 */
export declare const deleteUser: (
  fetchKeycloakUsersCreator: (
    usersList?: KeycloakUser[] | undefined
  ) => import('@opensrp/store/dist/types').FetchKeycloakUsersAction,
  removeKeycloakUsersCreator: () => import('@opensrp/store/dist/types').RemoveKeycloakUsersAction,
  accessToken: string,
  keycloakBaseURL: string,
  userId: string
) => void;
