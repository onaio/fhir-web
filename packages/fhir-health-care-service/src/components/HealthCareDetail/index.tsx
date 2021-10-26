import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { HealthcareServiceDetail } from '../../types';
import lang from '../../lang';
import { Dictionary } from 'lodash';

export interface HealthCareDetailProps extends HealthcareServiceDetail {
  onClose?: Function;
}

const HealthcareDetails = (props: HealthCareDetailProps) => {
  const { extraDetails, comment, meta, name, active, id, organization, onClose } = props;

  const detail: Dictionary<string | number | JSX.Element[]> = {
    [lang.HEALTHCARE_NAME]: name,
    [lang.STATUS]: active ? lang.ACTIVE : lang.INACTIVE,
    [lang.IDENTIFIER]: id,
    [lang.LAST_UPDATED_DATE]: meta?.lastUpdated
      ? new Date(meta.lastUpdated).toLocaleDateString()
      : '',
    [lang.ORGANIZATION]: organization ? organization.name : lang.NOORGANIZATION,
    [lang.COMMENT]: comment ?? lang.NOCOMMENT,
    [lang.EXTRADETAILS]: extraDetails ?? lang.NO_EXTRADETAILS,
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

export default HealthcareDetails;
