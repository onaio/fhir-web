import { useTranslation } from '../../../mls';
import React from 'react';
import { Tabs } from 'antd';
import { InventoryView } from './Inventory';
import { ChildLocations } from './ChildLocations';
import { getConfig } from '@opensrp/pkg-config';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { parseLocationDetails } from '../utils';
import { useSearchParams } from '@opensrp/react-utils';
import { useUserRole } from '@opensrp/rbac';
import { PhysicalTypeCodes } from '@opensrp/fhir-helpers';

export interface ViewDetailTabProps {
  fhirBaseUrl: string;
  location: ILocation;
}

/**
 * Tabs component that shows resource records associated with a particular location
 *
 * @param props - component props
 */
export function ViewDetailsTabs(props: ViewDetailTabProps) {
  const { fhirBaseUrl, location } = props;
  const { t } = useTranslation();
  const projectCode = getConfig('projectCode');
  const userRole = useUserRole();
  const { sParams, addParam } = useSearchParams();

  const { id, physicalType } = parseLocationDetails(location);
  const locationId = id as string;

  const viewDetailsQuery = 'view-details';
  const locationKey = 'locations';
  const inventoryKey = 'inventory';

  const defaultActiveKey = 'locations';
  const activeKey = sParams.get(viewDetailsQuery) ?? defaultActiveKey;

  const items = [
    {
      label: t('Locations'),
      key: locationKey,
      children: <ChildLocations fhirBaseUrl={fhirBaseUrl} locationId={locationId} />,
      enabled:
        userRole.hasPermissions('Location.read') &&
        physicalType.code === PhysicalTypeCodes.JURISDICTION,
    },
    {
      label: t('Inventory'),
      key: inventoryKey,
      children: <InventoryView fhirBaseUrl={fhirBaseUrl} locationId={locationId} />,
      enabled:
        userRole.hasPermissions('Group.read') &&
        projectCode === 'eusm' &&
        physicalType.code === PhysicalTypeCodes.BUILDING,
    },
  ].filter((item) => item.enabled);

  return (
    <Tabs
      data-testid="details-tab"
      onChange={(activeKey: string) => {
        addParam(viewDetailsQuery, activeKey);
      }}
      style={{ width: '100%' }}
      defaultActiveKey={activeKey}
      size={'small'}
      items={items}
    />
  );
}
