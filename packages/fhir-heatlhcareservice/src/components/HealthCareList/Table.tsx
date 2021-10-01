import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_EDIT_HEALTHCARE } from '../../constants';
import { HealthcareService } from '../../types';
import { Column, TableLayout } from '@opensrp/react-utils';
import { Meta } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/meta';

export interface Props {
  data: HealthcareService[];
  onViewDetails?: (healthcareservice: HealthcareService) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails } = props;

  const columns: Column<HealthcareService>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Active',
      dataIndex: 'active',
      sorter: (a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1),
      // eslint-disable-next-line react/display-name
      render: (value: boolean) => <div>{value ? 'Yes' : 'No'}</div>,
    },
    {
      title: 'Last Updated',
      dataIndex: 'meta',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (value: Meta) => {
        if (value.lastUpdated) {
          const date = new Date(value.lastUpdated);
          return <div>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</div>;
        }
      },
    },
  ];

  return (
    <TableLayout
      datasource={props.data}
      columns={columns}
      dataKeyAccessor="id"
      actions={{
        width: '10%',

        // eslint-disable-next-line react/display-name
        render: (_: unknown, record) => (
          <span className="d-flex justify-content-end align-items-center">
            <Link to={URL_EDIT_HEALTHCARE + record.id.toString()}>
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
                      if (onViewDetails) onViewDetails(record);
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
