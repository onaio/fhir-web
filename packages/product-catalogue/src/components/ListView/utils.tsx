import React from 'react';
import { Divider } from 'antd';
import { ProductCatalogue } from '../../ducks/productCatalogue';
import {
  CATALOGUE_EDIT_VIEW_URL,
  CATALOGUE_LIST_VIEW_URL,
  TableColumnsNamespace,
} from '../../constants';
import { Link } from 'react-router-dom';
import { Column } from '@opensrp/react-utils';
import type { TFunction } from '@opensrp/i18n';

/** component rendered in the action column of the table */

/**
 * component rendered in the action column of the table
 *
 * @param t - the translator function
 */
export const ActionsColumnCustomRender =
  (t: TFunction): Column<ProductCatalogue>['render'] =>
  // eslint-disable-next-line react/display-name
  (record) => {
    return (
      <>
        <Link to={`${CATALOGUE_EDIT_VIEW_URL}/${record.uniqueId}`}>{t('Edit')}</Link>
        <Divider type="vertical" />
        <Link to={`${CATALOGUE_LIST_VIEW_URL}/${record.uniqueId}`}>{t('View details')}</Link>
      </>
    );
  };

/**
 * product Catalogue table columns
 *
 * @param t - the translator function
 */
export const columnsFactory = (t: TFunction): Column<ProductCatalogue>[] => {
  const columns: Column<ProductCatalogue>[] = [
    {
      title: t('Product Name'),
      dataIndex: 'productName',
      key: `${TableColumnsNamespace}-productName` as keyof ProductCatalogue,
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
      title: t('ID'),
      dataIndex: 'uniqueId',
      key: `${TableColumnsNamespace}-uniqueId` as keyof ProductCatalogue,
    },
  ];
  return columns;
};
