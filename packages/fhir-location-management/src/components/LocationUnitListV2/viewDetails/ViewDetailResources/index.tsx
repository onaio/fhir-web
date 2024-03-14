import { useTranslation } from '../../../../mls';
import React from 'react';
import { Tabs } from 'antd';
import { InventoryView } from './Inventory';
import { ChildLocations } from './ChildLocations';

export interface ViewDetailTabProps {
  fhirBaseUrl: string;
  locationId: string;
}

/**
 * @param props
 */
export function ViewDetailsTabs(props: ViewDetailTabProps) {
  const { fhirBaseUrl, locationId } = props;
  const { t } = useTranslation();

  return (
    <Tabs
      style={{ width: '100%' }}
      defaultActiveKey="1"
      size={'small'}
      items={[
        {
          label: t('Locations'),
          key: 'locations',
          children: <ChildLocations fhirBaseUrl={fhirBaseUrl} locationId={locationId} />,
        },
        {
          label: t('Inventory'),
          key: 'inventory',
          children: <InventoryView fhirBaseUrl={fhirBaseUrl} locationId={locationId} />,
        },
      ]}
    />
  );
}
