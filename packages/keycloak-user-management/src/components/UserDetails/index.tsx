import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from '../../mls';
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
  const { t } = useTranslation();

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
        <p className="mb-0 font-weight-bold">{t('Username')}</p>
        <p className="mb-0" id="username">
          {keycloakUser.username}
        </p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Keycloak UUID')}</p>
        <p className="mb-0" id="keycloakId">{`${keycloakUser.id}`}</p>
      </div>
      {practitioner ? (
        <>
          <div className="mb-4 small">
            <p className="mb-0 font-weight-bold">{t('Practitioner UUID')}</p>
            <p className="mb-0" id="practitionerId">{`${practitioner.identifier}`}</p>
          </div>
          <div className="mb-4 small">
            <p className="mb-0 font-weight-bold">{t('Practitioner Status')}</p>
            <p className="mb-0" id="practitionerStatus">
              {practitioner.active ? 'active' : 'inactive'}
            </p>
          </div>
        </>
      ) : (
        <div className="mb-4 small">
          <p className="mb-0 font-weight-bold">{t('Practitioner')}</p>
          <p className="mb-0" id="noActivePractitioner">
            {t('No Active Practitioner')}
          </p>
        </div>
      )}
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Assigned Teams')}</p>
        {assignedTeams?.length ? (
          assignedTeams.map((team) => (
            <p key={team.identifier} className="mb-0" id="assignedTeam">{`${team.name}`}</p>
          ))
        ) : (
          <p id="noAssignedTeams">{t('No Assigned Teams')}</p>
        )}
      </div>
    </div>
  );
};
