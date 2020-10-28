import { KeycloakUser } from '../../ducks/user';
import { Dictionary } from '@onaio/utils';
/**
 * Get data for the filter menu
 *
 * @param {KeycloakUser[]} users - keycloak users array
 * @param {string} field - key to get the value from a keycloak user object
 * @returns {Array<Dictionary>} - filter menu items
 */
export declare const getDataFilters: (users: KeycloakUser[], field: string) => Dictionary<any>[];
/**
 * Get table columns for user list
 *
 * @param {KeycloakUser[]} users - array of keyloak users
 * @param {Function} fetchKeycloakUsersCreator - fetch users action creator
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} accessToken - API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Dictionary} filteredInfo - applied filters
 * @param {Dictionary} sortedInfo - applied sort
 * @returns {Dictionary[]} - an array of table columns
 */
export declare const getTableColumns: (
  users: KeycloakUser[],
  fetchKeycloakUsersCreator: (
    usersList?: KeycloakUser[]
  ) => import('../../ducks/user').FetchKeycloakUsersAction,
  removeKeycloakUsersCreator: () => import('../../ducks/user').RemoveKeycloakUsersAction,
  accessToken: string,
  keycloakBaseURL: string,
  filteredInfo?: Dictionary<any> | undefined,
  sortedInfo?: Dictionary<any> | undefined
) => Dictionary<any>[];
