import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_EDIT_GROUP } from '../../constants';
import { Groups } from '../../types';
import { Column, TableLayout } from '@opensrp/react-utils';
import { Meta } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/meta';

export interface TableData extends Groups {
  key: string;
}

export interface Props {
  data: TableData[];
  fhirBaseURL: string;
  onViewDetails?: (param: { group: TableData; fhirBaseURL: string }) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, fhirBaseURL } = props;

  const columns: Column<TableData>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Active',
      dataIndex: 'active',
      sorter: (a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1),
      render: (value) => <div>{value ? 'Yes' : 'No'}</div>,
    },
    {
      title: 'Last Updated',
      dataIndex: 'meta',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value: Meta) => {
        if (value.lastUpdated) {
          const date = new Date(value.lastUpdated);
          return (
            <div>{date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()}</div>
          );
        }
      },
    },
  ];

  return (
    <TableLayout
      datasource={props.data}
      columns={columns}
      actions={{
        width: '10%',

        // eslint-disable-next-line react/display-name
        render: (_: unknown, record) => (
          <span className="d-flex justify-content-end align-items-center">
            <Link to={URL_EDIT_GROUP + record.id.toString()}>
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
                    onClick={() => {
                      if (onViewDetails) onViewDetails({ group: record, fhirBaseURL });
                    }}
                  >
                    View Details
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
