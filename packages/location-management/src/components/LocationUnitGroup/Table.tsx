import React from 'react';
import { Table as AntTable, Popconfirm, Menu, Dropdown, Button, Divider, notification } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationTag } from '../../ducks/location-tags';
import { OpenSRPService } from '@opensrp/server-service';
import { KEYCLOAK_API_BASE_URL, URL_DELETE_LOCATION_TAGS } from '../../constants';

export interface TableData extends LocationTag {
  key: string;
}

export interface Props {
  data: TableData[];
  onViewDetails?: Function;
  accessToken: string;
}

const Table: React.FC<Props> = (props: Props) => {
  const { accessToken, data, onViewDetails } = props;

  /**
   * fucntion to edit the record
   *
   * @param {object} record - The record to edit
   */
  function onEdit(record: TableData) {
    // eslint-disable-next-line
    console.log('editting : ', record);
  }

  /**
   * fucntion to delete the record
   *
   * @param {object} record - The record to delete
   */
  function onDelete(record: LocationTag) {
    const clientService = new OpenSRPService(
      accessToken,
      KEYCLOAK_API_BASE_URL,
      URL_DELETE_LOCATION_TAGS + `/${record.id}`
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
          <Button type="link" className="m-0 p-1" onClick={() => onEdit(record)}>
            Edit
          </Button>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => onViewDetails && onViewDetails(record)}>
                  View Details
                </Menu.Item>
                <Menu.Item>
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

  const mergedColumns = columns.map((col) => col);
  return <AntTable dataSource={data} columns={mergedColumns} />;
};

export default Table;
