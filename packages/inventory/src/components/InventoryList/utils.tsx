import { Column } from '@opensrp/react-utils';
import { Inventory } from '../../ducks/inventory';
import { Dictionary } from '@onaio/utils';
import { TFunction } from 'react-i18next';

/**
 * Get table columns
 *
 * @param t - translator function
 */
export const getTableColumns = (t: TFunction): Column<Inventory>[] => {
  return [
    {
      title: t('Product name'),
      dataIndex: 'product',
      key: 'product',
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
      title: t('Qty'),
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: t('PO no.'),
      dataIndex: 'customProperties',
      key: 'customProperties',
      render: (item: Dictionary) => item['PO Number'],
    },
    {
      title: t('Serial no.'),
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: t('Delivery dt.'),
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
    },
    {
      title: t('Acct. end dt.'),
      dataIndex: 'accountabilityEndDate',
      key: 'accountabilityEndDate',
    },
    {
      title: t('Unicef section'),
      dataIndex: 'customProperties',
      key: 'customProperties',
      render: (item: Dictionary) => item['UNICEF section'],
    },
    {
      title: t('Donor'),
      dataIndex: 'donor',
      key: 'donor',
    },
  ];
};
