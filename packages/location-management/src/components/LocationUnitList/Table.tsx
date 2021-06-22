import React from 'react';
import { Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT } from '../../constants';
import lang from '../../lang';
import { Column, TableLayout } from '@opensrp/react-utils';

export interface TableData {
  geographicLevel: number;
  id: string;
  key: string;
  name: string;
}

export interface Props {
  data: TableData[];
  onViewDetails?: (row: TableData) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails } = props;
  const columns: Column<TableData>[] = [
    {
      title: lang.NAME,
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: lang.LEVEL,
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
        title: lang.ACTIONS,
        width: '10%',
        // eslint-disable-next-line react/display-name
        render: (value: boolean, record) => (
          <span className="d-flex justify-content-end align-items-center Actions">
            <Link to={URL_LOCATION_UNIT_EDIT + '/' + record.id}>
              <Button type="link" className="m-0 p-1">
                Edit
              </Button>
            </Link>
            <Divider type="vertical" />
            <Button
              type="link"
              className="m-0 p-1"
              onClick={() => {
                if (onViewDetails) onViewDetails(record);
              }}
            >
              {lang.VIEW_DETAILS}
            </Button>
          </span>
        ),
      }}
    />
  );
};

export default Table;
