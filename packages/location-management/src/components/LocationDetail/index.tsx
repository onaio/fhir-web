import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './LocationDetail.css';

export interface Props {
  key: string;
  name: string;
  status: 'Alive' | 'Not Active';
  type: string;
  created: Date;
  lastupdated: Date;
  externalid: string;
  openmrsid: string;
  username: string;
  version: string;
  syncstatus: 'Synced' | 'Not Synced';
  level: number;
  onClose?: Function;
}

const LocationDetail = (props: Props) => {
  const {
    name,
    lastupdated,
    status,
    type,
    created,
    externalid,
    openmrsid,
    username,
    version,
    level,
  } = props;

  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => (props.onClose ? props.onClose() : '')}
        className="float-right"
        type="text"
        icon={<CloseOutlined />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">Name</p>
        <p className="mb-0 loc-desc">{name}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Status</p>
        <p className="mb-0 loc-desc">{status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Type</p>
        <p className="mb-0 loc-desc">{type}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Created</p>
        <p className="mb-0 loc-desc">{created.toLocaleDateString('en-US')}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Last updated</p>
        <p className="mb-0 loc-desc">{lastupdated.toLocaleDateString('en-US')}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">External Id</p>
        <p className="mb-0 loc-desc">{externalid}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">OpenMRS Id</p>
        <p className="mb-0 loc-desc">{openmrsid}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Username</p>
        <p className="mb-0 loc-desc">{username}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Version</p>
        <p className="mb-0 loc-desc">{version}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Sync status</p>
        <p className="mb-0 loc-desc">{status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Level</p>
        <p className="mb-0 loc-desc">{level}</p>
      </div>
    </div>
  );
};

export default LocationDetail;
