import { Button } from 'antd';
import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { TableData } from '../LocationUnitView/Table';

export interface Props extends TableData {
  onClose?: Function;
}

const LocationDetail: React.FC<Props> = (props: any) => {
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
        <p className="mb-0 loc-desc">{props.properties.name}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Status</p>
        <p className="mb-0 loc-desc">{props.properties.Status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Type</p>
        <p className="mb-0 loc-desc">{props.type}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">External Id</p>
        <p className="mb-0 loc-desc">{props.externalId}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Username</p>
        <p className="mb-0 loc-desc">{props.properties.username}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Version</p>
        <p className="mb-0 loc-desc">{props.properties.version}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Level</p>
        <p className="mb-0 loc-desc">{props.properties.geographicLevel}</p>
      </div>
    </div>
  );
};

export default LocationDetail;
