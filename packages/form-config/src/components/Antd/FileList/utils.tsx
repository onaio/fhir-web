import React from 'react';
import { Dictionary } from '@onaio/utils';
import { ManifestFilesTypes } from '../../../ducks/manifestFiles';
import { TableActions } from './TableActions';
import { getFetchOptions } from '@opensrp/server-service';

export const getTableColumns = (
  accessToken: string,
  opensrpBaseURL: string,
  isJsonValidator: boolean,
  formRoute: string,
  sortedInfo?: Dictionary,
  customFetchOptions?: typeof getFetchOptions
): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = ['Identifier', 'File Name', 'File Version', 'Created At'];
  const fields: string[] = ['identifier', 'label', 'version', 'createdAt'];

  fields.forEach((field: string, index: number) => {
    columns.push({
      title: headerItems[index],
      dataIndex: fields[index],
      key: fields[index],
      sorter: (a: Dictionary, b: Dictionary) => {
        if (b[fields[index]]) {
          return a[fields[index]].length - b[fields[index]].length;
        }
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === fields[index] && sortedInfo.order,
      ellipsis: true,
    });
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
        formRoute,
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
