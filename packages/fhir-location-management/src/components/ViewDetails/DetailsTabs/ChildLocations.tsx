import React from 'react';
import { useTranslation } from '../../../mls';
import { TableLayout, useSimpleTabularView, Column, SearchForm } from '@opensrp/react-utils';
import { Alert, Button, Col, Row } from 'antd';
import { URL_LOCATION_UNIT_ADD, locationResourceType, parentIdQueryParam } from '../../../constants';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { get } from 'lodash';
import { RbacCheck } from '@opensrp/rbac';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

export interface InventoryViewProps {
  fhirBaseUrl: string;
  locationId: string;
}

export const ChildLocations = ({ fhirBaseUrl, locationId }: InventoryViewProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  function searchParams(search: string | null) {
    let searchParams = {}
    if (search) {
      searchParams = { "name:contains": search }
    }
    return {
      ...searchParams,
      partof: locationId,
    }
  }

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

  const columns: Column<TableData>[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
    },
    {
      title: t('Physical Type'),
      dataIndex: 'physicalType' as const,
    },
    {
      title: t('Status'),
      dataIndex: 'status' as const,
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
      <Col style={{ width: "100%" }}>
        <div className="main-content__header">
          <SearchForm data-testid="search-form" {...searchFormProps} />
          <RbacCheck permissions={['Location.create']}>
            <div>
              <Button
                type="primary"
                onClick={() => {
                  const queryParams = { [parentIdQueryParam]: locationId };
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
 * @param locations
 */
export function parseTableData(locations: ILocation[]) {
  return locations.map((loc) => ({
    name: loc.name,
    partOf: loc.partOf?.display ?? '-',
    description: loc.description,
    status: loc.status,
    physicalType: get(loc, 'physicalType.coding.0.display'),
  }));
}
