import React from 'react';
import { Button, Divider, Dropdown, MenuProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { ADD_EDIT_COMMODITY_URL } from '../../../constants';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from '../../../mls';
import { TFunction } from '@opensrp/i18n';
import { getResourcesFromBundle, useSearchParams, viewDetailsQuery } from '@opensrp/react-utils';
import { supplyMgSnomedCode, snomedCodeSystem } from '../../../helpers/utils';
import { RbacCheck, useUserRole } from '@opensrp/rbac';
import { ViewDetailsWrapper, parseEusmCommodity } from './ViewDetails';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { GroupGridFilerRow, TableData } from './GroupGridFilterRow';
import {
  ClientSideActionsBaseListView,
  ClientSideActionsBaseListViewProps,
} from '../../BaseComponents/BaseGroupsListView/ClientSideActionsGrid';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

interface GroupListProps {
  fhirBaseURL: string;
  listId: string; // commodities are added to list resource with this id
}

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const EusmCommodityList = (props: GroupListProps) => {
  const { fhirBaseURL, listId } = props;

  const history = useHistory();
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
      sorter: (a: TableData, b: TableData) =>
        (a.identifier ?? '').localeCompare(b.identifier ?? ''),
    },
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      key: 'name' as const,
      sorter: (a: TableData, b: TableData) => (a.name ?? '').localeCompare(b.name ?? ''),
    },
    {
      title: t('Is it an Asset'),
      dataIndex: 'attractive' as const,
      key: 'attractive' as const,
      render: (value: boolean) => <div>{value ? t('Yes') : t('No')}</div>,
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
          <RbacCheck permissions={['Group.update', 'List.create', 'List.update']}>
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

  const baseListViewProps: ClientSideActionsBaseListViewProps<TableData> = {
    getColumns: getColumns,
    addGroupBtnRender: () => {
      return (
        <RbacCheck permissions={['Group.create', 'List.create', 'List.update']}>
          <Button type="primary" onClick={() => history.push(ADD_EDIT_COMMODITY_URL)}>
            <PlusOutlined />
            {t('Add commodity')}
          </Button>
        </RbacCheck>
      );
    },
    fhirBaseURL,
    dataTransformer(bundle: IBundle) {
      return getResourcesFromBundle<IGroup>(bundle).map((group) => parseEusmCommodity(group));
    },
    pageTitle: t('Commodity List'),
    extraQueryFilters: {
      code: `${snomedCodeSystem}|${supplyMgSnomedCode}`,
      '_has:List:item:_id': listId,
    },
    viewDetailsRender: (fhirBaseURL, resourceId) => (
      <ViewDetailsWrapper fhirBaseURL={fhirBaseURL} resourceId={resourceId} />
    ),
    filterRowRender(registerFilter, filterRegistry) {
      return (
        <GroupGridFilerRow updateFilterParams={registerFilter} currentFilters={filterRegistry} />
      );
    },
  };

  return <ClientSideActionsBaseListView {...baseListViewProps} />;
};
