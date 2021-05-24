import React from 'react';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { Setting } from '../../ducks/settings';
import { Button, Popover, Select } from 'antd';

/** component rendered in the action column of the table
 *
 * @param row - table item
 */
export const ActionsColumnCustomRender: ColumnType<Setting>['render'] = (row: Setting) => {
  return (
    <Popover
      content={
        <>
          Edit Value:
          <Select
            style={{ marginLeft: '1em' }}
            defaultValue={
              row.inheritedFrom !== '' ? 'Inherit' : row.value === 'true' ? 'Yes' : 'No'
            }
          >
            <Select.Option value="Yes">Yes</Select.Option>
            <Select.Option value="No">No</Select.Option>
            <Select.Option value="Inherit">Inherit</Select.Option>
          </Select>
        </>
      }
      placement="topRight"
      trigger="click"
    >
      <Button>Edit</Button>
    </Popover>
  );
};

export const columns: ColumnsType<Setting> = [
  {
    title: 'Name',
    dataIndex: 'label',
    key: `productName`,
    defaultSortOrder: 'descend',
    width: '25%',
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
    width: '35%',
    key: `description`,
  },
  {
    title: 'Setting',
    dataIndex: 'value',
    key: `value`,
    render: (value) => (value === 'true' ? 'Yes' : 'No'),
  },
  {
    title: 'Inherited from',
    dataIndex: 'inheritedFrom',
    width: '20%',
    key: `inheritedFrom`,
    render: (value) => (value !== '' ? value : '-'),
  },
  {
    title: 'Actions',
    key: `actions`,
    render: ActionsColumnCustomRender,
    width: '10%',
  },
];
