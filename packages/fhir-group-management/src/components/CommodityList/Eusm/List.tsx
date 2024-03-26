import React from 'react';
import { Button, Divider, Dropdown, MenuProps } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { ADD_EDIT_COMMODITY_URL } from '../../../constants';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../mls';
import { BaseListView, BaseListViewProps } from '../../BaseComponents/BaseGroupsListView';
import { TFunction } from '@opensrp/i18n';
import { useSearchParams, viewDetailsQuery } from '@opensrp/react-utils';
import { supplyMgSnomedCode, snomedCodeSystem } from '../../../helpers/utils';
import { RbacCheck, useUserRole } from '@opensrp/rbac';
import { ViewDetailsWrapper, parseEusmCommodity } from './ViewDetails';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';

interface GroupListProps {
  fhirBaseURL: string;
  listId: string; // commodities are added to list resource with this id
}

type TableData = ReturnType<typeof parseEusmCommodity>;

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const EusmCommodityList = (props: GroupListProps) => {
  const { fhirBaseURL, listId } = props;

  const { t } = useTranslation();
  const { addParam } = useSearchParams();
  const userRole = useUserRole();

  const getItems = (record: TableData): MenuProps['items'] => {
    return [
      {
        key: '1',
        permissions: [],
        label: (
          <Button
            data-testid="view-details"
            onClick={() => addParam(viewDetailsQuery, record.id)}
            type="link"
          >
            {t('View Details')}
          </Button>
        ),
      },
    ]
      .filter((item) => userRole.hasPermissions(item.permissions))
      .map((item) => {
        const { permissions, ...rest } = item;
        return rest;
      });
  };

  const getColumns = (t: TFunction) => [
    {
      title: t('Material Number'),
      dataIndex: 'identifier' as const,
      key: 'identifier' as const,
    },
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      key: 'name' as const,
    },
    {
      title: t('Attractive item'),
      dataIndex: 'attractive' as const,
      key: 'attractive' as const,
      render: (value: boolean) => <div>{value ? t('Yes') : t('No')}</div>,
    },
    {
      title: t('type'),
      dataIndex: 'type' as const,
      key: 'type' as const,
    },
    {
      title: t('Active'),
      dataIndex: 'active' as const,
      key: 'active' as const,
      render: (value: boolean) => <div>{value ? t('Active') : t('Disabled')}</div>,
    },
    {
      title: t('Actions'),
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['Group.update']}>
            <>
              <Link to={`${ADD_EDIT_COMMODITY_URL}/${record.id}`} className="m-0 p-1">
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
            <MoreOutlined data-testid="action-dropdown" className="more-options" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const baseListViewProps: BaseListViewProps<TableData> = {
    getColumns: getColumns,
    createButtonLabel: t('Add commodity'),
    createButtonUrl: ADD_EDIT_COMMODITY_URL,
    fhirBaseURL,
    generateTableData: (group: IGroup) => parseEusmCommodity(group),
    pageTitle: t('Commodity List'),
    extraQueryFilters: {
      code: `${snomedCodeSystem}|${supplyMgSnomedCode}`,
      '_has:List:item:_id': listId,
    },
    viewDetailsRender: (fhirBaseURL, resourceId) => (
      <ViewDetailsWrapper fhirBaseURL={fhirBaseURL} resourceId={resourceId} />
    ),
  };

  return <BaseListView {...baseListViewProps} />;
};
