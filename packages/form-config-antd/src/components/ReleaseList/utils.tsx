import React from 'react';
import { Dictionary } from '@onaio/utils';
import { ManifestReleasesTypes, formatDate } from '@opensrp/form-config-core';
import { TableActions } from './TableActions';

/**
 * Return table columns
 *
 * @param {string} viewReleaseURL URL to view the release details
 * @param {Dictionary} sortedInfo object containing sorting order information
 * @returns {Dictionary[]} table columns
 */
export const getTableColumns = (viewReleaseURL: string, sortedInfo?: Dictionary): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = ['Identifier', 'App Id', 'App Version', 'Updated At'];
  const fields: string[] = ['identifier', 'appId', 'appVersion', 'updatedAt'];

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

    if (field === 'identifier' || field === 'appVersion') {
      column = {
        ...column,
        render: (value: string) => `V${value}`,
      };
    }

    if (field === 'updatedAt') {
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
    render: (_: string, file: ManifestReleasesTypes) => {
      const tableActionProps = {
        file,
        viewReleaseURL,
      };
      return <TableActions {...tableActionProps} />;
    },
  });
  return columns;
};
