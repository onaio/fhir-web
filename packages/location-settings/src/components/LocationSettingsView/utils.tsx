import React from 'react';
import { Link } from 'react-router-dom';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { Setting } from '../../ducks/settings';

/** component rendered in the action column of the table
 *
 * @param _ - table item
 */
export const ActionsColumnCustomRender: ColumnType<Setting>['render'] = (_) => {
  return <Link to="#">Edit</Link>;
};

export const columns: ColumnsType<Setting> = [
  {
    title: 'Name',
    dataIndex: 'label',
    key: `productName`,
    defaultSortOrder: 'descend',
    width: '20%',
    sorter: (rec1: Setting, rec2: Setting) => {
      if (rec1.label > rec2.label) {
        return -1;
      } else if (rec1.label < rec2.label) {
        return 1;
      } else {
        return 0;
      }
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    width: '25%',
    key: `description`,
  },
  {
    title: 'Actions',
    key: `actions`,
    render: ActionsColumnCustomRender,
    width: '20%',
  },
];
