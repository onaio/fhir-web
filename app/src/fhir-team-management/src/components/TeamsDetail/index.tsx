import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Organization } from '../../ducks/organizations';
import { Practitioner } from '../../ducks/practitioners';
import lang from '../../lang';

export interface TeamsDetailProps extends Organization {
  onClose?: Function;
  practitioner: Practitioner[];
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, identifier, practitioner } = props;
  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => (props.onClose ? props.onClose() : '')}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">{lang.TEAM_NAME}</p>
        <p className="mb-0">{name}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.STATUS}</p>
        <p className="mb-0">{`${active}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.IDENTIFIER}</p>
        <p className="mb-0">{`${identifier}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.TEAM_MEMBERS}</p>
        {practitioner.length ? (
          practitioner.map((item) =>
            item.active ? <p key={item.identifier} className="mb-0">{`${item.name}`}</p> : null
          )
        ) : (
          <p className="no-team-members">{lang.NO_TEAM_MEMBERS}</p>
        )}
      </div>
    </div>
  );
};

export default TeamsDetail;
