import { Dictionary } from '@onaio/utils';
import { formatDate } from '@opensrp-web/form-config-core';

/**
 * Return table columns
 *
 * @param {Dictionary} sortedInfo object containing sort order information
 * @returns {Dictionary[]} table columns
 */
export const getTableColumns = (sortedInfo?: Dictionary): Dictionary[] => {
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

  return columns;
};
