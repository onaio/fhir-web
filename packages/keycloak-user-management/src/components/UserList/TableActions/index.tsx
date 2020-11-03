/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';
import { Popconfirm, Space } from 'antd';
import { deleteUser } from './utils';
import { Link } from 'react-router-dom';
import { removeKeycloakUsers, KeycloakUser } from '../../../ducks/user';
import { URL_USER_EDIT } from '../../../constants';
import { Dictionary } from '@onaio/utils/dist/types/types';

/** interface for component props */
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
              removeKeycloakUsersCreator,
              accessToken,
              keycloakBaseURL,
              record.id,
              isLoadingCallback
            )
          }
        >
          {user_id && record.id !== user_id && <Link to="#">Delete</Link>}
        </Popconfirm>
      </Space>
    </>
  );
};

export { TableActions };
