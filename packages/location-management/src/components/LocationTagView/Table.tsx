import React from 'react';
import { Table as AntTable, Menu, Dropdown, Button, Divider, Popconfirm, notification } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationTag } from '../../ducks/location-tags';
import { getAccessToken } from '@onaio/session-reducer';
import { useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import { API_BASE_URL, LOCATION_TAG_DELETE, URL_LOCATION_TAG_EDIT } from '../../constants';
import { Link } from 'react-router-dom';
import { LocationTagDetailProps } from '../LocationTagDetail';

export interface TableData extends LocationTag {
  key: string;
}

export interface Props {
  data: TableData[];
  onViewDetails?: (locationUnit: LocationTagDetailProps) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const accessToken = useSelector((state) => getAccessToken(state) as string);
  /**
   * fucntion to delete the record
   *
   * @param {object} record - The record to delete
   */
  function onDelete(record: LocationTag) {
    const clientService = new OpenSRPService(
      accessToken,
      API_BASE_URL,
      LOCATION_TAG_DELETE + record.id
    );
    clientService
      .delete()
      .then(() => notification.success({ message: 'Successfully Deleted!', description: '' }))
      .catch((err: string) => notification.error({ message: `${err}`, description: '' }));
  }

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
          <Link to={URL_LOCATION_TAG_EDIT + '/' + record.id}>
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
                <Menu.Item className="delete">
                  <Popconfirm title="Sure to Delete?" onConfirm={() => onDelete(record)}>
                    Delete
                  </Popconfirm>
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
