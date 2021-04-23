import React from 'react';
import { Table as AntTable, Button, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT } from '../../constants';
import lang from '../../lang';

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
  const columns = [
    {
      title: lang.NAME,
      dataIndex: 'name',
      editable: false,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: lang.LEVEL,
      dataIndex: 'geographicLevel',
      editable: false,
      sorter: (a: TableData, b: TableData) => a.geographicLevel - b.geographicLevel,
    },
    {
      title: lang.ACTIONS,
      dataIndex: 'operation',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (value: boolean, record: TableData) => (
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
    },
  ];

  return (
    <AntTable
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: 20,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      dataSource={props.data}
      columns={columns}
    />
  );
};

export default Table;
