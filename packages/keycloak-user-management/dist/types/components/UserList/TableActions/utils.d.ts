/**
 * Delete keycloak user
 *
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} accessToken - access token
 * @param {string} keycloakBaseURL - keycloak api base URL
 * @param {string} userId - id of user to be deleted
 * @param {Function} isLoadingCallback - callback function that sets loading state
 * @returns {void}
 */
export declare const deleteUser: (
  removeKeycloakUsersCreator: () => import('@opensrp/store/dist/types').RemoveKeycloakUsersAction,
  accessToken: string,
  keycloakBaseURL: string,
  userId: string,
  isLoadingCallback: (loading: boolean) => void
) => void;
