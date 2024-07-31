import React, { ReactNode, useMemo } from 'react';
import { useSimpleTabularView, NoData, Column, PaginatedAsyncSelect } from '@opensrp/react-utils';
import { RouteComponentProps } from 'react-router';
import { locationResourceType } from '../../constants';
import { BrokenPage, TableLayout, BodyLayout, SearchForm } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { useMls } from '../../mls';
import { TFunction } from '@opensrp/i18n';
import { Row, Col, Select, Space } from 'antd';
import { useHistory } from 'react-router-dom';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';
import { getEntryFromBundle, getTableData } from './utils';
import './base.css';
import type { URLParams } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';

interface RouteParams {
  locationId: string | undefined;
}

export interface Props {
  fhirBaseURL: string;
  extraParamFilters?: URLParams;
  getColumns: (t: TFunction, getColumnSortProps: Function) => Column<Dictionary>[];
  pageTitle: string;
  addLocationBtnRender: () => ReactNode;
}

const getSearchParamsFactory = (ourParams: URLParams) => (search: string | null) => {
  const baseSearchParam = { ...ourParams, _include: 'Location:partof' };
  if (search) {
    return { 'name:contains': search, ...baseSearchParam };
  }
  return baseSearchParam;
};

export type BaseAllLocationListFlatProps = Props & RouteComponentProps<RouteParams>;

/* Function which shows the list of all locations
 *
 * @param {Object} props - AllLocationListFlat component props
 * @returns {Function} returns paginated locations list display
 */
export const BaseAllLocationListFlat: React.FC<BaseAllLocationListFlatProps> = (props) => {
  const { fhirBaseURL, extraParamFilters, addLocationBtnRender, getColumns, pageTitle } = props;
  const { t } = useMls();
  const history = useHistory();
  const getSearchParams = getSearchParamsFactory(extraParamFilters ?? {});

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
    sortOptions: { updateSortParams, getControlledSortProps },
    filterOptions: { updateFilterParams, currentFilters }
  } = useSimpleTabularView<BundleEntry>(
    fhirBaseURL,
    locationResourceType,
    getSearchParams,
    getEntryFromBundle
  );

  const tableData = useMemo(() => getTableData(data?.records ?? []), [data]);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const getTableLocale = () => {
    const urlQuery = history.location.search;
    const nameSearchActive = urlQuery.includes('search=');
    if (!tableData.length && (!isFetching || !isLoading)) {
      const description = nameSearchActive
        ? ''
        : t('No data available to display, you can start adding data now');
      return {
        emptyText: (
          <NoData description={description}>{!nameSearchActive && addLocationBtnRender()}</NoData>
        ),
      };
    }
  };



  const tableProps = {
    datasource: tableData,
    columns: getColumns(t, getControlledSortProps),
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
    locale: getTableLocale(),
    onChange: function (pagination: any, filters: any, sorter: any) {
      console.log({ pagination, filters, sorter })
      const sorterArray = Array.isArray(sorter) ? sorter : [sorter]
      const sortMap = sorterArray.reduce((acc, sort) => {
        acc[sort.field] = { paramAccessor: sort.field, order: sort.order }
        return acc
      }, {})
      updateSortParams(sortMap)
    }
  };
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  return (
    <BodyLayout headerProps={headerProps} id="all-locations">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            {addLocationBtnRender()}
          </div>
          <div className="filter-row" data-testid="filter-row" style={{ margin: "16px 0" }}>
            <Space>
              <Space>
                Parent Location:
                <PaginatedAsyncSelect<ILocation>
                  allowClear={true}
                  showSearch={true}
                  resourceType='Location'
                  baseUrl={fhirBaseURL}
                  transformOption={(resource) => {
                    return {
                      value: resource.id!,
                      label: resource.name!,
                      ref: resource
                    }
                  }}
                  onChange={(value) => {
                    console.log({value})
                    if (!value) {
                      updateFilterParams({ "partof": undefined as any })
                    } else {
                      updateFilterParams({
                        "partOf": {
                          paramAccessor: "partof",
                          rawValue: value,
                          paramValue: value
                        }
                      })
                    }
                  }}
                />
              </Space>
              <Space>
                Status:
                <Select
                id="location-status-filter"
                  value={currentFilters["status"]?.rawValue ?? "*"}
                  style={{ width: 120 }}
                  onChange={(value: string) => {
                    if (value === "*") {
                      updateFilterParams({ "status": undefined })
                      return
                    }
                    updateFilterParams({
                      "status": {
                        paramAccessor: "status",
                        rawValue: value,
                        paramValue: value
                      }
                    })
                  }}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: '*', label: 'Show all' },
                  ]}
                />
              </Space>
            </Space>
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </BodyLayout>
  );
};
