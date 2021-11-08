/* eslint-disable @typescript-eslint/camelcase */
import React, { useMemo } from 'react';
import { Table as AntTable } from 'antd';
import { ParsedHierarchyNode, getHierarchyNodeFromArray } from '@opensrp/location-management';
import { Setting } from '../../ducks/settings';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import lang from '../../lang';

interface Props {
  data: Setting[];
  tree: ParsedHierarchyNode[];
  actioncolumn?: ColumnType<Setting>;
}

export interface TableData extends Setting {
  key: string;
}

export const Table: React.FC<Props> = (props: Props) => {
  const { data: Settings, tree, actioncolumn } = props;

  const data = Settings.map((setting) => {
    const settingCopy = {
      ...setting,
      identifier: setting.settingIdentifier,
      _id: setting.settingMetadataId,
      settingsId: setting.documentId,
    };

    return {
      ...settingCopy,
      inheritedFrom: setting.inheritedFrom?.trim() ?? '',
    };
  });

  const columns: ColumnsType<TableData> = useMemo(() => {
    const col: ColumnsType<TableData> = [
      {
        title: lang.NAME,
        dataIndex: 'label',
        key: `label`,
        defaultSortOrder: 'descend',
        width: '25%',
        sorter: (rec1, rec2) => (rec1.label > rec2.label ? -1 : rec1.label < rec2.label ? 1 : 0),
      },
      {
        title: lang.DESCRIPTION,
        dataIndex: 'description',
        width: '35%',
        key: `description`,
      },
      {
        title: lang.SETTINGS,
        dataIndex: 'value',
        key: `value`,
        render: (value) => (value === 'true' ? 'Yes' : 'No'),
      },
      {
        title: lang.INHERITED_FROM,
        dataIndex: 'inheritedFrom',
        width: '20%',
        key: `inheritedFrom`,
        render: (value) => (value !== '' ? getHierarchyNodeFromArray(tree, value)?.label : '-'),
      },
    ];
    if (actioncolumn) col.push(actioncolumn);
    return col;
  }, [actioncolumn, tree]);

  return <AntTable dataSource={data} columns={columns} />;
};

export default Table;
