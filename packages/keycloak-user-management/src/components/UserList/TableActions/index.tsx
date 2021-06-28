/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';
import { Popconfirm, Divider, Dropdown, Menu, Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { deleteUser } from './utils';
import { Link } from 'react-router-dom';
import { removeKeycloakUsers } from '../../../ducks/user';
import { URL_USER_CREDENTIALS, URL_USER_EDIT } from '../../../constants';
import { Dictionary } from '@onaio/utils';
import lang from '../../../lang';
import { TableData } from '..';

export interface Props {
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  keycloakBaseURL: string;
  opensrpBaseURL: string;
  record: TableData;
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
    keycloakBaseURL,
    opensrpBaseURL,
    isLoadingCallback,
    extraData,
  } = props;
  const { user_id } = extraData;
  const menu = (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title="Are you sure you want to delete this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={() =>
            deleteUser(
              removeKeycloakUsersCreator,
              keycloakBaseURL,
              opensrpBaseURL,
              record.id,
              isLoadingCallback
            )
          }
        >
          {user_id &&
            (record.id === user_id ? null : (
              <Button danger type="link" style={{ color: '#' }}>
                Delete
              </Button>
            ))}
        </Popconfirm>
      </Menu.Item>
      <Menu.Item>
        {
          <Link to={`${URL_USER_CREDENTIALS}/${record.id}`} key="actions">
            <Button type="link">Credentials</Button>
          </Link>
        }
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
        {lang.EDIT}
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
