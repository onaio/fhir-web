import React from 'react';
import { Menu, Dropdown, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { OpenSRPService } from '@opensrp/react-utils';
import { LOCATION_UNIT_GROUP_DELETE, URL_LOCATION_UNIT_GROUP_EDIT } from '../../constants';
import { ERROR_OCCURED, NAME, ACTIONS, EDIT, VIEW_DETAILS, DELETE } from '../../lang';
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
 * @param {string} opensrpBaseURL - base url
 */
export const onDelete = (record: LocationUnitGroup, opensrpBaseURL: string) => {
  const clientService = new OpenSRPService(
    LOCATION_UNIT_GROUP_DELETE + record.id.toString(),
    opensrpBaseURL
  );
  clientService
    .delete()
    .then(() => sendSuccessNotification('Successfully Deleted!'))
    .catch(() => sendErrorNotification(ERROR_OCCURED));
};

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, opensrpBaseURL } = props;

  const columns = [
    {
      title: NAME,
      dataIndex: 'name',
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: ACTIONS,
      dataIndex: 'operation',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={URL_LOCATION_UNIT_GROUP_EDIT + '/' + record.id.toString()}>
            <Button type="link" className="m-0 p-1">
              {EDIT}
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
                  {VIEW_DETAILS}
                </Menu.Item>
                <Menu.Item className="delete" onClick={() => onDelete(record, opensrpBaseURL)}>
                  {DELETE}
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

  return (
    <AntTable
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: 5,
        pageSizeOptions: ['5', '10', '20', '50', '100'],
      }}
      dataSource={props.data}
      columns={columns}
    />
  );
};

export default Table;
