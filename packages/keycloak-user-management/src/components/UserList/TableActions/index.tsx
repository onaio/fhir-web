/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';
import { Popconfirm, Divider, Dropdown, Menu, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { deleteUser } from './utils';
import { Link } from 'react-router-dom';
import { KeycloakUser, removeKeycloakUsers } from '../../../ducks/user';
import { URL_USER_CREDENTIALS, URL_USER_EDIT } from '../../../constants';
import { Dictionary } from '@onaio/utils';
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
  const menu = (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title={t('Are you sure you want to delete this user?')}
          okText={t('Yes')}
          cancelText={t('No')}
          onConfirm={() =>
            deleteUser(removeKeycloakUsersCreator, keycloakBaseURL, opensrpBaseURL, record.id, t)
          }
        >
          {user_id &&
            (record.id === user_id ? null : (
              <Button danger type="link" style={{ color: '#' }}>
                {t('Delete')}
              </Button>
            ))}
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        {
          <Link to={`${URL_USER_CREDENTIALS}/${record.id}`} key="actions">
            <Button type="link">{t('Credentials')}</Button>
          </Link>
        }
      </Menu.Item>
      <Menu.Item
        className="viewDetails"
        style={{
          textAlign: 'center',
        }}
        onClick={() => setDetailsCallback(record)}
      >
        {t('View Details')}
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
        {t('Edit')}
      </Link>
      <Divider type="vertical" />
      <Dropdown overlay={menu}>
        <Button type="link" style={{ padding: 0, margin: 0 }}>
          <MoreOutlined
            className="more-options"
            style={{ fontSize: '16px', padding: 0, margin: 0 }}
          />
        </Button>
      </Dropdown>
    </>
  );
};

export { TableActions };
