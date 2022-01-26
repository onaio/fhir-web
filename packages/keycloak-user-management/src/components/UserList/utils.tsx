import { Dictionary } from '@onaio/utils';
import lang, { Lang } from '../../lang';
import { Column } from '@opensrp/react-utils';
import { KeycloakUser } from '../../ducks/user';

/**
 * Get table columns for user list
 *
 * @param {Dictionary} sortedInfo - applied sort
 * @param {Lang} langObj - translations object lookup
 * @returns {Column<KeycloakUser>[]} - an array of table columns
 */
export const getTableColumns = (
  sortedInfo?: Dictionary,
  langObj: Lang = lang
): Column<KeycloakUser>[] => {
  const headerItems: string[] = [
    langObj.EMAIL,
    langObj.FIRST_NAME,
    langObj.LAST_NAME,
    langObj.USERNAME,
  ];
  const dataElements: Column<KeycloakUser>[] = [];
  const fields: string[] = ['email', 'firstName', 'lastName', 'username'];

  fields.forEach((field: string, index: number) => {
    dataElements.push({
      title: headerItems[index],
      dataIndex: field as keyof KeycloakUser,
      key: field as keyof KeycloakUser,
      sorter: (a: Dictionary, b: Dictionary) => {
        if (a[field] > b[field]) return -1;
        else if (a[field] < b[field]) return 1;
        return 0;
      },
      sortOrder: sortedInfo && sortedInfo.columnKey === field && sortedInfo.order,
      ellipsis: true,
    });
  });

  return dataElements;
};
