import React from 'react';
import { Col, Space, Typography, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Resource404 } from '@opensrp/react-utils';
import { sendErrorNotification } from '@opensrp/notifications';
import { Button } from 'antd';
import { URL_USER_EDIT } from '../../constants';
import { UserGroupMembers } from '../UserGroupsList';
import { KeycloakUserGroup } from 'keycloak-user-management/src/ducks/userGroups';
import { Link } from 'react-router-dom';
import { loadGroupDetails, loadGroupMembers } from '../UserGroupsList/utils';
import lang from '../../lang';
const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  groupId: string;
  keycloakBaseURL: string;
  onClose: () => void;
}

/**
 * component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { groupId, keycloakBaseURL, onClose } = props;
  const [loading, setLoading] = React.useState<boolean>(true);
  const [userGroupMembers, setUserGroupMembers] = React.useState<UserGroupMembers[] | null>(null);
  const [singleUserGroup, setSingleUserGroup] = React.useState<KeycloakUserGroup | null>(null);

  React.useEffect(() => {
    if (groupId) {
      setLoading(true);
      const membersPromise = loadGroupMembers(groupId, keycloakBaseURL, setUserGroupMembers);
      const userGroupPromise = loadGroupDetails(groupId, keycloakBaseURL, setSingleUserGroup);
      Promise.allSettled([membersPromise, userGroupPromise])
        .catch(() => {
          sendErrorNotification(lang.ERROR_OCCURED);
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button icon={<CloseOutlined />} shape="circle" type="text" onClick={() => onClose()} />
      </div>
      {loading ? (
        <Spin size="large" className="custom-ant-spin" />
      ) : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      !loading && groupId && (!singleUserGroup || !userGroupMembers) ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <Text strong={true} className="display-block">
            {lang.NAME}
          </Text>
          <Text type="secondary" className="display-block">
            {singleUserGroup?.name}
          </Text>
          <Text strong={true} className="display-block">
            {lang.GROUP_UUID}
          </Text>
          <Text type="secondary" className="display-block">
            {singleUserGroup?.id}
          </Text>
          <Text strong={true} className="display-block">
            {lang.ROLES}
          </Text>
          {singleUserGroup?.realmRoles?.map((role: string) => (
            <Text key={role} type="secondary" className="display-block">
              {role}
            </Text>
          ))}
          <Text strong={true} className="display-block">
            {lang.MEMBERS}
          </Text>
          {userGroupMembers?.map((object: UserGroupMembers) => (
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
