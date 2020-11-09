import React from 'react';
import { Table as AntTable, Menu, Dropdown, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitStatus, LocationUnitSyncStatus } from '../../ducks/location-units';

export interface TableData {
  name: string;
  parentId: string;
  status: LocationUnitStatus;
  geographicLevel: number;
  username: string;
  version: number;
  externalId: string;
  OpenMRS_Id: string;
  key: string;
  type: string;
  created: Date;
  lastupdated: Date;
  parent: string;
  syncstatus: LocationUnitSyncStatus;
}

export interface Props {
  data: TableData[];
  onViewDetails?: Function;
}

const Table: React.FC<Props> = (props: Props) => {
  function edit(record: TableData) {
    console.log('editting : ', record);
  }

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
      title: 'Parent',
      dataIndex: 'parent',
      editable: false,
      sorter: (a: TableData, b: TableData) => a.parent.localeCompare(b.name),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: any, record: TableData) => {
        return (
          <span className="d-flex justify-content-end align-items-center">
            <Button type="link" className="m-0 p-1" onClick={() => edit(record)}>
              Edit
            </Button>
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
