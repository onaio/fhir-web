import * as React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { useTranslation } from '../../mls';

export interface LocationUnitGroupDetailProps extends LocationUnitGroup {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose?: Function;
}

const LocationUnitGroupDetail = (props: LocationUnitGroupDetailProps) => {
  const { name, active, description } = props;
  const { t } = useTranslation();
  return (
    <div id="LocationUnitGroupDetail" className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => (props.onClose ? props.onClose() : '')}
        className="float-right"
        type="text"
        icon={<CloseOutlined rev={undefined} />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">{t('Name')}</p>
        <p className="mb-0 loc-desc">{name}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Status')}</p>
        <p className="mb-0 loc-desc">{`${active}`}</p>
      </div>
      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Description')}</p>
        <p className="mb-0 loc-desc">{description}</p>
      </div>
    </div>
  );
};

export default LocationUnitGroupDetail;
