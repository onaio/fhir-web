import * as React from 'react';
import { Popconfirm, Divider, Dropdown, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { deleteUser } from './utils';
import { Link } from 'react-router-dom';
import {
  KeycloakUser,
  URL_USER_CREDENTIALS,
  URL_USER_EDIT,
  KEYCLOAK_URL_USERS,
} from '@opensrp/user-management';
import { Dictionary } from '@onaio/utils';
import { Column } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { QueryClient } from 'react-query';
import type { TFunction } from '@opensrp/i18n';

/**
 * Get table columns for user list
 *
 * @param keycloakBaseUrl - keycloak base url
 * @param baseUrl - server base url
 * @param extraData - session data about logged in user
 * @param queryClient - react query client
 * @param t - translator function
 * @param onViewDetails - callback when view details is clicked.
 */
export const getTableColumns = (
  keycloakBaseUrl: string,
  baseUrl: string,
  extraData: Dictionary,
  queryClient: QueryClient,
  t: TFunction,
  onViewDetails: (recordId: string) => void
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

  dataElements.push({
    title: t('Actions'),
    // eslint-disable-next-line react/display-name
    render: (_, record) => {
      return (
        <>
          <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
            {t('Edit')}
          </Link>
          <Divider type="vertical" />
          <Dropdown
            placement="bottomRight"
            arrow
            trigger={['click']}
            menu={(
              <Menu>
                <Menu.Item key="view-details" className="view-details">
                  <Button type="link">
                    <Button onClick={() => onViewDetails(record.id)} type="link">
                      {t('View Details')}
                    </Button>
                  </Button>
                </Menu.Item>
                <Menu.Item key="delete-user">
                  <Popconfirm
                    title={t('Are you sure you want to delete this user?')}
                    okText={t('Yes')}
                    cancelText={t('No')}
                    onConfirm={() => {
                      return deleteUser(keycloakBaseUrl, baseUrl, record.id, t).then(() => {
                        return queryClient
                          .invalidateQueries([KEYCLOAK_URL_USERS])
                          .catch(() =>
                            sendErrorNotification(
                              t(
                                'Failed to update data, please refresh the page to see the most recent changes'
                              )
                            )
                          );
                      });
                    }}
                  >
                    {user_id &&
                      (record.id === user_id ? null : (
                        <Button data-testid="delete-user" danger type="link" style={{ color: '#' }}>
                          {t('Delete')}
                        </Button>
                      ))}
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item key="credentials">
                  <Link to={`${URL_USER_CREDENTIALS}/${record.id}`} key="actions">
                    <Button type="link">{t('Credentials')}</Button>
                  </Link>
                </Menu.Item>
              </Menu>
            ) as MenuProps}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" rev={undefined} />
          </Dropdown>
        </>
      );
    },
  });

  return dataElements;
};
