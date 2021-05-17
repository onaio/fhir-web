import React from 'react';
import { Table as AntTable, Menu, Dropdown, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { OpenSRPService } from '@opensrp/react-utils';
import { LOCATION_UNIT_GROUP_DELETE, URL_LOCATION_UNIT_GROUP_EDIT } from '../../constants';
import lang, { Lang } from '../../lang';
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

/**
 * function to delete the record
 *
 * @param {object} record - The record to delete
 * @param {string} opensrpBaseURL - base url
 * @param {Lang} langObj - the language translation lookup object
 */
export const onDelete = (
  record: LocationUnitGroup,
  opensrpBaseURL: string,
  langObj: Lang = lang
) => {
  const clientService = new OpenSRPService(
    LOCATION_UNIT_GROUP_DELETE + record.id.toString(),
    opensrpBaseURL
  );
  clientService
    .delete()
    .then(() => sendSuccessNotification('Successfully Deleted!'))
    .catch(() => sendErrorNotification(langObj.ERROR_OCCURED));
};

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, opensrpBaseURL } = props;

  return (
    <AntTable
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        defaultPageSize: 20,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      dataSource={props.data}
    >
      <AntTable.Column
        defaultSortOrder="ascend"
        title={lang.NAME}
        dataIndex="name"
        sorter={(a: TableData, b: TableData) => a.name.localeCompare(b.name)}
      />
      <AntTable.Column
        title={lang.ACTIONS}
        width="10%"
        dataIndex="operation"
        sorter={(a: TableData, b: TableData) => a.name.localeCompare(b.name)}
        render={(_: unknown, record: TableData) => (
          <span className="d-flex justify-content-end align-items-center Actions">
            <Link to={URL_LOCATION_UNIT_GROUP_EDIT + '/' + record.id.toString()}>
              <Button type="link" className="m-0 p-1">
                {lang.EDIT}
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
                    {lang.VIEW_DETAILS}
                  </Menu.Item>
                  <Menu.Item className="delete" onClick={() => onDelete(record, opensrpBaseURL)}>
                    {lang.DEACTIVATE}
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
        )}
      />
    </AntTable>
  );
};

export default Table;
