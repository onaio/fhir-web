import * as React from 'react';
import { KeycloakUser, removeKeycloakUsers } from '../../ducks/user';
import { Dictionary } from '@onaio/utils';
import { TableActions } from './TableActions';

/**
 * Get table columns for user list
 *
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} accessToken - API access token
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} isLoadingCallback - callback function that sets loading state
 * @param {Dictionary} extraData - user profile extra data
 * @param {Dictionary} sortedInfo - applied sort
 * @returns {Dictionary[]} - an array of table columns
 */
export const getTableColumns = (
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  accessToken: string,
  keycloakBaseURL: string,
  isLoadingCallback: (loading: boolean) => void,
  extraData: Dictionary,
  sortedInfo?: Dictionary
): Dictionary[] => {
  const headerItems: string[] = ['Username', 'Email', 'First Name', 'Last Name'];
  const dataElements = [];
  const fields: string[] = ['username', 'email', 'firstName', 'lastName'];

  fields.forEach((field: string, index: number) => {
    dataElements.push({
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      filters: Array.from(new Set(dataFilters)),
      filteredValue:
        filteredInfo && filteredInfo[fields[index]] ? filteredInfo[fields[index]] : null,
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
        extraData,
      };
      return <TableActions {...tableActionsProps} />;
    },
  });

  return dataElements;
};
