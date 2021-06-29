import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_EDIT_TEAM } from '../../constants';
import { Organization } from '../../types';
import { Column, Require, TableLayout } from '@opensrp/react-utils';

export interface TableData extends Require<Organization, 'id'> {
  key: string;
}

export interface Props {
  data: TableData[];
  fhirBaseURL: string;
  onViewDetails?: (param: { team: TableData; fhirBaseURL: string }) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, fhirBaseURL } = props;

  const columns: Column<TableData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      render: (value) => <div>{value ? 'Active' : 'Inactive'}</div>,
    },
    {
      title: 'Actions',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={URL_EDIT_TEAM + record.id.toString()}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item
                  className="viewdetails"
                  onClick={() => {
                    if (onViewDetails) onViewDetails({ team: record, fhirBaseURL });
                  }}
                >
                  View Details
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  return <TableLayout datasource={props.data} columns={columns} />;
};

export default Table;
