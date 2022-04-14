import { Dictionary } from '@onaio/utils';
import { formatDate } from '@opensrp/form-config-core';
import { TFunction } from 'react-i18next';

/**
 * Return table columns
 *
 * @param isJsonValidator boolean to check whether is Json validator
 * @param sortedInfo object containing sort order information
 * @param langObj the language translation object
 * @returns {Dictionary[]} table columns
 */
export const getTableColumns = (
  isJsonValidator: boolean,
  t:TFunction,
  sortedInfo?: Dictionary,
): Dictionary[] => {
  const columns: Dictionary[] = [];
  const headerItems: string[] = [
    t('Identifier'),
    t('File Name'),
    t('File Version'),
    t('Created at')
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
      title: t('Module'),
      dataIndex: 'module',
      key: 'module',
    });
  }

  return columns;
};
