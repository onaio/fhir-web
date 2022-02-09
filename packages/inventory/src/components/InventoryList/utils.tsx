import { Column } from '@opensrp/react-utils';
import lang, { Lang } from '../../lang';
import { Inventory } from '../../ducks/inventory';
import { Dictionary } from '@onaio/utils';

/**
 * Get table columns
 *
 * @param langObj - the language translations object
 */
export const getTableColumns = (langObj: Lang = lang): Column<Inventory>[] => {
  return [
    {
      title: langObj.PRODUCT_NAME_TH,
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
      title: langObj.QTY_TH,
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: langObj.PO_NUMBER_TH,
      dataIndex: 'customProperties',
      key: 'customProperties',
      render: (item: Dictionary) => item['PO Number'],
    },
    {
      title: langObj.SERIAL_NUMBER_TH,
      dataIndex: 'serialNumber',
      key: 'serialNumber',
    },
    {
      title: langObj.DELIVERY_DT_TH,
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
    },
    {
      title: langObj.ACCOUNT_END_DT_TH,
      dataIndex: 'accountabilityEndDate',
      key: 'accountabilityEndDate',
    },
    {
      title: langObj.UNICEF_SECTION_TH,
      dataIndex: 'customProperties',
      key: 'customProperties',
      render: (item: Dictionary) => item['UNICEF section'],
    },
    {
      title: langObj.DONOR_TH,
      dataIndex: 'donor',
      key: 'donor',
    },
  ];
};
