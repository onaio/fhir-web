import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { HealthcareServiceDetail } from '../../types';
import lang from '../../lang';

export interface HealthCareDetailProps extends HealthcareServiceDetail {
  onClose?: Function;
}

const HealthcareDetails = (props: HealthCareDetailProps) => {
  const { extraDetails, comment, meta, name, active, id, organization, onClose } = props;

  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => onClose?.()}
        className="float-right close-btn"
        type="text"
        icon={<CloseOutlined />}
      />
      <div className="mb-4 small mt-4">
        <div className="mb-0 font-weight-bold">{lang.HEALTHCARE_NAME}</div>
        <div className="mb-0">{name}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.STATUS}</div>
        <div className="mb-0">{active ? lang.ACTIVE : lang.INACTIVE}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.IDENTIFIER}</div>
        <div className="mb-0">{id}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.LAST_UPDATED_DATE}</div>
        <div className="mb-0">
          <div>{meta?.lastUpdated ? new Date(meta.lastUpdated).toLocaleDateString() : ''}</div>
        </div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.ORGANIZATION}</div>
        <div className="mb-0">{organization ? organization.name : lang.NOORGANIZATION}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.COMMENT}</div>
        <div className="mb-0">{comment ? comment : lang.NOCOMMENT}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.EXTRADETAILS}</div>
        <div className="mb-0">{extraDetails ? extraDetails : lang.NO_EXTRADETAILS}</div>
      </div>
    </div>
  );
};

export default HealthcareDetails;
