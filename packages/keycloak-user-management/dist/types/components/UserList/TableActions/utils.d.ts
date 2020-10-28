import { KeycloakUser } from '../../../ducks/user';
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
    usersList?: KeycloakUser[]
  ) => import('../../../ducks/user').FetchKeycloakUsersAction,
  removeKeycloakUsersCreator: () => import('../../../ducks/user').RemoveKeycloakUsersAction,
  accessToken: string,
  keycloakBaseURL: string,
  userId: string
) => void;
