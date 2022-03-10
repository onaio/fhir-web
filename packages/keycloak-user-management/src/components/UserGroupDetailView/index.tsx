import React from 'react';
import { Col, Space, Typography, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Resource404 } from '@opensrp/react-utils';
import { Button } from 'antd';
import { URL_USER_EDIT } from '../../constants';
import { UserGroupMembers } from '../UserGroupsList';
import { Link } from 'react-router-dom';
import lang from '../../lang';
import { KeycloakUserGroup } from '../../ducks/userGroups';
const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  isUserGroupMembersLoading: boolean;
  isUserGroupMembersError: boolean;
  userGroupMembers: UserGroupMembers[] | undefined;
  isGroupDetailsLoading: boolean;
  isGroupDetailsError: boolean;
  GroupDetails: KeycloakUserGroup | undefined;
  onClose: () => void;
}

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const {
    isUserGroupMembersLoading,
    isUserGroupMembersError,
    userGroupMembers,
    isGroupDetailsLoading,
    isGroupDetailsError,
    GroupDetails,
    onClose,
  } = props;

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button icon={<CloseOutlined />} shape="circle" type="text" onClick={() => onClose()} />
      </div>
      {isUserGroupMembersLoading || isGroupDetailsLoading ? (
        <Spin size="large" className="custom-ant-spin" />
      ) : isUserGroupMembersError || isGroupDetailsError || !GroupDetails || !userGroupMembers ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <Text strong={true} className="display-block">
            {lang.NAME}
          </Text>
          <Text type="secondary" className="display-block">
            {GroupDetails.name}
          </Text>
          <Text strong={true} className="display-block">
            {lang.GROUP_UUID}
          </Text>
          <Text type="secondary" className="display-block">
            {GroupDetails.id}
          </Text>
          <Text strong={true} className="display-block">
            {lang.ROLES}
          </Text>
          {GroupDetails.realmRoles?.map((role: string) => (
            <Text key={role} type="secondary" className="display-block">
              {role}
            </Text>
          ))}
          <Text strong={true} className="display-block">
            {lang.MEMBERS}
          </Text>
          {userGroupMembers.map((object: UserGroupMembers) => (
            <Link key={object.id} to={`${URL_USER_EDIT}/${object.id}`}>
              {object.username}
            </Link>
          ))}
        </Space>
      )}
    </Col>
  );
};

export { ViewDetails };
