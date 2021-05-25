/* eslint-disable @typescript-eslint/camelcase */
import React, { useMemo } from 'react';
import { Table as AntTable } from 'antd';
import { ParsedHierarchyNode, getHierarchyNodeFromArray } from '@opensrp/location-management';
import { Setting } from '../../ducks/settings';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';

interface Props {
  data: Setting[];
  tree: ParsedHierarchyNode[];
  actioncolumn: ColumnType<Setting>;
}

interface TableData extends Setting {
  key: string;
}

export const Table: React.FC<Props> = (props: Props) => {
  const { data: Settings, tree, actioncolumn } = props;

  const data = Settings.map((setting) => {
    return {
      ...setting,
      key: setting.settingMetadataId,
      inheritedFrom: setting.inheritedFrom?.trim() ?? '',
    };
  });

  const columns: ColumnsType<TableData> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'label',
        key: `productName`,
        defaultSortOrder: 'descend',
        width: '25%',
        sorter: (rec1, rec2) => {
          if (rec1.label > rec2.label) return -1;
          else if (rec1.label < rec2.label) return 1;
          else return 0;
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
        render: (value) => (value !== '' ? getHierarchyNodeFromArray(tree, value)?.label : '-'),
      },
      actioncolumn,
    ],
    [actioncolumn, tree]
  );

  return <AntTable dataSource={data} columns={columns} />;
};

export default Table;
