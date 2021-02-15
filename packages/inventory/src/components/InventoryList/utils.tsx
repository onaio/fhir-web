import React from 'react';
import { TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';
import {
  ACTIONS_TH,
  PRODUCT_NAME_TH,
  QTY_TH,
  PO_NUMBER_TH,
  SERIAL_NUMBER_TH,
  DELIVERY_DT_TH,
  ACCOUNT_END_DT_TH,
  UNICEF_SECTION_TH,
  DONOR_TH,
  EDIT,
} from '../../lang';
import { Inventory } from '../../ducks/inventory';
import { Dictionary } from '@onaio/utils';

/**
 * Get table columns
 *
 * @param servicePointProfileURL route to the service point profile
 * @param editURL route the edit invemtory item
 */
export const getTableColumns = (servicePointProfileURL: string, editURL: string) => {
  return [
    {
      title: PRODUCT_NAME_TH,
    },
    {
      title: QTY_TH,
      dataIndex: 'value',
      key: `${TableColumnsNamespace}-${QTY_TH}`,
    },
    {
      title: PO_NUMBER_TH,
      dataIndex: 'customProperties',
      key: `${TableColumnsNamespace}-${PO_NUMBER_TH}`,
      render: (item: Dictionary) => item['PO Number'],
    },
    {
      title: SERIAL_NUMBER_TH,
      dataIndex: 'serialNumber',
      key: `${TableColumnsNamespace}-${SERIAL_NUMBER_TH}`,
    },
    {
      title: DELIVERY_DT_TH,
      dataIndex: 'deliveryDate',
      key: `${TableColumnsNamespace}-${DELIVERY_DT_TH}`,
    },
    {
      title: ACCOUNT_END_DT_TH,
      dataIndex: 'accountabilityEndDate',
      key: `${TableColumnsNamespace}-${ACCOUNT_END_DT_TH}`,
    },
    {
      title: UNICEF_SECTION_TH,
      dataIndex: 'customProperties',
      key: `${TableColumnsNamespace}-${UNICEF_SECTION_TH}`,
      render: (item: Dictionary) => item['UNICEF section'],
    },
    {
      title: DONOR_TH,
      dataIndex: 'donor',
      key: `${TableColumnsNamespace}-${DONOR_TH}`,
    },
    {
      title: ACTIONS_TH,
      key: `${TableColumnsNamespace}-actions`,
      // eslint-disable-next-line react/display-name
      render: (_: string, record: Inventory) => (
        <Link to={`${servicePointProfileURL}/${record.locationId}${editURL}/${record._id}`}>
          {EDIT}
        </Link>
      ),
      width: '20%',
    },
  ];
};
