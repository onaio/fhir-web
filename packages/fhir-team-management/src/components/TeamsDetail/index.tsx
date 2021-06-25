import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { OrganizationDetail, Practitioner } from '../../types';
import lang from '../../lang';
import { convertToObject } from '@opensrp/react-utils';
import { HumanName } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/humanName';

export interface TeamsDetailProps extends OrganizationDetail {
  onClose?: Function;
  practitioners: Practitioner[];
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, id, practitioners } = props;
  const filteredPractitioners = practitioners.filter((prac) => prac.active);

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
          filteredPractitioners.map((item) => {
            const names = convertToObject<HumanName, HumanName.UseEnum>(item.name, 'use');
            return (
              <div key={item.id} className="mb-0">
                {names.official?.given?.reduce((fullname, name) => `${fullname} ${name}`)}
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
