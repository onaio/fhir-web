import React from 'react';
import { Button, Divider, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
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

  const getItems = (record: TableData): MenuProps['items'] => [
    {
      key: '1',
      label: (
        <Button
          type="link"
          data-testid="view-location"
          onClick={() => {
            onViewDetails?.(record);
          }}
        >
          {t('View details')}
        </Button>
      ),
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
            <Button type="link" className="m-0 p-1">
              <Link to={`${URL_LOCATION_UNIT_EDIT}/${record.id}`}>{t('Edit')}</Link>
            </Button>
            <Divider type="vertical" />
            <Dropdown
              menu={{ items: getItems(record) }}
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
