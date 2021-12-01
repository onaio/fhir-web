import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { OrganizationDetail } from '../../types';
import { useTranslation } from '../../mls';

export interface TeamsDetailProps extends OrganizationDetail {
  onClose?: Function;
}

const TeamsDetail = (props: TeamsDetailProps) => {
  const { name, active, id, practitionerInfo, onClose } = props;
  const { t } = useTranslation();

  const detail = {
    [t('Team Name')]: name,
    [t('Status')]: active ? 'Active' : 'Inactive',
    [t('Identifier')]: id,
    [t('Team Members')]: practitionerInfo.length
      ? practitionerInfo.map((prac) => <div key={prac.id}>{prac.name}</div>)
      : t('No team members'),
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
