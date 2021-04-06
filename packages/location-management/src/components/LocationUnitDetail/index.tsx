import { Button } from 'antd';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { LocationUnit } from '../../ducks/location-units';
import lang from '../../lang';

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
        <p className="mb-0 font-weight-bold">{lang.NAME}</p>
        <p className="mb-0 loc-desc">{props.properties.name}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.STATUS}</p>
        <p className="mb-0 loc-desc">{props.properties.status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.TYPE}</p>
        <p className="mb-0 loc-desc">{props.type}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.EXTERNAL_ID_LABEL}</p>
        <p className="mb-0 loc-desc">{props.properties.externalId}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.USERNAME}</p>
        <p className="mb-0 loc-desc">{props.properties.username}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.VERSION}</p>
        <p className="mb-0 loc-desc">{props.properties.version}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.SYNC_STATUS}</p>
        <p className="mb-0 loc-desc">{props.syncStatus}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.LEVEL}</p>
        <p className="mb-0 loc-desc">{props.properties.geographicLevel}</p>
      </div>
    </div>
  );
};

export default LocationUnitDetail;
