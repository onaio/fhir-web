/* eslint-disable @typescript-eslint/camelcase */
import React, { useState } from 'react';
import { Table as AntTable, Menu, Dropdown, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitStatus, LocationUnitSyncStatus } from '../../ducks/location-units';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_ADD } from '../../constants';
import { OpenSRPService } from '@opensrp/server-service/dist/types';
import { fetchSingleLocation } from 'location-management/src/ducks/location-hierarchy';

export interface TableData {
  id: string | number;
  name: string;
  parentId: string;
  status: LocationUnitStatus;
  geographicLevel: number;
  username: string;
  version: number;
  externalId: string;
  key: string;
  type: string;
  created: Date;
  lastupdated: Date;
  parent: string;
  syncstatus: LocationUnitSyncStatus;
}

export interface Props {
  accessToken: string;
  data: TableData[];
  onViewDetails: (locObj: any) => void;
  serviceClass: typeof OpenSRPService;
  loadSingleLocationAction: typeof fetchSingleLocation;
}

const Table: React.FC<Props> = (props: Props) => {
  const { serviceClass, accessToken } = props;
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const loadSingleLocation = async (id: string | number) => {
    setIsLoading(true);
    const serve = new serviceClass(
      accessToken,
      'https://opensrp-stage.smartregister.org/opensrp/rest',
      '/location'
    );
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    serve
      .read(id, { is_jurisdiction: true })
      .then((res: any) => {
        setDetail(res);
        setIsLoading(false);
        props.onViewDetails(res);
      })
      .catch((e) => console.log(e));
  };
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
                    onClick={async () => {
                      await loadSingleLocation(record.id);
                    }}
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
