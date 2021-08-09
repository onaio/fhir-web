import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { OrganizationDetail } from '../../types';
import lang from '../../lang';

export interface TeamsDetailProps extends OrganizationDetail {
  onClose?: Function;
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, id, practitioners } = props;
  const filteredPractitioners = practitioners.filter((prac) => prac.active);

  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => {
          if (props.onClose) props.onClose();
          else throw new Error('No OnClose Function Specified');
        }}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined />}
      />
      <div className="mb-4 small mt-4">
        <div className="mb-0 font-weight-bold">{lang.TEAM_NAME}</div>
        <div className="mb-0">{name}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.STATUS}</div>
        <div className="mb-0">{active ? 'Active' : 'Inactive'}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.IDENTIFIER}</div>
        <div className="mb-0">{id}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.TEAM_MEMBERS}</div>
        {filteredPractitioners.length ? (
          filteredPractitioners.map((prac) => {
            const name = prac.name.find((e) => e.use === 'official')?.given;
            return (
              <div key={prac.id} className="mb-0">
                {name?.reduce((fullname, name) => `${fullname} ${name}`)}
              </div>
            );
          })
        ) : (
          <div className="no-team-members">{lang.NO_TEAM_MEMBERS}</div>
        )}
      </div>
    </div>
  );
};

export default TeamsDetail;
