import React from 'react';
import { Col, Space, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { Resource404 } from '@opensrp/react-utils';
import { Button } from 'antd';
import { URL_USER_EDIT } from '../../constants';
import { UserGroupMembers } from '../UserGroupsList';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../mls';
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
  const { t } = useTranslation();

  return (
    <Col className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => onClose()}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined rev={undefined} />}
      />
      {loading ? (
        <Spin size="large" className="inline-spinner" />
      ) : error || !GroupDetails || !userGroupMembers ? (
        <Resource404 />
      ) : (
        <Space direction="vertical">
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{t('Group uuid')}</p>
            <p className="mb-0" id="uuid">
              {GroupDetails.id}
            </p>
          </div>
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{t('Name')}</p>
            <p className="mb-0" id="name">
              {GroupDetails.name}
            </p>
          </div>
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{t('Roles')}</p>
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
              <p id="noRealRole">{t('No assigned roles')}</p>
            )}
          </div>
          <div className="mb-2 medium mt-2">
            <p className="mb-0 font-weight-bold">{t('Members')}</p>
            {userGroupMembers.length ? (
              userGroupMembers.map((member) => (
                <p key={member.id} className="mb-0" id="groupMember">
                  <Link key={member.id} to={`${URL_USER_EDIT}/${member.id}`} id="realRole">
                    {`${member.firstName} ${member.lastName} (${member.username})`}
                  </Link>
                </p>
              ))
            ) : (
              <p id="noGroupMember">{t('No assigned members')}</p>
            )}
          </div>
        </Space>
      )}
    </Col>
  );
};

export { ViewDetails };
