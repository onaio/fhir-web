import React from 'react';
import { Col, Space, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Resource404 } from '@opensrp/react-utils';
import { Button } from 'antd';
import { URL_USER_EDIT } from '../../constants';
import { UserGroupMembers } from '../UserGroupsList';
import { Link } from 'react-router-dom';
import lang from '../../lang';
import { KeycloakUserGroup } from '../../ducks/userGroups';

/** typings for the view details component */
export interface ViewDetailsProps {
  loading: boolean;
  error: boolean;
  GroupDetails: KeycloakUserGroup | undefined;
  userGroupMembers: UserGroupMembers[] | undefined;
  onClose: () => void;
}

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { loading, error, GroupDetails, userGroupMembers, onClose } = props;

  return (
    <Col className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => onClose()}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined />}
      />
      {loading ? (
        <Spin size="large" className="inline-spinner" />
      ) : error || !GroupDetails || !userGroupMembers ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{lang.NAME}</p>
            <p className="mb-0" id="name">
              {GroupDetails.name}
            </p>
          </div>
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{lang.GROUP_UUID}</p>
            <p className="mb-0" id="uuid">
              {GroupDetails.id}
            </p>
          </div>
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{lang.ROLES}</p>
            {GroupDetails.realmRoles?.length ? (
              GroupDetails.realmRoles.map((role, indx) => {
                // append word break to wrap underscored strings with css
                const wordBreakRoleName = role.split('_').join('_<wbr/>');
                return (
                  <p
                    key={`${role}-${indx}`}
                    className="mb-2"
                    id="realRole"
                    dangerouslySetInnerHTML={{ __html: wordBreakRoleName }}
                  />
                );
              })
            ) : (
              <p id="noRealRole">{lang.NO_ASSIGNED_ROLES}</p>
            )}
          </div>
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{lang.MEMBERS}</p>
            {userGroupMembers.length ? (
              userGroupMembers.map((userGroup) => (
                <p key={userGroup.id} className="mb-0" id="groupMember">
                  <Link key={userGroup.id} to={`${URL_USER_EDIT}/${userGroup.id}`} id="realRole">
                    {userGroup.username}
                  </Link>
                </p>
              ))
            ) : (
              <p id="noGroupMember">{lang.NO_ASSIGNED_MEMBERS}</p>
            )}
          </div>
        </Space>
      )}
    </Col>
  );
};

export { ViewDetails };
