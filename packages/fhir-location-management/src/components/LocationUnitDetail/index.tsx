import { Button } from 'antd';
import React from 'react';
import { get } from 'lodash';
import { CloseOutlined } from '@ant-design/icons';
import { IfhirR4 } from '@smile-cdr/fhirts';
import lang from '../../lang';

export interface Props extends IfhirR4.ILocation {
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
        <p className="mb-0 loc-desc">{props.name}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.STATUS}</p>
        <p className="mb-0 loc-desc">{props.status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.DESCRIPTION}</p>
        <p className="mb-0 loc-desc">{props.description}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.ALIAS}</p>
        <p className="mb-0 loc-desc">{get(props, 'alias.0')}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{lang.PHYSICAL_TYPE}</p>
        <p className="mb-0 loc-desc">{get(props, 'physicalType.coding.0.display')}</p>
      </div>
    </div>
  );
};

export default LocationUnitDetail;
