import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { URL_EDIT_TEAM } from '../../constants';
import { Organization } from '../../types';
import { Column, TableLayout } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';

export interface Props {
  data: Organization[];
  fhirBaseURL: string;
  onViewDetails?: (param: { team: Organization; fhirBaseURL: string }) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const { onViewDetails, fhirBaseURL } = props;
  const { t } = useTranslation();

  const columns: Column<Organization>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
      sorter: (a: Organization, b: Organization) => a.name.localeCompare(b.name),
    },
    {
      title: t('Status'),
      dataIndex: 'active',
      // eslint-disable-next-line react/display-name
      render: (value) => <div>{value ? t('Active') : t('Inactive')}</div>,
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: Organization) => (
        <span className="d-flex justify-content-end align-items-center">
          <Link to={URL_EDIT_TEAM + record.id.toString()}>
            <Button type="link" className="m-0 p-1">
              {t('Edit')}
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  onClick={() => onViewDetails && onViewDetails({ team: record, fhirBaseURL })}
                >
                  {t('View Details')}
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined />
          </Dropdown>
        </span>
      ),
    },
  ];

  return <TableLayout datasource={props.data} columns={columns} />;
};

export default Table;
