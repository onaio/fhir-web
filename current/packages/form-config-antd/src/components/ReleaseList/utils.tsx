import { Dictionary } from '@onaio/utils';
import { formatDate } from '@opensrp/form-config-core';
import type { TFunction } from '@opensrp/i18n';

/**
 * Return table columns
 *
 * @param t - the translator function
 * @param {Dictionary} sortedInfo object containing sorting order information
 * @returns {Dictionary[]} table columns
 */
export const getTableColumns = (t: TFunction, sortedInfo?: Dictionary): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = [t('Identifier'), t('App Id'), t('App Version'), t('Updated At')];
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

  return columns;
};
