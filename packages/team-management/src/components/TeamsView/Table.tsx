import React from 'react';
import { Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { sendErrorNotification } from '@opensrp/notifications';
import { Organization } from '../../ducks/organizations';
import { Link } from 'react-router-dom';
import { TEAMS_COUNT, URL_EDIT_TEAM } from '../../constants';
import { Practitioner } from '../../ducks/practitioners';
import { OpenSRPJurisdiction } from '@opensrp/location-management';
import { Column, TableLayout, PaginateData, OpenSRPService } from '@opensrp/react-utils';
import { useTranslation } from '../../mls';
import type { TFunction } from '@opensrp/i18n';

export interface Props {
  opensrpBaseURL: string;
  searchParam: string | string[];
  fetchOrgs: (page: number, pageSize: number, searchquery?: string) => Promise<Organization[]>;
  setDetail: React.Dispatch<React.SetStateAction<Organization | null>>;
  setPractitionersList: React.Dispatch<React.SetStateAction<Practitioner[]>>;
  setAssignedLocations: React.Dispatch<React.SetStateAction<OpenSRPJurisdiction[]>>;
  onViewDetails?: (
    row: Organization,
    opensrpBaseURL: string,
    setDetail: React.Dispatch<React.SetStateAction<Organization | null>>,
    setPractitionersList: React.Dispatch<React.SetStateAction<Practitioner[]>>,
    setAssignedLocations: React.Dispatch<React.SetStateAction<OpenSRPJurisdiction[]>>,
    t: TFunction
  ) => void;
}

const Table: React.FC<Props> = (props: Props) => {
  const {
    setDetail,
    onViewDetails,
    setPractitionersList,
    setAssignedLocations,
    fetchOrgs,
    opensrpBaseURL,
    searchParam,
  } = props;

  const { t } = useTranslation();

  const columns: Column<Organization>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
      sorter: (a: Organization, b: Organization) => a.name.localeCompare(b.name),
    },
  ];

  return (
    <PaginateData<Organization>
      queryFn={fetchOrgs}
      onError={() => sendErrorNotification(t('An error occurred'))}
      queryPram={{ searchParam }}
      pageSize={5}
      queryid="Teams"
      total={(data) => {
        if (searchParam) return data.length;

        const serve = new OpenSRPService(TEAMS_COUNT, opensrpBaseURL);
        return serve.list();
      }}
    >
      {(tableProps) => (
        <TableLayout
          {...tableProps}
          id="TeamList"
          dataKeyAccessor="id"
          columns={columns}
          actions={{
            title: t('Actions'),
            width: '10%',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            render: (_: unknown, record: Organization, index) => (
              <span className="d-flex justify-content-end align-items-center">
                <Link to={`${URL_EDIT_TEAM}/${record.identifier.toString()}`}>
                  <Button type="link" className="m-0 p-1">
                    {t('Edit')}
                  </Button>
                </Link>
                <Divider type="vertical" />
                <Dropdown
                  overlay={
                    <Menu className="menu">
                      <Menu.Item
                        className="viewdetails"
                        key={index}
                        onClick={() => {
                          if (onViewDetails) {
                            onViewDetails(
                              record,
                              opensrpBaseURL,
                              setDetail,
                              setPractitionersList,
                              setAssignedLocations,
                              t
                            );
                          }
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
              </span>
            ),
          }}
        />
      )}
    </PaginateData>
  );
};

export default Table;
