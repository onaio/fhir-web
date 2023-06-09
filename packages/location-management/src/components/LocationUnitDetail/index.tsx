import { Button } from 'antd';
import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { LocationUnit } from '../../ducks/location-units';
import { useTranslation } from '../../mls';

export interface Props extends LocationUnit {
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClose?: Function;
}

const LocationUnitDetail: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 bg-white">
      <Button
        shape="circle"
        onClick={() => (props.onClose ? props.onClose() : '')}
        className="float-right"
        type="text"
        icon={<CloseOutlined rev={undefined} />}
      />
      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">{t('Name')}</p>
        <p className="mb-0 loc-desc">{props.properties.name}</p>
      </div>

      <div className="mb-4 small mt-4">
        <p className="mb-0 font-weight-bold">{t('Identifier')}</p>
        <p className="mb-0 loc-desc">{props.id}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Status')}</p>
        <p className="mb-0 loc-desc">{props.properties.status}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Type')}</p>
        <p className="mb-0 loc-desc">{props.type}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('External ID')}</p>
        <p className="mb-0 loc-desc">{props.properties.externalId}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Username')}</p>
        <p className="mb-0 loc-desc">{props.properties.username}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Version')}</p>
        <p className="mb-0 loc-desc">{props.properties.version}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Sync status')}</p>
        <p className="mb-0 loc-desc">{props.syncStatus}</p>
      </div>

      <div className="mb-4 small">
        <p className="mb-0 font-weight-bold">{t('Level')}</p>
        <p className="mb-0 loc-desc">{props.properties.geographicLevel}</p>
      </div>
    </div>
  );
};

export default LocationUnitDetail;
