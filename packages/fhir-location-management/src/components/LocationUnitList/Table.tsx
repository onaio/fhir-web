import React from 'react';
import {  Divider, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT, URL_LOCATION_VIEW_DETAILS } from '../../constants';
import { Column, TableLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import { RbacCheck } from '@opensrp/rbac';

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
}

const Table: React.FC<Props> = (props: Props) => {
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
        <Link to={`${URL_LOCATION_VIEW_DETAILS}/${record.id}`} className="m-0 p-1">
          {t('View details')}
        </Link>
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
            <RbacCheck permissions={['Location.update']}>
              <>
                <Link to={`${URL_LOCATION_UNIT_EDIT}/${record.id}`} className="m-0 p-1">
                  {t('Edit')}
                </Link>
                <Divider type="vertical" />
              </>
            </RbacCheck>
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
