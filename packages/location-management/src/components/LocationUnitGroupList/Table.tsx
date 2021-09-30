import React from 'react';
import { Menu, Dropdown, Button, Divider } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { Column, OpenSRPService, TableLayout } from '@opensrp-web/react-utils';
import { LOCATION_UNIT_GROUP_DELETE, URL_LOCATION_UNIT_GROUP_EDIT } from '../../constants';
import lang, { Lang } from '../../lang';
import { Link } from 'react-router-dom';
import { LocationUnitGroupDetailProps } from '../LocationUnitGroupDetail';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp-web/notifications';

export interface Props {
  data: LocationUnitGroup[];
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
  const data = props.data.sort((a, b) => a.name.localeCompare(b.name)); // sorts the data by name  before populating in the table

  const columns: Column<LocationUnitGroup>[] = [
    {
      title: lang.NAME,
      dataIndex: 'name',
      sorter: (a: LocationUnitGroup, b: LocationUnitGroup) => a.name.localeCompare(b.name),
    },
  ];

  return (
    <TableLayout
      id="LocationUnitGroupList"
      persistState={true}
      datasource={data}
      columns={columns}
      actions={{
        title: lang.ACTIONS,
        width: '10%',
        // eslint-disable-next-line react/display-name
        render: (_: unknown, record) => (
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
        ),
      }}
    />
  );
};

export default Table;
