import React from 'react';
import { Table as AntTable, Menu, Dropdown, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT } from '../../constants';
import { LocationUnit } from '../../ducks/location-units';

export interface TableData {
  geographicLevel: number;
  id: string;
  key: string;
  name: string;
}

export interface Props {
  accessToken: string;
  setDetail: (isLoading: string | LocationUnit) => void;
  data: TableData[];
  onViewDetails?: (
    row: TableData,
    accessToken: string,
    setDetail: (isLoading: string | LocationUnit) => void
  ) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { accessToken, setDetail } = props;
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
      render: (value: boolean, record: TableData) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={URL_LOCATION_UNIT_EDIT + '/' + record.id}>
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
                  onClick={() =>
                    props.onViewDetails && props.onViewDetails(record, accessToken, setDetail)
                  }
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
      ),
    },
  ];

  return <AntTable dataSource={props.data} columns={columns} />;
};

export default Table;
