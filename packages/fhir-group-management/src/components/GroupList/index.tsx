import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button, Divider, Dropdown, Menu } from 'antd';
import { parseGroup, ViewDetailsWrapper } from '../GroupDetail';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Group } from '../../types';
import { groupResourceType, LIST_GROUP_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { SearchForm, BrokenPage, TableLayout, useSimpleTabularView } from '@opensrp/react-utils';
import { IGroup } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IGroup';
import { useTranslation } from '../../mls';

interface GroupListProps {
  fhirBaseURL: string;
}

interface RouteParams {
  id?: string;
}

/**
 * Shows the list of all group and there details
 *
 * @param  props - GroupList component props
 * @returns returns healthcare display
 */
export const GroupList = (props: GroupListProps) => {
  const { fhirBaseURL } = props;

  const { id: resourceId } = useParams<RouteParams>();
  const { t } = useTranslation();

  const { searchFormProps, tablePaginationProps, queryValues } = useSimpleTabularView<Group>(
    fhirBaseURL,
    groupResourceType
  );
  const { data, isFetching, isLoading, error } = queryValues;

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data?.records ?? []).map((org: IGroup, index: number) => {
    return {
      ...parseGroup(org),
      key: `${index}`,
    };
  });
  type TableData = typeof tableData[0];

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      key: 'name' as const,
    },
    {
      title: t('Active'),
      dataIndex: 'active' as const,
      key: 'active' as const,
      render: (value: boolean) => <div>{value ? 'Yes' : 'No'}</div>,
    },
    {
      title: t('Last Updated'),
      dataIndex: 'lastUpdated' as const,
      key: 'lastUpdated' as const,
      render: (value: string) => t('{{val,datetime}}', { val: new Date(value) }),
    },
    {
      title: t('Actions'),
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`#`}>
            <Button disabled type="link" className="m-0 p-1">
              {t('Edit')}
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item key="view-details" className="view-details">
                  <Link to={`${LIST_GROUP_URL}/${record.id}`}>{t('View Details')}</Link>
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

  const pageTitle = t('Groups list');
  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} disabled />
            <Link to="#">
              <Button disabled type="primary">
                <PlusOutlined />
                {t('Create Group')}
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
