import React from 'react';
import { useMls } from '../../mls';
import { Button, Divider, Dropdown } from 'antd';
import { useHistory, Link } from 'react-router-dom';
import { RbacCheck } from '@opensrp/rbac';
import { MenuProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseAllLocationListFlat, BaseAllLocationListFlatProps } from './base';
import { Dictionary } from '@onaio/utils';
import { eusmPhysicalLocationsFilterParams } from './utils';
import { URL_LOCATION_VIEW_DETAILS, URL_SERVICE_POINT_ADD_EDIT } from '../../constants';
import { TFunction } from '@opensrp/i18n';
import { GetControlledSortProps } from '@opensrp/react-utils';

export type EusmLocationListFlatProps = Omit<
  BaseAllLocationListFlatProps,
  'columns' | 'addLocationBtnRender' | 'pageTitle' | 'extraParamFilters'
>;

/* Function which shows the list of all locations
 *
 * @param {Object} props - AllLocationListFlat component props
 * @returns {Function} returns paginated locations list display
 */
export const EusmLocationListFlat: React.FC<EusmLocationListFlatProps> = (props) => {
  const { t } = useMls();
  const history = useHistory();

  const getItems = (_: Dictionary): MenuProps['items'] => {
    // Todo: replace _ above when handling onClick
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
      title: t('Type'),
      dataIndex: 'type' as const,
    },
    {
      title: t('Status'),
      dataIndex: 'status' as const,
    },
    {
      title: t('Parent'),
      dataIndex: 'parent' as const,
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: Dictionary) => (
        <span className="d-flex align-items-center">
          <RbacCheck permissions={['Location.update']}>
            <>
              <Link
                to={`${URL_SERVICE_POINT_ADD_EDIT}/${record.id.toString()}`}
                className="m-0 p-1"
              >
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
            <MoreOutlined className="more-options" data-testid="action-dropdown" />
          </Dropdown>
        </span>
      ),
    },
  ];

  const addLocationBtnRender = () => (
    <RbacCheck permissions={['Location.create']}>
      <Button type="primary" onClick={() => history.push(URL_SERVICE_POINT_ADD_EDIT)}>
        <PlusOutlined />
        {t('Add Service point')}
      </Button>
    </RbacCheck>
  );

  const baseProps: BaseAllLocationListFlatProps = {
    ...props,
    pageTitle: t('Service points'),
    addLocationBtnRender,
    getColumns,
    extraParamFilters: eusmPhysicalLocationsFilterParams,
    showParentLocationFilter: false,
  };

  return <BaseAllLocationListFlat {...baseProps} />;
};
