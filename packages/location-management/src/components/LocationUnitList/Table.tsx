import React from 'react';
import { Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT } from '../../constants';
import { useTranslation } from '../../mls';
import { Column, TableLayout } from '@opensrp/react-utils';
import { ParsedHierarchyNode } from '../../ducks/locationHierarchy/types';

export interface TableData extends Pick<ParsedHierarchyNode, 'id' | 'label'> {
  geographicLevel: number;
}

export interface Props {
  data: TableData[];
  onViewDetails?: (row: TableData) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails } = props;
  const { t } = useTranslation();
  const columns: Column<TableData>[] = [
    {
      title: t('Name'),
      dataIndex: 'label',
      sorter: (a, b) => a.label.localeCompare(b.label),
    },
    {
      title: t('Level'),
      dataIndex: 'geographicLevel',
      sorter: (a, b) => a.geographicLevel - b.geographicLevel,
    },
  ];

  return (
    <TableLayout
      id="LocationUnitList"
      persistState={true}
      datasource={props.data}
      columns={columns}
      actions={{
        title: t('Actions'),
        width: '10%',
        // eslint-disable-next-line react/display-name
        render: (_: boolean, record) => (
          <span className="Actions">
            <Link to={`${URL_LOCATION_UNIT_EDIT}/${record.id}`} className="m-0 p-1">
              {t('Edit')}
            </Link>
            <Divider type="vertical" />
            <Button
              type="link"
              className="m-0 p-1"
              onClick={() => {
                if (onViewDetails) onViewDetails(record);
              }}
            >
              {t('View Details')}
            </Button>
          </span>
        ),
      }}
    />
  );
};

export default Table;
