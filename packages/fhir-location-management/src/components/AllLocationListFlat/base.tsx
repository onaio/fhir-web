/* eslint-disable @typescript-eslint/naming-convention */
import React, { ReactNode, useMemo } from 'react';
import {
  useSimpleTabularView,
  NoData,
  Column,
  GetControlledSortProps,
  SortParamState,
} from '@opensrp/react-utils';
import { RouteComponentProps } from 'react-router';
import { locationResourceType } from '../../constants';
import { BrokenPage, TableLayout, BodyLayout, SearchForm } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { useMls } from '../../mls';
import { TFunction } from '@opensrp/i18n';
import { Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';
import { getEntryFromBundle, getTableData } from './utils';
import './base.css';
import type { URLParams } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';
import { LocationGridFilterRowRender } from './dataGridFilterRow';
import { SorterResult } from 'antd/es/table/interface';

interface RouteParams {
  locationId: string | undefined;
}

export interface Props {
  fhirBaseURL: string;
  extraParamFilters?: URLParams;
  getColumns: (t: TFunction, getColumnSortProps: GetControlledSortProps) => Column<Dictionary>[];
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
    filterOptions: { updateFilterParams, currentFilters },
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
    onChange: function (
      _: unknown,
      __: unknown,
      sorter: SorterResult<Dictionary> | SorterResult<Dictionary>[]
    ) {
      const sorterArray = Array.isArray(sorter) ? sorter : [sorter];
      const sortMap = sorterArray.reduce((acc, sort) => {
        const dataIndex = sort.column?.dataIndex as string | undefined;
        if (!sort.order) {
          acc[dataIndex as string] = undefined;
          return acc;
        }
        if (dataIndex) {
          acc[dataIndex as string] = { paramAccessor: dataIndex, order: sort.order };
        }
        return acc;
      }, {} as SortParamState);
      updateSortParams(sortMap);
    },
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
          <LocationGridFilterRowRender
            fhirBaseUrl={fhirBaseURL}
            updateFilterParams={updateFilterParams}
            currentFilters={currentFilters}
          />
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </BodyLayout>
  );
};
