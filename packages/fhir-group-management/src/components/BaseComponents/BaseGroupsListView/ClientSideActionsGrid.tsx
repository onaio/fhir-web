import React, { ChangeEvent, ReactNode } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'antd';
import {
  BodyLayout,
  FilterDescription,
  RegisterFilter,
  useClientSideActionsDataGrid,
} from '@opensrp/react-utils';
import { parseGroup, ViewDetailsProps, ViewDetailsWrapper } from '../GroupDetail';
import { groupResourceType } from '../../../constants';
import {
  SearchForm,
  BrokenPage,
  TableLayout,
  Column,
  viewDetailsQuery,
  useSearchParams,
} from '@opensrp/react-utils';
import { useTranslation } from '../../../mls';
import { TFunction } from '@opensrp/i18n';
import { IBundle } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IBundle';

export type DefaultTableData = ReturnType<typeof parseGroup> & Record<string, unknown>;

export type ExtendableTableData = Pick<
  ReturnType<typeof parseGroup>,
  'id' | 'name' | 'active' | 'identifier' | 'lastUpdated'
>;

export type ClientSideActionsBaseListViewProps<
  TableData extends ExtendableTableData = DefaultTableData
> = Partial<Pick<ViewDetailsProps, 'keyValueMapperRenderProp'>> & {
  fhirBaseURL: string;
  getColumns: (t: TFunction) => Column<TableData>[];
  extraQueryFilters?: Record<string, string>;
  addGroupBtnRender?: () => ReactNode;
  pageTitle: string;
  dataTransformer?: (groups: IBundle) => TableData[];
  viewDetailsRender?: (fhirBaseURL: string, resourceId?: string) => ReactNode;
  filterRowRender?: (
    registerFilter: RegisterFilter<TableData>,
    filterRegistry: FilterDescription<TableData>
  ) => ReactNode;
};

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export function ClientSideActionsBaseListView<
  TableData extends ExtendableTableData = DefaultTableData
>(props: ClientSideActionsBaseListViewProps<TableData>) {
  const {
    fhirBaseURL,
    extraQueryFilters,
    filterRowRender,
    getColumns,
    addGroupBtnRender,
    keyValueMapperRenderProp,
    pageTitle,
    viewDetailsRender,
    dataTransformer,
  } = props;

  const { sParams } = useSearchParams();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;
  const { t } = useTranslation();

  const {
    queryValues: { data, isFetching, isLoading, error },
    tablePaginationProps,
    searchFormProps,
    filterOptions: { registerFilter, filterRegistry, deregisterFilter },
  } = useClientSideActionsDataGrid<TableData>(
    fhirBaseURL,
    groupResourceType,
    extraQueryFilters,
    dataTransformer
  );

  if (error && !data.length) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = data;

  const columns = getColumns(t);

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };
  const headerProps = {
    pageHeaderProps: {
      title: pageTitle,
      onBack: undefined,
    },
  };

  const nameFilterKey = 'name';
  const searchInputProps = {
    ...searchFormProps,
    wrapperClassName: 'elongate-search-bar',
    onChangeHandler: (event: ChangeEvent<HTMLInputElement>) => {
      searchFormProps.onChangeHandler(event);
      const searchText = event.target.value;
      if (searchText) {
        registerFilter(
          nameFilterKey,
          (el) => {
            return (el.name ?? '').toLowerCase().includes(searchText.toLowerCase());
          },
          searchText
        );
      } else {
        deregisterFilter(nameFilterKey);
      }
    },
  };

  return (
    <BodyLayout headerProps={headerProps}>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchInputProps} />
            {addGroupBtnRender?.()}
          </div>
          {filterRowRender?.(registerFilter, filterRegistry)}
          <TableLayout {...tableProps} />
        </Col>
        {viewDetailsRender?.(fhirBaseURL, resourceId) ?? (
          <ViewDetailsWrapper
            resourceId={resourceId}
            fhirBaseURL={fhirBaseURL}
            keyValueMapperRenderProp={keyValueMapperRenderProp}
          />
        )}
      </Row>
    </BodyLayout>
  );
}
