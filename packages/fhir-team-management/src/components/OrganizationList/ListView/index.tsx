/**
 * Just shows a table that lists organizations, allows users to filter and
 * search organizations, and links to create/edit organization views.
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@opensrp/react-utils';
import { Row, Col, Button, Divider, Dropdown, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
  SearchForm,
  BrokenPage,
  TableLayout,
  useSimpleTabularView,
  viewDetailsQuery,
  useSearchParams,
} from '@opensrp/react-utils';
import {
  URL_ADD_ORGANIZATION,
  URL_EDIT_ORGANIZATION,
  organizationResourceType,
} from '../../../constants';
import { parseOrganization, ViewDetailsWrapper } from '../ViewDetails';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';
import { useTranslation } from '../../../mls';

export type TRQuery = [string, number, number];

interface OrganizationListProps {
  fhirBaseURL: string;
}

/**
 * Renders organization in a table
 *
 * @param props -  component props
 */
export const OrganizationList = (props: OrganizationListProps) => {
  const { fhirBaseURL } = props;

  const { t } = useTranslation();
  const { addParam, sParams } = useSearchParams();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;
  const { searchFormProps, tablePaginationProps, queryValues } =
    useSimpleTabularView<IOrganization>(fhirBaseURL, organizationResourceType);
  const { data, isFetching, isLoading, error } = queryValues;


  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data?.records ?? []).map((org: IOrganization, index: number) => {
    return {
      ...parseOrganization(org),
      key: `${index}`,
    };
  });

  type TableData = typeof tableData[0];

  const getItems = (record: TableData): MenuProps['items'] => [
    {
      key: '1',
      label: (
        <Button onClick={() => addParam(viewDetailsQuery, record.id)} type="link">
          {t('View Details')}
        </Button>
      )
    }
  ]

  const columns = [
    {
      title: t('Team name'),
      dataIndex: 'name' as const,
      key: 'name' as const,
    },
    {
      title: t('Actions'),
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${URL_EDIT_ORGANIZATION}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              {t('Edit')}
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            menu={{ items: getItems(record) }}
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options"  />
          </Dropdown>
        </span>
      ),
    },
  ];

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
  };

  console.log({ queryValues, tableProps })

  const pageTitle = t('Organization list');
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
            <Link to={URL_ADD_ORGANIZATION}>
              <Button type="primary">
                <PlusOutlined  />
                {t('Add Organization')}
              </Button>
            </Link>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        <ViewDetailsWrapper resourceId={resourceId} fhirBaseURL={fhirBaseURL} />
      </Row>
    </div>
  );
};
