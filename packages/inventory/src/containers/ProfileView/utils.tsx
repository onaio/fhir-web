import React from 'react';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { INVENTORY_SERVICE_POINT_PROFILE_VIEW, TableColumnsNamespace } from '../../constants';
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
} from '../../lang';

/** Describes how the data will passed to the table */
export interface TableData {
  deliveryDate: string;
  donor: string;
  poNumber: number;
  productName: string;
  providerId: string;
  quantity: number;
  serialNumber: string;
  servicePointId: string;
  stockId: string;
  unicefSection: string;
}

/** component rendered in the action column of the table
 *
 * @param record - record to show in row
 */
export const ActionsColumnCustomRender: ColumnType<TableData>['render'] = (record) => {
  return (
    <>
      <Link to={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${record.servicePointId}`}>View</Link>
    </>
  );
};

/** service point list table columns */
export const columns: ColumnsType<TableData> = [
  {
    title: PRODUCT_NAME_TH,
    dataIndex: 'productName',
    key: `${TableColumnsNamespace}-${PRODUCT_NAME_TH}`,
    defaultSortOrder: 'descend',
    sorter: (rec1, rec2) => {
      if (rec1.productName > rec2.productName) {
        return -1;
      } else if (rec1.productName < rec2.productName) {
        return 1;
      } else {
        return 0;
      }
    },
  },
  {
    title: QTY_TH,
    dataIndex: 'quantity',
    key: `${TableColumnsNamespace}-${QTY_TH}`,
  },
  {
    title: PO_NUMBER_TH,
    dataIndex: 'poNumber',
    key: `${TableColumnsNamespace}-${PO_NUMBER_TH}`,
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
    // dataIndex: 'servicePointId',
    // key: `${TableColumnsNamespace}-${ACCOUNT_END_DT_TH}`,
  },
  {
    title: UNICEF_SECTION_TH,
    dataIndex: 'unicefSection',
    key: `${TableColumnsNamespace}-${UNICEF_SECTION_TH}`,
  },
  {
    title: DONOR_TH,
    dataIndex: 'donor',
    key: `${TableColumnsNamespace}-${DONOR_TH}`,
  },
  {
    title: ACTIONS_TH,
    key: `${TableColumnsNamespace}-actions`,
    render: ActionsColumnCustomRender,
    width: '20%',
  },
];
