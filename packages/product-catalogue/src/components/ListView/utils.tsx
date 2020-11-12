import React from 'react';
import { Divider, Spin, Alert } from 'antd';
import { ProductCatalogue } from '../../ducks/productCatalogue';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { CATALOGUE_CREATE_EDIT_VIEW_URL, CATALOGUE_LIST_VIEW_URL } from '../../constants';
import { Link } from 'react-router-dom';

/** component rendered in the action column of the table */

export const ActionsColumnCustomRender: ColumnType<ProductCatalogue>['render'] = (record) => {
  return (
    <>
      <Link to={`${CATALOGUE_CREATE_EDIT_VIEW_URL}/${record.uniqueId}`}>Edit</Link>
      <Divider type="vertical" />
      <Link to={`${CATALOGUE_LIST_VIEW_URL}/${record.uniqueId}`}>View details</Link>
    </>
  );
};

/** namespace for the keys attached to the columns */
const TableColumnsNamespace = 'product-catalogue';

/** product Catalogue table columns */
export const columns: ColumnsType<ProductCatalogue> = [
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: `${TableColumnsNamespace}-productName`,
    defaultSortOrder: 'descend',
    sorter: (rec1, rec2) => {
      if (rec1 < rec2) {
        return -1;
      } else if (rec2 < rec1) {
        return 1;
      } else {
        return 0;
      }
    },
  },
  {
    title: 'ID',
    dataIndex: 'uniqueId',
    key: `${TableColumnsNamespace}-uniqueId`,
  },
  {
    title: 'Actions',
    key: `${TableColumnsNamespace}-actions`,
    render: ActionsColumnCustomRender,
  },
];

/** util component shown when there is a pending promise */

export const CatalogueLoading = () => {
  return (
    <Spin tip="Loading...">
      <Alert
        message="Fetching product Catalogue"
        description="Please wait, as we fetch the product Catalogue."
        type="info"
      />
    </Spin>
  );
};
