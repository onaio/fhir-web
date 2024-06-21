import React from 'react';
import { useMls } from '../../../mls';
import { TableLayout, useSimpleTabularView, Column, SearchForm } from '@opensrp/react-utils';
import { Alert, Button, Col, Divider, Dropdown, MenuProps, Row } from 'antd';
import {
  BACK_SEARCH_PARAM,
  URL_LOCATION_UNIT_ADD,
  URL_LOCATION_UNIT_EDIT,
  URL_LOCATION_VIEW_DETAILS,
  locationResourceType,
  parentIdQueryParam,
} from '../../../constants';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { RbacCheck } from '@opensrp/rbac';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

export interface InventoryViewProps {
  fhirBaseUrl: string;
  locationId: string;
}
/**
 * util to generate filter params from locationId and search values
 *
 * @param locationId - locationId to add to search parameters
 */
const searchParamsFactory = (locationId: string) => {
  return (search: string | null) => {
    let searchParams = {};
    if (search) {
      searchParams = { 'name:contains': search };
    }
    return {
      ...searchParams,
      partof: locationId,
    };
  };
};

export const ChildLocations = ({ fhirBaseUrl, locationId }: InventoryViewProps) => {
  const { t } = useMls();
  const history = useHistory();
  const location = useLocation();

  const searchParams = searchParamsFactory(locationId);
  const {
    queryValues: { data, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useSimpleTabularView<ILocation>(fhirBaseUrl, locationResourceType, searchParams);

  if (error && !data) {
    return <Alert type="error">{t('An error occurred while fetching child locations')}</Alert>;
  }

  const tableData = parseTableData(data?.records ?? []);
  type TableData = typeof tableData[0];

  const backParamObj = { [BACK_SEARCH_PARAM]: location.pathname };
  const backToParam = new URLSearchParams(backParamObj).toString();
  const getItems = (_: TableData): MenuProps['items'] => {
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

  const columns: Column<TableData>[] = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      editable: true,
    },
    {
      title: t('Physical Type'),
      dataIndex: 'type' as const,
      editable: true,
    },
    {
      title: t('Status'),
      dataIndex: 'status' as const,
      editable: true,
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => {
        return (
          <span className="d-flex align-items-center">
            <RbacCheck permissions={['Location.update']}>
              <>
                <Link
                  to={`${URL_LOCATION_UNIT_EDIT}/${record.id.toString()}?${backToParam}`}
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
        );
      },
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isLoading,
    size: 'small' as const,
    pagination: tablePaginationProps,
  };

  return (
    <Row data-testid="child-location-tab" className="list-view">
      <Col style={{ width: '100%' }}>
        <div className="main-content__header">
          <SearchForm data-testid="search-form" {...searchFormProps} />
          <RbacCheck permissions={['Location.create']}>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  const queryParams = {
                    [parentIdQueryParam]: `${locationResourceType}/${locationId}`,
                    ...backParamObj,
                  };
                  const searchString = new URLSearchParams(queryParams).toString();
                  history.push(`${URL_LOCATION_UNIT_ADD}?${searchString}`);
                }}
              >
                <PlusOutlined />
                {t('Add Location Unit')}
              </Button>
            </div>
          </RbacCheck>
        </div>
        <TableLayout {...tableProps} />
      </Col>
    </Row>
  );
};

/**
 * converts location object to a tableData entry
 *
 * @param locations - location object
 */
export function parseTableData(locations: ILocation[]) {
  return locations.map((loc) => ({
    id: loc.id as string,
    name: loc.name,
    partOf: loc.partOf?.display ?? '-',
    description: loc.description,
    status: loc.status,
    type: get(loc, 'physicalType.coding.0.display'),
  }));
}
