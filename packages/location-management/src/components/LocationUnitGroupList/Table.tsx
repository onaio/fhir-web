import React from 'react';
import { Menu, Dropdown, Button, Divider } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { LocationUnitGroup } from '../../ducks/location-unit-groups';
import { Column, OpenSRPService, TableLayout } from '@opensrp/react-utils';
import { LOCATION_UNIT_GROUP_DELETE, URL_LOCATION_UNIT_GROUP_EDIT } from '../../constants';
import { Link } from 'react-router-dom';
import { LocationUnitGroupDetailProps } from '../LocationUnitGroupDetail';
import { sendSuccessNotification, sendErrorNotification } from '@opensrp/notifications';
import { useTranslation } from '../../mls';
import type { TFunction } from '@opensrp/i18n';

export interface Props {
  data: LocationUnitGroup[];
  opensrpBaseURL: string;
  onViewDetails?: (locationUnit: LocationUnitGroupDetailProps) => void;
}

/**
 * function to delete the record
 *
 * @param record - The record to delete
 * @param opensrpBaseURL - base url
 * @param t - the language translation lookup object
 */
export const onDelete = (record: LocationUnitGroup, opensrpBaseURL: string, t: TFunction) => {
  const clientService = new OpenSRPService(
    LOCATION_UNIT_GROUP_DELETE + record.id.toString(),
    opensrpBaseURL
  );
  clientService
    .delete()
    .then(() => sendSuccessNotification('Successfully Deleted!'))
    .catch(() => sendErrorNotification(t('An error occurred')));
};

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, opensrpBaseURL } = props;
  const data = props.data.sort((a, b) => a.name.localeCompare(b.name)); // sorts the data by name  before populating in the table
  const { t } = useTranslation();

  const columns: Column<LocationUnitGroup>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
      sorter: (a: LocationUnitGroup, b: LocationUnitGroup) => a.name.localeCompare(b.name),
    },
  ];

  const getItems = (record: LocationUnitGroup): MenuProps['items'] => [
    {
      key: '1',
      label: (
        <Button
          className="viewdetails"
          data-testid="viewdetails"
          onClick={() => (onViewDetails ? onViewDetails(record) : {})}
        >
          {t('View Details')}
        </Button>
      )
    },
    {
      key: '2',
      label: (
        <Button
          className="delete"
          data-testid="delete"
          onClick={() => onDelete(record, opensrpBaseURL, t)}
        >
          {t('Deactivate')}
        </Button>
      )
    }
  ]

  return (
    <TableLayout
      id="LocationUnitGroupList"
      persistState={true}
      datasource={data}
      columns={columns}
      actions={{
        title: t('Actions'),
        width: '10%',
        // eslint-disable-next-line react/display-name
        render: (_: unknown, record) => (
          <span>
            <Link to={`${URL_LOCATION_UNIT_GROUP_EDIT}/${record.id.toString()}`}>
              <Button type="link" className="m-0 p-1">
                {t('Edit')}
              </Button>
            </Link>
            <Divider type="vertical" />
            <Dropdown
              menu={{ items: getItems(record) }}
              placement="bottomLeft"
              arrow
              trigger={['click']}
            >
              <MoreOutlined className="more-options"  />
            </Dropdown>
          </span>
        ),
      }}
    />
  );
};

export default Table;
