import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import lang from '../../lang';
import { Organization } from '@opensrp/team-management';
import { Practitioner, KeycloakUser } from '../../ducks/user';
import { Spin } from 'antd';

interface UserDetailProps {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose: Function;
  keycloakUser: KeycloakUser;
  practitioner?: Practitioner;
  assignedTeams: Organization[];
}

// remove onclose from type and export the rest
export type UserDetailType = Omit<UserDetailProps, 'onClose'>;

export const UserDetails = (props: Partial<UserDetailProps>) => {
  const { onClose, keycloakUser, practitioner, assignedTeams } = props;

  if (!keycloakUser) return <Spin size="large" />;

  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => onClose && onClose()}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">{lang.USERNAME}</p>
        <p className="mb-0" id="username">
          {keycloakUser.username}
        </p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.KEYCLOAK_UUID}</p>
        <p className="mb-0" id="keycloakId">{`${keycloakUser.id}`}</p>
      </div>
      {practitioner ? (
        <>
          <div className="mb-4 small">
            <p className="mb-0 font-weight-bold">{lang.PRACTITIONER_UUID}</p>
            <p className="mb-0" id="practitionerId">{`${practitioner.identifier}`}</p>
          </div>
          <div className="mb-4 small">
            <p className="mb-0 font-weight-bold">{lang.PRACTITIONER_STATUS}</p>
            <p className="mb-0" id="practitionerStatus">
              {practitioner.active ? 'active' : 'inactive'}
            </p>
          </div>
        </>
      ) : (
        <div className="mb-4 small">
          <p className="mb-0 font-weight-bold">{lang.PRACTITIONER}</p>
          <p className="mb-0" id="noActivePractitioner">
            {lang.NO_ACTIVE_PRACTITIONER}
          </p>
        </div>
      )}
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.ASSIGNED_TEAMS}</p>
        {assignedTeams?.length ? (
          assignedTeams.map((team) => (
            <p key={team.identifier} className="mb-0" id="assignedTeam">{`${team.name}`}</p>
          ))
        ) : (
          <p id="noAssignedTeams">{lang.NO_ASSIGNED_TEAMS}</p>
        )}
      </div>
    </div>
  );
};
