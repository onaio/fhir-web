import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { OrganizationDetail } from '../../types';
import lang from '../../lang';
import { Dictionary } from 'lodash';

export interface TeamsDetailProps extends OrganizationDetail {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose?: Function;
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, id, practitionerInfo, onClose } = props;

  const detail: Dictionary<string | number | JSX.Element[]> = {
    [lang.TEAM_NAME]: name,
    [lang.STATUS]: active ? 'Active' : 'Inactive',
    [lang.IDENTIFIER]: id,
    [lang.TEAM_MEMBERS]: practitionerInfo.length
      ? practitionerInfo.map((prac) => <div key={prac.id}>{prac.name}</div>)
      : lang.NO_TEAM_MEMBERS,
  };

  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => onClose?.()}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined />}
      />

      {Object.entries(detail).map(([name, value], index) => (
        <div key={index} className="mb-4 small mt-4">
          <div className="mb-0 font-weight-bold">{name}</div>
          <div className="mb-0">{value}</div>
        </div>
      ))}
    </div>
  );
};

export default TeamsDetail;
