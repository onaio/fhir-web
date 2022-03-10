/**
 * Just shows a table that lists organizations, allows users to filter and
 * search organizations, and links to create/edit organization views.
 */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button, Divider, Dropdown, Menu } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { SearchForm, BrokenPage, TableLayout, useSimpleTabularView } from '@opensrp/react-utils';
import {
  ADD_EDIT_ORGANIZATION_URL,
  ORGANIZATION_LIST_URL,
  organizationResourceType,
} from '../../../constants';
import { parseOrganization, ViewDetailsWrapper } from '../ViewDetails';
import { IOrganization } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IOrganization';

export type TRQuery = [string, number, number];

interface OrganizationListProps {
  fhirBaseURL: string;
}

interface RouteParams {
  id?: string;
}

/**
 * Renders organization in a table
 *
 * @param props -  component props
 */
export const OrganizationList = (props: OrganizationListProps) => {
  const { fhirBaseURL } = props;

  const { id: resourceId } = useParams<RouteParams>();
  const { searchFormProps, tablePaginationProps, queryValues } =
    useSimpleTabularView<IOrganization>(fhirBaseURL, organizationResourceType);
  const { data, isFetching, isLoading, error } = queryValues;

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  if (error && !data) {
    return <BrokenPage errorMessage={'Problem loading data'} />;
  }

  const tableData = (data?.records ?? []).map((org: IOrganization, index: number) => {
    return {
      ...parseOrganization(org),
      key: `${index}`,
    };
  });

  type TableData = typeof tableData[0];

  const columns = [
    {
      title: 'Team name',
      dataIndex: 'name' as const,
    },
    {
      title: 'Type',
      dataIndex: 'type' as const,
    },
    {
      title: 'Actions',
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${ADD_EDIT_ORGANIZATION_URL}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item className="view-details">
                  <Link to={`${ORGANIZATION_LIST_URL}/${record.id}`}>View Details</Link>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" />
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

  return (
    <div className="content-section">
      <Helmet>
        <title>Organization list</title>
      </Helmet>
      <PageHeader title={'Organization list'} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} />
            <Link to={ADD_EDIT_ORGANIZATION_URL}>
              <Button type="primary">
                <PlusOutlined />
                Add Organization
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
