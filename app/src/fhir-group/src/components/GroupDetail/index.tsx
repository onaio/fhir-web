import React, { useMemo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { GroupDetail } from '../../types';
import lang from '../../lang';

export interface GroupDetailProps extends GroupDetail {
  onClose?: Function;
}

const GroupDetails = (props: GroupDetailProps) => {
  const { extraDetails, comment, meta, name, active, id, patient } = props;

  const lastUpdated = useMemo(() => {
    if (meta?.lastUpdated) {
      const date = new Date(meta.lastUpdated);
      return <div>{date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</div>;
    }
  }, [meta?.lastUpdated]);

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
        <div className="mb-0">{lastUpdated}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.ORGANIZATION}</div>
        <div className="mb-0">{patient ? patient.name : lang.NOORGANIZATION}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.COMMENT}</div>
        <div className="mb-0">{comment ?? lang.NOCOMMENT}</div>
      </div>
      <div className="mb-4 small">
        <div className="mb-0 font-weight-bold">{lang.EXTRADETAILS}</div>
        <div className="mb-0">{extraDetails ?? lang.NO_HEALTHCARE_MEMBERS}</div>
      </div>
    </div>
  );
};

export default GroupDetails;
