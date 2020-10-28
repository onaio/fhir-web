import * as React from 'react';
import { KeycloakUser, removeKeycloakUsers } from '../../ducks/user';
import { Dictionary } from '@onaio/utils';
import { TableActions } from './TableActions';

/**
 * Get data for the filter menu
 *
 * @param {KeycloakUser[]} users - keycloak users array
 * @param {string} field - key to get the value from a keycloak user object
 * @returns {Array<Dictionary>} - filter menu items
 */
export const getDataFilters = (users: KeycloakUser[], field: string): Dictionary[] =>
  users.map((filteredUser: KeycloakUser | Dictionary) => {
    return {
      text: (filteredUser as Dictionary)[field],
      value: (filteredUser as Dictionary)[field],
    };
  });

/**
 * Get table columns for user list
 *
 * @param {KeycloakUser[]} users - array of keyloak users
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} accessToken - API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} isLoadingCallback - callback function that sets loading state
 * @param {Dictionary} filteredInfo - applied filters
 * @param {Dictionary} sortedInfo - applied sort
 * @returns {Dictionary[]} - an array of table columns
 */
export const getTableColumns = (
  users: KeycloakUser[],
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  accessToken: string,
  keycloakBaseURL: string,
  isLoadingCallback: (loading: boolean) => void,
  filteredInfo?: Dictionary,
  sortedInfo?: Dictionary
): Dictionary[] => {
  const headerItems: string[] = ['Username', 'Email', 'First Name', 'Last Name'];
  const dataElements = [];
  const fields: string[] = ['username', 'email', 'firstName', 'lastName'];

  fields.forEach((field: string, index: number) => {
    const dataFilters = users.map((filteredUser: KeycloakUser | Dictionary) => {
      return {
        text: (filteredUser as Dictionary)[field],
        value: (filteredUser as Dictionary)[field],
      };
    });
    dataElements.push({
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      filters: Array.from(new Set(dataFilters)),
      filteredValue: (filteredInfo && filteredInfo[fields[index]]) || null,
      onFilter: (value: string, record: Dictionary) => record[fields[index]].includes(value),
      sorter: (a: Dictionary, b: Dictionary) => {
        if (b[fields[index]]) {
          return a[fields[index]].length - b[fields[index]].length;
        }
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === fields[index] && sortedInfo.order,
      ellipsis: true,
    });
  });
  // append action column
  dataElements.push({
    title: 'Actions',
    dataIndex: 'actions',
    key: 'Actions',
    // eslint-disable-next-line react/display-name
    render: (_: string, record: KeycloakUser) => {
      const tableActionsProps = {
        removeKeycloakUsersCreator,
        accessToken,
        keycloakBaseURL,
        isLoadingCallback,
        record,
      };
      return <TableActions {...tableActionsProps} />;
    },
  });

  return dataElements;
};
