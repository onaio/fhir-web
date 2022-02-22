import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_LOCATION_UNIT_EDIT } from '../../constants';
import lang from '../../lang';
import { Column, TableLayout } from '@opensrp/react-utils';

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
  const columns: Column<TableData>[] = [
    {
      title: lang.NAME,
      dataIndex: 'name',
    },
    {
      title: 'Parent',
      dataIndex: 'partOf',
    },
    {
      title: lang.PHYSICAL_TYPE,
      dataIndex: 'physicalType',
    },
    {
      title: lang.STATUS,
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
        title: lang.ACTIONS,
        width: '10%',
        // eslint-disable-next-line react/display-name
        render: (_: boolean, record) => (
          <span className="d-flex justify-content-end align-items-center Actions">
            <Link to={`${URL_LOCATION_UNIT_EDIT}/${record.id}`}>
              <Button type="link" className="m-0 p-1">
                Edit
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
                    {lang.VIEW_DETAILS}
                  </Menu.Item>
                </Menu>
              }
              placement="bottomRight"
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
