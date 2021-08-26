import React from 'react';
import { Col, Space, Typography, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Resource404 } from '@opensrp-web/react-utils';
import { sendErrorNotification } from '@opensrp-web/notifications';
import { Button } from 'antd';
import { URL_USER_EDIT, URL_USER_GROUPS } from '../../constants';
import { UserGroupMembers } from '../UserGroupsList';
import { KeycloakUserGroup } from '../../ducks/userGroups';
import { Link } from 'react-router-dom';
import { loadGroupDetails, loadGroupMembers } from '../UserGroupsList/utils';
import lang from '../../lang';
const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  groupId: string;
  keycloakBaseURL: string;
}

/** component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { groupId, keycloakBaseURL } = props;
  const history = useHistory();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [userGroupMembers, setUserGroupMembers] = React.useState<UserGroupMembers[] | null>(null);
  const [singleUserGroup, setSingleUserGroup] = React.useState<KeycloakUserGroup | null>(null);

  React.useEffect(() => {
    if (groupId) {
      setLoading(true);
      const membersPromise = loadGroupMembers(groupId, keycloakBaseURL, setUserGroupMembers);
      const userGroupPromise = loadGroupDetails(groupId, keycloakBaseURL, setSingleUserGroup);
      Promise.all([membersPromise, userGroupPromise])
        .catch(() => sendErrorNotification(lang.ERROR_OCCURED))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  if (!groupId) {
    return null;
  }

  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          icon={<CloseOutlined />}
          shape="circle"
          type="text"
          onClick={() => history.push(URL_USER_GROUPS)}
        />
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
