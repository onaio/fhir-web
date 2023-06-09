import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Organization } from '../../ducks/organizations';
import { Practitioner } from '../../ducks/practitioners';
import { useTranslation } from '../../mls';
import { OpenSRPJurisdiction } from '@opensrp/location-management';

export interface TeamsDetailProps extends Organization {
  onClose?: () => void;
  teamMembers: Practitioner[];
  assignedLocations: OpenSRPJurisdiction[];
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, identifier, teamMembers, assignedLocations } = props;
  const { t } = useTranslation();

  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => (props.onClose ? props.onClose() : '')}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined rev={undefined} />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">{t('Team Name')}</p>
        <p className="mb-0" id="name">
          {name}
        </p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Status')}</p>
        <p className="mb-0" id="status">{`${active}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Identifier')}</p>
        <p className="mb-0" id="identifier">{`${identifier}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Team Members')}</p>
        {teamMembers.length ? (
          teamMembers.map((item) =>
            item.active ? (
              <p key={item.identifier} className="mb-0" id="teamMember">{`${item.name}`}</p>
            ) : null
          )
        ) : (
          <p className="no-team-members">{t('No team members')}</p>
        )}
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Assigned Locations')}</p>
        {assignedLocations.length ? (
          assignedLocations.map((location) => (
            <p
              key={location.id}
              className="mb-0"
              id="assignedLocation"
            >{`${location.properties.name}`}</p>
          ))
        ) : (
          <p className="no-assigned-locations">{t('This team is not assigned to any Location')}</p>
        )}
      </div>
    </div>
  );
};

export default TeamsDetail;
