import React from 'react';
import { Column } from '@opensrp/react-utils';
import { TableColumnsNamespace } from '../../constants';
import { Link } from 'react-router-dom';
import lang, { Lang } from '../../lang';
import { Inventory } from '../../ducks/inventory';
import { Dictionary } from '@onaio/utils';

/**
 * Get table columns
 *
 * @param servicePointProfileURL route to the service point profile
 * @param editURL route the edit inventory item
 * @param langObj - the language translations object
 */
export const getTableColumns = (
  servicePointProfileURL: string,
  editURL: string,
  langObj: Lang = lang
): Column<Inventory>[] => {
  return [
    {
      title: langObj.PRODUCT_NAME_TH,
      dataIndex: 'product',
      key: `${TableColumnsNamespace}-${langObj.PRODUCT_NAME_TH}` as keyof Inventory,
      render: (item: Dictionary) => item.productName,
      sorter: (rec1, rec2) => {
        if (rec1.product && rec2.product) {
          if (rec1.product.productName > rec2.product.productName) {
            return -1;
          }
          if (rec1.product.productName < rec2.product.productName) {
            return 1;
          }
        }

        return 0;
      },
      defaultSortOrder: 'descend',
    },
    {
      title: langObj.QTY_TH,
      dataIndex: 'value',
      key: `${TableColumnsNamespace}-${langObj.QTY_TH}` as keyof Inventory,
    },
    {
      title: langObj.PO_NUMBER_TH,
      dataIndex: 'customProperties',
      key: `${TableColumnsNamespace}-${langObj.PO_NUMBER_TH}` as keyof Inventory,
      render: (item: Dictionary) => item['PO Number'],
    },
    {
      title: langObj.SERIAL_NUMBER_TH,
      dataIndex: 'serialNumber',
      key: `${TableColumnsNamespace}-${langObj.SERIAL_NUMBER_TH}` as keyof Inventory,
    },
    {
      title: langObj.DELIVERY_DT_TH,
      dataIndex: 'deliveryDate',
      key: `${TableColumnsNamespace}-${langObj.DELIVERY_DT_TH}` as keyof Inventory,
    },
    {
      title: langObj.ACCOUNT_END_DT_TH,
      dataIndex: 'accountabilityEndDate',
      key: `${TableColumnsNamespace}-${langObj.ACCOUNT_END_DT_TH}` as keyof Inventory,
    },
    {
      title: langObj.UNICEF_SECTION_TH,
      dataIndex: 'customProperties',
      key: `${TableColumnsNamespace}-${langObj.UNICEF_SECTION_TH}` as keyof Inventory,
      render: (item: Dictionary) => item['UNICEF section'],
    },
    {
      title: langObj.DONOR_TH,
      dataIndex: 'donor',
      key: `${TableColumnsNamespace}-${langObj.DONOR_TH}` as keyof Inventory,
    },
    {
      title: langObj.ACTIONS_TH,
      key: `${TableColumnsNamespace}-actions` as keyof Inventory,
      // eslint-disable-next-line react/display-name
      render: (_: string, record) => (
        <Link to={`${servicePointProfileURL}/${record.locationId}${editURL}/${record._id}`}>
          {langObj.EDIT}
        </Link>
      ),
      width: '20%',
    },
  ];
};
