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
  syncstatus: LocationUnitSyncStatus;
}

export interface Props {
  data: TableData[];
  onViewDetails?: Function;
  accessToken: string;
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
      sorter: (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name),
    },
    {
      title: 'Level',
      dataIndex: 'geographicLevel',
      editable: false,
      sorter: (a: { geographicLevel: number }, b: { geographicLevel: number }) =>
        a.geographicLevel - b.geographicLevel,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastupdated',
      render: (_: any, record: TableData) => record.lastupdated.toLocaleDateString('en-US'),
      editable: false,
      sorter: (a: { lastupdated: Date }, b: { lastupdated: Date }) =>
        a.lastupdated.toLocaleString('en-US').localeCompare(b.lastupdated.toLocaleString('en-US')),
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
                <Menu>
                  <Menu.Item onClick={() => props.onViewDetails && props.onViewDetails(record)}>
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

  const mergedColumns = columns.map((col) => col);
  return <AntTable dataSource={props.data} columns={mergedColumns} />;
};

export default Table;
