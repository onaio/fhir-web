import { Dictionary } from '@onaio/utils';
import lang, { Lang } from '../../lang';
import { Column } from '@opensrp/react-utils';
import { TableData } from '.';

/**
 * Get table columns for user list
 *
 * @param {Dictionary} sortedInfo - applied sort
 * @param {Lang} langObj - translations object lookup
 * @returns {Column<TableData>[]} - an array of table columns
 */
export const getTableColumns = (
  sortedInfo?: Dictionary,
  langObj: Lang = lang
): Column<TableData>[] => {
  const headerItems: string[] = [
    // langObj.USERNAME,
    langObj.EMAIL,
    langObj.FIRST_NAME,
    langObj.LAST_NAME,
  ];
  const dataElements: Column<TableData>[] = [];
  const fields: string[] = ['username', 'email', 'firstName', 'lastName'];

  fields.forEach((field: string, index: number) => {
    dataElements.push({
      title: headerItems[index],
      dataIndex: field as keyof TableData,
      key: field as keyof TableData,
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

  return dataElements;
};
