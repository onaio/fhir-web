import React from 'react';
import { Table as AntTable, Button, Divider } from 'antd';
import { Organization } from '../../ducks/organizations';
import { Link } from 'react-router-dom';
import { URL_EDIT_TEAM } from '../../constants';
import { Practitioner } from '../../ducks/practitioners';

export interface TableData extends Organization {
  key: string;
}

export interface Props {
  data: TableData[];
  accessToken: string;
  setDetail: (isLoading: string | Organization) => void;
  setPractitionersList: (isLoading: string | Practitioner[]) => void;
  onViewDetails?: (
    row: TableData,
    accessToken: string,
    setDetail: (isLoading: string | Organization) => void,
    setPractitionersList: (isLoading: string | Practitioner[]) => void
  ) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { accessToken, setDetail, onViewDetails, setPractitionersList } = props;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={URL_EDIT_TEAM + record.identifier.toString()}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Button
            onClick={() =>
              onViewDetails
                ? onViewDetails(record, accessToken, setDetail, setPractitionersList)
                : {}
            }
            type="link"
            className="m-0 p-1 viewdetails"
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
