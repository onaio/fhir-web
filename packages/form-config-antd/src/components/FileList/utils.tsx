import React from 'react';
import { Dictionary } from '@onaio/utils';
import { ManifestFilesTypes, formatDate } from '@opensrp/form-config-core';
import { TableActions } from './TableActions';
import { getFetchOptions } from '@opensrp/server-service';
import lang, { Lang } from '../../lang';

/**
 * Return table columns
 *
 * @param accessToken  Opensrp API access token
 * @param opensrpBaseURL Opensrp API base URL
 * @param isJsonValidator boolean to check whether is Json validator
 * @param uploadFileURL route to upload form
 * @param sortedInfo object containing sort order information
 * @param customFetchOptions custom Opensrp API fetch options
 * @param langObj the language translation object
 * @returns {Dictionary[]} table columns
 */
export const getTableColumns = (
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  uploadFileURL: string,
  sortedInfo?: Dictionary,
  customFetchOptions?: typeof getFetchOptions,
  langObj: Lang = lang
): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = [
    langObj.IDENTIFIER,
    langObj.FILE_NAME,
    langObj.FILE_VERSION,
    langObj.CREATED_AT,
  ];
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
      title: langObj.MODULE,
      dataIndex: 'module',
      key: 'module',
    });
  }

  columns.push({
    title: langObj.ACTION,
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
