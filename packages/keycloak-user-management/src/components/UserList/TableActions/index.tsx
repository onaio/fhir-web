/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';
import { Popconfirm, Divider, Dropdown, Menu, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { deleteUser } from './utils';
import { Link } from 'react-router-dom';
import { removeKeycloakUsers, KeycloakUser } from '../../../ducks/user';
import { URL_USER_CREDENTIALS, URL_USER_EDIT } from '../../../constants';
import { Dictionary } from '@onaio/utils';
import { CREDENTIALS_TEXT, DELETE, DELETE_USER_CONFIRMATION, EDIT, NO, YES } from '../../../lang';

export interface Props {
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  accessToken: string;
  keycloakBaseURL: string;
  record: KeycloakUser;
  isLoadingCallback: (loading: boolean) => void;
  extraData: Dictionary;
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
    accessToken,
    keycloakBaseURL,
    isLoadingCallback,
    extraData,
  } = props;
  const { user_id } = extraData;
  const menu = (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title={DELETE_USER_CONFIRMATION}
          okText={YES}
          cancelText={NO}
          onConfirm={() =>
            deleteUser(
              removeKeycloakUsersCreator,
              accessToken,
              keycloakBaseURL,
              record.id,
              isLoadingCallback
            )
          }
        >
          {user_id &&
            (record.id === user_id ? null : (
              <Button danger type="link" style={{ color: '#' }}>
                {DELETE}
              </Button>
            ))}
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        {
          <Link to={`${URL_USER_CREDENTIALS}/${record.id}`} key="actions">
            <Button type="link">{CREDENTIALS_TEXT}</Button>
          </Link>
        }
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
        {EDIT}
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
