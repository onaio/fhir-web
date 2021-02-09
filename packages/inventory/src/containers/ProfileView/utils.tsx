import React from 'react';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { INVENTORY_SERVICE_POINT_PROFILE_VIEW, TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';
import { LocationUnit, TreeNode } from '@opensrp/location-management';
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
import { GeographicLocationInterface } from '.';
import { Inventory } from '../../ducks/inventory';

/** component rendered in the action column of the table
 *
 * @param record - record to show in row
 */
export const ActionsColumnCustomRender: ColumnType<Inventory>['render'] = (record) => {
  return <Link to={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/${record.locationId}`}>Edit</Link>;
};

/** service point list table columns */
export const columns: ColumnsType<Inventory> = [
  {
    title: PRODUCT_NAME_TH,
    // dataIndex: 'productName',
    // key: `${TableColumnsNamespace}-${PRODUCT_NAME_TH}`,
    // defaultSortOrder: 'descend',
    // sorter: (rec1, rec2) => {
    //   if (rec1.productName > rec2.productName) {
    //     return -1;
    //   } else if (rec1.productName < rec2.productName) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // },
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
    render: (item) => item['PO Number'],
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
    render: (item) => item['UNICEF section'],
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

/**
 * function to get the parent path of a location
 *
 * @param loc - the location whose path we want
 * @param trees - the tree nodes containing the hierarchy
 */
export const getNodePath = (
  loc: LocationUnit,
  trees: TreeNode[] = []
): GeographicLocationInterface[] => {
  const { parentId } = loc.properties;
  // find tree with node that has the given id
  let nodeOfInterest: TreeNode | undefined;
  trees.forEach((tree) => {
    nodeOfInterest = tree.first((node) => node.model.id === parentId);
  });
  if (!nodeOfInterest) {
    return [];
  }
  // get path
  const path = nodeOfInterest.getPath().map((node) => {
    return { geographicLevel: node.model.node.attributes.geographicLevel, label: node.model.label };
  });
  return path;
};
