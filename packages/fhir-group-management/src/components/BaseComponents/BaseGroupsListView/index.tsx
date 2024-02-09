import React, { ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button } from 'antd';
import { PageHeader, useSimpleTabularView } from '@opensrp/react-utils';
import { parseGroup, ViewDetailsProps, ViewDetailsWrapper } from '../GroupDetail';
import { PlusOutlined } from '@ant-design/icons';
import { groupResourceType } from '../../../constants';
import { useHistory } from 'react-router-dom';
import {
  SearchForm,
  BrokenPage,
  TableLayout,
  Column,
  viewDetailsQuery,
  useSearchParams,
} from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useTranslation } from '../../../mls';
import { TFunction } from '@opensrp/i18n';
import { RbacCheck } from '@opensrp/rbac';

export type TableData = ReturnType<typeof parseGroup>;

export type BaseListViewProps = Pick<ViewDetailsProps, 'keyValueMapperRenderProp'> & {
  fhirBaseURL: string;
  getColumns: (t: TFunction) => Column<TableData>[];
  extraQueryFilters?: Record<string, string>;
  createButtonLabel: string;
  createButtonUrl?: string;
  pageTitle: string;
  viewDetailsRender?: (fhirBaseURL: string, resourceId?: string) => ReactNode
};

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const BaseListView = (props: BaseListViewProps) => {
  const {
    fhirBaseURL,
    extraQueryFilters,
    getColumns,
    createButtonLabel,
    createButtonUrl,
    keyValueMapperRenderProp,
    pageTitle,
    viewDetailsRender
  } = props;

  const { sParams } = useSearchParams();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;
  const { t } = useTranslation();
  const history = useHistory();

  const getSearchParams = (search: string | null) => {
    if (search) {
      return { [`name:contains`]: search, ...extraQueryFilters };
    }
    return { ...extraQueryFilters };
  };

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
  } = useSimpleTabularView<IGroup>(fhirBaseURL, groupResourceType, getSearchParams);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data?.records ?? []).map((org: IGroup, index: number) => {
    return {
      ...parseGroup(org),
      key: `${index}`,
    };
  });

  const columns = getColumns(t);

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} />
            <RbacCheck permissions={['Group.create']}>
              {createButtonUrl ? (
                <Button type="primary" onClick={() => history.push(createButtonUrl)}>
                  <PlusOutlined />
                  {createButtonLabel}
                </Button>
              ) : null}
            </RbacCheck>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        {viewDetailsRender?.(fhirBaseURL, resourceId) ?? <ViewDetailsWrapper
          resourceId={resourceId}
          fhirBaseURL={fhirBaseURL}
          keyValueMapperRenderProp={keyValueMapperRenderProp}
        />}
      </Row>
    </div>
  );
};
