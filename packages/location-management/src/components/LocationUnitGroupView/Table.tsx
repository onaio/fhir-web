import React from 'react';
import { Table as AntTable, Menu, Dropdown, Button, Divider, Popconfirm } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { getAccessToken } from '@onaio/session-reducer';
import { useSelector } from 'react-redux';
import { OpenSRPService } from '@opensrp/server-service';
import { LOCATION_UNIT_GROUP_DELETE, URL_LOCATION_UNIT_GROUP_EDIT } from '../../constants';
import { Link } from 'react-router-dom';
import { LocationUnitGroupDetailProps } from '../LocationUnitGroupDetail';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';

export interface TableData extends LocationUnitGroup {
  key: string;
}

export interface Props {
  data: TableData[];
  opensrpBaseURL: string;
  onViewDetails?: (locationUnit: LocationUnitGroupDetailProps) => void;
}

/** function to delete the record
 *
 * @param {object} record - The record to delete
 * @param {string} accessToken - Access token to be used for requests
 * @param {string} opensrpBaseURL - base url
 */
export const onDelete = (
  record: LocationUnitGroup,
  accessToken: string,
  opensrpBaseURL: string
) => {
  const clientService = new OpenSRPService(
    accessToken,
    opensrpBaseURL,
    LOCATION_UNIT_GROUP_DELETE + record.id.toString()
  );
  clientService
    .delete()
    .then(() => sendSuccessNotification('Successfully Deleted!'))
    .catch(() => sendErrorNotification('An error occurred'));
};

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, opensrpBaseURL } = props;
  const accessToken = useSelector((state) => getAccessToken(state) as string);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={URL_LOCATION_UNIT_GROUP_EDIT + '/' + record.id.toString()}>
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
                  onClick={() => (onViewDetails ? onViewDetails(record) : {})}
                >
                  View Details
                </Menu.Item>
                <Menu.Item className="delete">
                  <Popconfirm
                    title="Sure to Delete?"
                    onConfirm={() => onDelete(record, accessToken, opensrpBaseURL)}
                  >
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
