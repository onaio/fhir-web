import { Dictionary } from '@onaio/utils';
import { formatDate } from '@opensrp/form-config-core';
import lang, { Lang } from '../../lang';

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
  sortedInfo?: Dictionary,
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

  return columns;
};
