import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { LocationTag } from '../../ducks/location-tags';

export interface LocationTagDetailProps extends LocationTag {
  onClose?: Function;
}

const LocationTagDetail = (props: LocationTagDetailProps) => {
  const { name, active, description } = props;
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
        <p className="mb-0 loc-desc">{`${active}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">Description</p>
        <p className="mb-0 loc-desc">{description}</p>
      </div>
    </div>
  );
};

export default LocationTagDetail;
