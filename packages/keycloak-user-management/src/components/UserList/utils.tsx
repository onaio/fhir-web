import * as React from 'react';
import { KeycloakUser, removeKeycloakUsers } from '../../ducks/user';
import { Dictionary } from '@onaio/utils';
import { TableActions } from './TableActions';
import { EMAIL, FIRST_NAME, LAST_NAME, USERNAME } from '../../lang';

/**
 * Get table columns for user list
 *
 * @param {Function} removeKeycloakUsersCreator - remove users action creator
 * @param {string} keycloakBaseURL - keycloak API base URL
 * @param {Function} isLoadingCallback - callback function that sets loading state
 * @param {Dictionary} extraData - user profile extra data
 * @param {Dictionary} sortedInfo - applied sort
 * @returns {Dictionary[]} - an array of table columns
 */
export const getTableColumns = (
  removeKeycloakUsersCreator: typeof removeKeycloakUsers,
  keycloakBaseURL: string,
  isLoadingCallback: (loading: boolean) => void,
  extraData: Dictionary,
  sortedInfo?: Dictionary
): Dictionary[] => {
  const headerItems: string[] = [USERNAME, EMAIL, FIRST_NAME, LAST_NAME];
  const dataElements = [];
  const fields: string[] = ['username', 'email', 'firstName', 'lastName'];

  fields.forEach((field: string, index: number) => {
    dataElements.push({
      title: headerItems[index],
      dataIndex: field,
      key: field,
      sorter: (a: Dictionary, b: Dictionary) => {
        if (a[field] > b[field]) {
          return -1;
        } else if (a[field] < b[field]) {
          return 1;
        }
        return 0;
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === field && sortedInfo.order,
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
