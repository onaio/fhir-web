import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_EDIT_TEAM } from '../../constants';
import { Organization } from '../../types';
import { Column, TableLayout } from '@opensrp/react-utils';

export interface TableData extends Organization {
  key: string;
}

export interface Props {
  data: TableData[];
  fhirbaseURL: string;
  onViewDetails?: (param: { team: TableData; fhirbaseURL: string }) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, fhirbaseURL } = props;

  const columns: Column<TableData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
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
                    if (onViewDetails) onViewDetails({ team: record, fhirbaseURL });
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
