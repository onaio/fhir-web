import React from 'react';
import { Col, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import { Resource404 } from '@opensrp/react-utils';
import { Button } from 'antd';
import { URL_USER_GROUPS } from '../../constants';
import { UserGroupMembers } from '../UserGroupsList';
import { KeycloakUserGroup } from 'keycloak-user-management/src/ducks/userGroups';
const { Text } = Typography;

/** typings for the view details component */
export interface ViewDetailsProps {
  singleUserGroupDetails: KeycloakUserGroup | null;
  groupId: string;
  userGroupMembers: UserGroupMembers[] | null;
}
export const defaultProps = {
  groupId: '',
  singleUserGroupDetails: null,
  userGroupMembers: null,
};
/** component that renders the details view to the right side
 * of list view
 *
 * @param props - detail view component props
 */
const ViewDetails = (props: ViewDetailsProps) => {
  const { groupId, userGroupMembers, singleUserGroupDetails } = props;
  const history = useHistory();
  if (groupId === '') {
    return null;
  }
  return (
    <Col className="view-details-content">
      <div className="flex-right">
        <Button
          icon={<CloseOutlined />}
          className="display-block"
          onClick={() => history.push(URL_USER_GROUPS)}
        />
      </div>
      {groupId && (!singleUserGroupDetails || !userGroupMembers) ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <Text strong={true} className="display-block">
            Name
          </Text>
          <Text type="secondary" className="display-block">
            {singleUserGroupDetails?.name}
          </Text>
          <Text strong={true} className="display-block">
            Roles
          </Text>
          {singleUserGroupDetails?.realmRoles?.map((role: string) => (
            <Text key={role} type="secondary" className="display-block">
              {role}
            </Text>
          ))}
          <Text strong={true} className="display-block">
            Members
          </Text>
          {userGroupMembers?.map((object: UserGroupMembers) => (
            <Text key={object.id} type="secondary" className="display-block">
              {object.username}
            </Text>
          ))}
        </Space>
      )}
    </Col>
  );
};
ViewDetails.defaultProps = defaultProps;
export { ViewDetails };
