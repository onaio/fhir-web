/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react';
import { Popconfirm, Divider, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { deleteUser } from './utils';
import { Link } from 'react-router-dom';
import { KeycloakUser, removeKeycloakUsers } from '../../../ducks/user';
import { URL_USER_CREDENTIALS, URL_USER_EDIT, UserQueryId } from '../../../constants';
import { Dictionary } from '@onaio/utils';
import { useQueryClient } from 'react-query';
import { sendErrorNotification } from '@opensrp/notifications';
import { useTranslation } from '../../../mls';

export interface Props {
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  record: KeycloakUser;
  extraData: Dictionary;
  setDetailsCallback: (keycloakUser: KeycloakUser) => void;
}

/**
 * Component TableActions
 *
 * @param {React.PropsTypes} props - component props
 * @returns {Element} - actions
 */
const TableActions = (props: Props): JSX.Element => {
  const {
    record,
    removeKeycloakUsersCreator,
    keycloakBaseURL,
    opensrpBaseURL,
    extraData,
    setDetailsCallback,
  } = props;
  const { t } = useTranslation();
  const { user_id } = extraData;
  const query = useQueryClient();

  const getItems = (record: KeycloakUser): MenuProps['items'] => [
    {
      key: '1',
      label: (
        <Popconfirm
          title={t('Are you sure you want to delete this user?')}
          okText={t('Yes')}
          cancelText={t('No')}
          onConfirm={() =>
            deleteUser(
              removeKeycloakUsersCreator,
              keycloakBaseURL,
              opensrpBaseURL,
              record.id,
              t
            ).then(() => {
              return query
                .invalidateQueries(UserQueryId)
                .catch(() =>
                  sendErrorNotification(
                    t(
                      'Failed to update data, please refresh the page to see the most recent changes'
                    )
                  )
                );
            })
          }
        >
          {user_id &&
            (record.id === user_id ? null : (
              <Button data-testid="delete-user" danger type="link" style={{ color: '#' }}>
                {t('Delete')}
              </Button>
            ))}
        </Popconfirm>
      )
    },
    {
      key: '2',
      label: (
        <Link to={`${URL_USER_CREDENTIALS}/${record.id}`} key="actions">
          <Button
            type="link"
            data-testid="credentials"
          >{t('Credentials')}</Button>
        </Link>
      )
    },
    {
      key: '3',
      label: (
        <Button
          type='link'
          className="viewDetails"
          data-testid="viewDetails"
          onClick={() => setDetailsCallback(record)}
        >
          {t('View Details')}
        </Button>
      )
    }
  ];

  return (
    <>
      <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
        {t('Edit')}
      </Link>
      <Divider type="vertical" />
      <Dropdown menu={{ items: getItems(record) }} placement="bottomRight" arrow trigger={['click']}>
        <Button type="link" style={{ padding: 0, margin: 0 }}>
          <MoreOutlined
            data-testid="action-dropdown"
            className="more-options"
            style={{ fontSize: '16px', padding: 0, margin: 0 }} rev={undefined} />
        </Button>
      </Dropdown>
    </>
  );
};

export { TableActions };
