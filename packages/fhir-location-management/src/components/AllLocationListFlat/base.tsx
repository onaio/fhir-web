import React, { ReactNode, useMemo } from 'react';
import { useSimpleTabularView, NoData, Column } from '@opensrp/react-utils';
import { RouteComponentProps } from 'react-router';
import { locationResourceType } from '../../constants';
import { BrokenPage, TableLayout, PageHeader, SearchForm } from '@opensrp/react-utils';
import { Helmet } from 'react-helmet';
import { useMls } from '../../mls';
import { Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import { BundleEntry } from '@smile-cdr/fhirts/dist/FHIR-R4/classes/bundleEntry';
import { getEntryFromBundle, getTableData } from './utils';
import './base.css';
import type { URLParams } from '@opensrp/server-service';
import { Dictionary } from '@onaio/utils';

interface RouteParams {
  locationId: string | undefined;
}

export interface Props {
  fhirBaseURL: string;
  extraParamFilters?: URLParams;
  columns: Column<Dictionary>[];
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
  const { fhirBaseURL, extraParamFilters, addLocationBtnRender, columns, pageTitle } = props;
  const { t } = useMls();
  const history = useHistory();
  const getSearchParams = getSearchParamsFactory(extraParamFilters ?? {});

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
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
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
    locale: getTableLocale(),
  };

  return (
    <div id="all-locations" className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            {addLocationBtnRender()}
          </div>
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};
