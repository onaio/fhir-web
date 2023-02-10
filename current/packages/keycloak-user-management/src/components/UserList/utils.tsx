import { Dictionary } from '@onaio/utils';
import { Column } from '@opensrp/react-utils';
import type { TFunction } from '@opensrp/i18n';
import { KeycloakUser } from '../../ducks/user';

/**
 * Get table columns for user list
 *
 * @param  t - translations object lookup
 * @param sortedInfo - applied sort
 * @returns  an array of table columns
 */
export const getTableColumns = (t: TFunction, sortedInfo?: Dictionary): Column<KeycloakUser>[] => {
  const headerItems: string[] = [t('First Name'), t('Last Name'), t('Username')];
  const dataElements: Column<KeycloakUser>[] = [];
  const fields: string[] = ['firstName', 'lastName', 'username'];

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
