/* eslint-disable @typescript-eslint/naming-convention */
import React, { useMemo } from 'react';
import { Table as AntTable } from 'antd';
import { ParsedHierarchyNode, getHierarchyNodeFromArray } from '@opensrp/location-management';
import { Setting } from '../../ducks/settings';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import { useTranslation } from '../../mls';

interface Props {
  data: Setting[];
  tree: ParsedHierarchyNode[];
  actioncolumn?: ColumnType<Setting>;
  loading?: boolean;
}

export interface TableData extends Setting {
  key: string;
}

export const Table: React.FC<Props> = (props: Props) => {
  const { data: Settings, tree, actioncolumn, loading } = props;
  const { t } = useTranslation();

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
        title: t('Name'),
        dataIndex: 'label',
        key: `label`,
        defaultSortOrder: 'descend',
        width: '25%',
        sorter: (rec1, rec2) => (rec1.label > rec2.label ? -1 : rec1.label < rec2.label ? 1 : 0),
      },
      {
        title: t('Description'),
        dataIndex: 'description',
        width: '35%',
        key: `description`,
      },
      {
        title: t('Settings'),
        dataIndex: 'value',
        key: `value`,
        render: (value) => (value === 'true' ? 'Yes' : 'No'),
      },
      {
        title: t('Inherited from'),
        dataIndex: 'inheritedFrom',
        width: '20%',
        key: `inheritedFrom`,
        render: (value) => {
          if (value) {
            const hierarchy = getHierarchyNodeFromArray(tree, value);
            return hierarchy?.label ?? '-';
          }
          return '-';
        },
      },
    ];
    if (actioncolumn) col.push(actioncolumn);
    return col;
  }, [actioncolumn, t, tree]);

  return <AntTable dataSource={data} columns={columns} loading={loading} />;
};

export default Table;
