import React from 'react';
import { Table as AntTable, Button, Divider } from 'antd';
import { Organization } from '../../ducks/organizations';
import { Link } from 'react-router-dom';
import { TeamsDetailProps } from '../TeamsDetail';

export interface TableData extends Organization {
  date: any;
  key: string;
}

export interface Props {
  data: TableData[];
  onViewDetails?: (teams: TeamsDetailProps) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails } = props;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Date created',
      dataIndex: 'date',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.date.localeCompare(b.date),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={'#'}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            onClick={() => (onViewDetails ? onViewDetails(record) : {})}
            type="link"
            className="m-0 p-1"
          >
            View Details
          </Button>
        </span>
      ),
    },
  ];

  return <AntTable dataSource={props.data} columns={columns} />;
};

export default Table;
