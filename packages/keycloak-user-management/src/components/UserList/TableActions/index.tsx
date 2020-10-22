import * as React from 'react';
import { Popconfirm, Space } from 'antd';
import { fetchKeycloakUsers, KeycloakUser, removeKeycloakUsers } from '@opensrp/store';
import { deleteUser } from './utils';
import { Link } from 'react-router-dom';
import { URL_USER_EDIT } from '../../../constants';

/** interface for component props */
export interface Props {
  fetchKeycloakUsersCreator: typeof fetchKeycloakUsers;
  removeKeycloakUsersCreator: typeof removeKeycloakUsers;
  accessToken: string;
  keycloakBaseURL: string;
  record: KeycloakUser;
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
    fetchKeycloakUsersCreator,
    removeKeycloakUsersCreator,
    accessToken,
    keycloakBaseURL,
  } = props;
  return (
    <>
      <Space size="middle">
        <Link to={`${URL_USER_EDIT}/${record.id}`} key="actions">
          Edit
        </Link>

        <Popconfirm
          title="Are you sure delete this user?"
          okText="Yes"
          cancelText="No"
          onConfirm={() =>
            deleteUser(
              fetchKeycloakUsersCreator,
              removeKeycloakUsersCreator,
              accessToken,
              keycloakBaseURL,
              record.id
            )
          }
        >
          <Link to="#">Delete</Link>
        </Popconfirm>
      </Space>
    </>
  );
};

export { TableActions };
