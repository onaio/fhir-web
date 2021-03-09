import React from 'react';
import { Dictionary } from '@onaio/utils';
import { ManifestFilesTypes, formatDate } from '@opensrp/form-config-core';
import { TableActions } from './TableActions';
import { getFetchOptions } from '@opensrp/server-service';

/**
 * Return table columns
 *
 * @param {string} accessToken Opensrp API access token
 * @param {string} opensrpBaseURL Opensrp API base URL
 * @param {boolean} isJsonValidator true if is json validator, false otherwise
 * @param {Dictionary} sortedInfo object containing sort order information
 * @param {Function} customFetchOptions Opensrp API custom options
 * @returns {Dictionary[]} table columns
 */
export const getTableColumns = (
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  sortedInfo?: Dictionary,
  customFetchOptions?: typeof getFetchOptions
): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = ['Identifier', 'File Name', 'File Version', 'Created At', 'Module'];
  const fields: string[] = ['identifier', 'label', 'version', 'createdAt', 'module'];

  fields.forEach((field: string, index: number) => {
    let column: Dictionary = {
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      sorter: (a: Dictionary, b: Dictionary) => {
        return a[fields[index]].length - b[fields[index]].length;
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === fields[index] && sortedInfo.order,
      ellipsis: true,
    };

    if (field === 'createdAt') {
      column = {
        ...column,
        render: (value: string) => formatDate(value),
      };
    }

    columns.push(column);
  });

  columns.push({
    title: 'Action',
    key: 'action',
    // eslint-disable-next-line react/display-name
    render: (_: string, file: ManifestFilesTypes) => {
      const tableActionProps = {
        file,
        accessToken,
        opensrpBaseURL,
        isJsonValidator,
        customFetchOptions,
      };
      return <TableActions {...tableActionProps} />;
    },
  });
  return columns;
};
