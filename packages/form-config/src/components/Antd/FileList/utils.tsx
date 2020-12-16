import React from 'react';
import { Dictionary } from '@onaio/utils';
import { ManifestFilesTypes } from '../../../ducks/manifestFiles';
import { TableActions } from './TableActions';
import { getFetchOptions } from '@opensrp/server-service';
import { formatDate } from '../../../helpers/utils';

/**
 * Return table columns
 *
 * @param {string} accessToken  Opensrp API access token
 * @param {string} opensrpBaseURL Opensrp API base URL
 * @param {boolean} isJsonValidator boolean to check whether is Json validator
 * @param {string} uploadFileURL route to upload form
 * @param {Dictionary }sortedInfo object containing sort order information
 * @param {Function} customFetchOptions custom Opensrp API fetch options
 * @returns {Dictionary[]} table columns
 */
export const getTableColumns = (
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  uploadFileURL: string,
  sortedInfo?: Dictionary,
  customFetchOptions?: typeof getFetchOptions
): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = ['Identifier', 'File Name', 'File Version', 'Created At'];
  const fields: string[] = ['identifier', 'label', 'version', 'createdAt'];

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

  if (!isJsonValidator) {
    columns.push({
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
    });
  }

  columns.push({
    title: 'Action',
    key: 'action',
    // eslint-disable-next-line react/display-name
    render: (_: string, file: ManifestFilesTypes) => {
      const tableActionProps = {
        file,
        uploadFileURL,
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
