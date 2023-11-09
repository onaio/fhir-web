import * as React from 'react';
import { Divider, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  KeycloakUser,
  URL_USER_EDIT,
  URL_USER_CREDENTIALS,
  URL_USER,
} from '@opensrp/user-management';
import { Dictionary } from '@onaio/utils';
import { Column } from '@opensrp/react-utils';
import type { TFunction } from '@opensrp/i18n';
import { RbacCheck, UserRole } from '@opensrp/rbac';
import { History } from 'history';
import { UserDeleteBtn } from '../../UserDeleteBtn';

/**
 * Get table columns for user list
 *
 * @param keycloakBaseUrl - keycloak base url
 * @param baseUrl - server base url
 * @param extraData - session data about logged in user
 * @param t - translator function
 * @param userRole - role of logged in user.
 * @param history - history object for managing navigation
 */
export const getTableColumns = (
  keycloakBaseUrl: string,
  baseUrl: string,
  extraData: Dictionary,
  t: TFunction,
  userRole: UserRole,
  history: History
): Column<KeycloakUser>[] => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { user_id } = extraData;
  const headerItems: string[] = [t('First name'), t('Last name'), t('Username')];
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
      ellipsis: true,
    });
  });

  const getItems = (record: KeycloakUser): MenuProps['items'] => {
    const items = [
      {
        key: '1',
        permissions: ['iam_user.read'],
        label: (
          <Button onClick={() => history.push(`${URL_USER}/${record.id}`)} type="link">
            {t('View Details')}
          </Button>
        ),
      },
      {
        key: '3',
        permissions: ['iam_user.update'],
        label: (
          <Button
            type="link"
            data-testid="credentials"
            onClick={() => {
              history.push(`${URL_USER_CREDENTIALS}/${record.id}/${record.username}`);
            }}
          >
            {t('Credentials')}
          </Button>
        ),
      },
    ];
    // don't show delete for the current logged in user - back compatibility reasons.
    if (user_id && record.id !== user_id) {
      items.push({
        key: '2',
        permissions: ['iam_user.delete'],
        label: (
          <UserDeleteBtn
            keycloakBaseUrl={keycloakBaseUrl}
            fhirBaseUrl={baseUrl}
            resourceId={record.id}
          />
        ),
      });
    }
    return items
      .filter((item) => userRole.hasPermissions(item.permissions))
      .map((item) => {
        const { permissions, ...rest } = item;
        return rest;
      });
  };

  dataElements.push({
    title: t('Actions'),
    // eslint-disable-next-line react/display-name
    render: (_, record) => {
      return (
        <>
          <RbacCheck permissions={['iam_user.update']}>
            <>
              <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
                {t('Edit')}
              </Link>
              <Divider type="vertical" />
            </>
          </RbacCheck>
          <Dropdown
            placement="bottomRight"
            arrow
            trigger={['click']}
            menu={{ items: getItems(record) }}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" />
          </Dropdown>
        </>
      );
    },
  });

  return dataElements;
};
