import React from 'react';
import {
  URL_LOCATION_UNIT_ADD,
  URL_LOCATION_VIEW_DETAILS,
  BACK_SEARCH_PARAM,
} from '../../constants';
import { useMls } from '../../mls';
import { Button, Divider, Dropdown } from 'antd';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { RbacCheck } from '@opensrp/rbac';
import { MenuProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseAllLocationListFlat, BaseAllLocationListFlatProps } from './base';
import { Dictionary } from '@onaio/utils';
import { EditLink } from '../EditLink';
import { TFunction } from '@opensrp/i18n';
import { GetControlledSortProps } from '@opensrp/react-utils';

export type AllLocationListFlatProps = Omit<
  BaseAllLocationListFlatProps,
  'columns' | 'addLocationBtnRender' | 'pageTitle' | 'extraParamFilters'
>;

/* Function which shows the list of all locations
 *
 * @param {Object} props - AllLocationListFlat component props
 * @returns {Function} returns paginated locations list display
 */
export const AllLocationListFlat: React.FC<AllLocationListFlatProps> = (props) => {
  const { t } = useMls();
  const history = useHistory();
  const location = useLocation();

  const backToParam = new URLSearchParams({ [BACK_SEARCH_PARAM]: location.pathname });

  const getItems = (_: Dictionary): MenuProps['items'] => {
    return [
      {
        key: '1',
        label: (
          <Link to={`${URL_LOCATION_VIEW_DETAILS}/${_.id}`} className="m-0 p-1">
            {t('View details')}
          </Link>
        ),
      },
    ];
  };

  const getColumns = (t: TFunction, getControlledSortProps: GetControlledSortProps) => [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      sorter: true,
      ...getControlledSortProps('name'),
    },
    {
      title: t('Parent'),
      dataIndex: 'parent' as const,
    },
    {
      title: t('Physical Type'),
      dataIndex: 'type' as const,
    },
    {
      title: t('Status'),
      dataIndex: 'status' as const,
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: Dictionary) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['Location.update']}>
            <>
              <EditLink location={record.location} editLinkText={t('Edit')} />
              <Divider type="vertical" />
            </>
          </RbacCheck>
          <Dropdown
            menu={{ items: getItems(record) }}
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" data-testid="action-dropdown" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const addLocationBtnRender = () => (
    <RbacCheck permissions={['Location.create']}>
      <Button
        type="primary"
        onClick={() => history.push(`${URL_LOCATION_UNIT_ADD}?${backToParam}`)}
      >
        <PlusOutlined />
        {t('Add Location')}
      </Button>
    </RbacCheck>
  );

  const baseProps = {
    ...props,
    pageTitle: t('Locations'),
    addLocationBtnRender,
    getColumns,
  };

  return <BaseAllLocationListFlat {...baseProps} />;
};
