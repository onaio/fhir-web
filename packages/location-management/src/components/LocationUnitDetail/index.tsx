import { Button } from 'antd';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { LocationUnit } from '../../ducks/location-units';
import {
  EXTERNAL_ID_LABEL,
  LEVEL,
  NAME,
  STATUS,
  SYNC_STATUS,
  TYPE,
  USERNAME,
  VERSION,
} from '../../lang';

export interface Props extends LocationUnit {
  onClose?: Function;
}

const LocationUnitDetail: React.FC<Props> = (props: Props) => {
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
        <p className="mb-0 font-weight-bold">{NAME}</p>
        <p className="mb-0 loc-desc">{props.properties.name}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{STATUS}</p>
        <p className="mb-0 loc-desc">{props.properties.status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{TYPE}</p>
        <p className="mb-0 loc-desc">{props.type}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{EXTERNAL_ID_LABEL}</p>
        <p className="mb-0 loc-desc">{props.properties.externalId}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{USERNAME}</p>
        <p className="mb-0 loc-desc">{props.properties.username}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{VERSION}</p>
        <p className="mb-0 loc-desc">{props.properties.version}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{SYNC_STATUS}</p>
        <p className="mb-0 loc-desc">{props.syncStatus}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{LEVEL}</p>
        <p className="mb-0 loc-desc">{props.properties.geographicLevel}</p>
      </div>
    </div>
  );
};

export default LocationUnitDetail;
