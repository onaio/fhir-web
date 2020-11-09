import React from 'react';
import { Table as AntTable, Menu, Dropdown, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitStatus, LocationUnitSyncStatus } from '../../ducks/location-units';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_ADD } from '../../constants';

export interface TableData {
  id?: string | number;
  name: string;
  parentId: string;
  status: LocationUnitStatus;
  geographicLevel: number;
  username: string;
  version: number;
  externalId: string;
  key: string;
  type: string;
  syncstatus: LocationUnitSyncStatus;
}

export interface Props {
  data: TableData[];
  onViewDetails?: Function;
}

const Table: React.FC<Props> = (props: Props) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: false,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Level',
      dataIndex: 'geographicLevel',
      editable: false,
      sorter: (a: TableData, b: TableData) => a.geographicLevel - b.geographicLevel,
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: any, record: TableData) => {
        return (
          <span className="d-flex justify-content-end align-items-center">
            <Link to={URL_LOCATION_UNIT_ADD + '/' + record.id}>
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
                    onClick={() => props.onViewDetails && props.onViewDetails(record)}
                  >
                    View Details
                  </Menu.Item>
                </Menu>
              }
              placement="bottomLeft"
              arrow
              trigger={['click']}
            >
              <MoreOutlined className="more-options" />
            </Dropdown>
          </span>
        );
      },
    },
  ];

  return <AntTable dataSource={props.data} columns={columns} />;
};

export default Table;
