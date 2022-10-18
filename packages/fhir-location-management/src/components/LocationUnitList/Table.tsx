import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT } from '../../constants';
import { Column, TableLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';

export interface TableData {
  id: string;
  key: string;
  name: string;
  description?: string;
  status?: string;
  physicalType?: string;
  partOf?: string;
}

export interface Props {
  data: TableData[];
  onViewDetails?: (row: TableData) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails } = props;
  const { t } = useTranslation();
  const columns: Column<TableData>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
    },
    {
      title: t('Parent'),
      dataIndex: 'partOf',
    },
    {
      title: t('Physical Type'),
      dataIndex: 'physicalType',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
    },
  ];

  return (
    <TableLayout
      id="LocationUnitList"
      persistState={true}
      datasource={props.data}
      columns={columns}
      actions={{
        title: t('Actions'),
        width: '10%',
        // eslint-disable-next-line react/display-name
        render: (_: boolean, record) => (
          <>
            <Link to={`${URL_LOCATION_UNIT_EDIT}/${record.id}`}>
              <Button type="link" className="m-0 p-1">
                {t('Edit')}
              </Button>
            </Link>
            <Divider type="vertical" />
            <Dropdown
              overlay={
                <Menu className="menu">
                  <Menu.Item
                    className="view-details"
                    onClick={() => {
                      onViewDetails?.(record);
                    }}
                  >
                    {t('View details')}
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
              arrow
              trigger={['click']}
            >
              <MoreOutlined className="more-options" />
            </Dropdown>
          </>
        ),
      }}
    />
  );
};

export default Table;
