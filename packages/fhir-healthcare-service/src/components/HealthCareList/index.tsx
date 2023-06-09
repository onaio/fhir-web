import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Divider, Dropdown, Menu } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { healthCareServiceResourceType, ADD_EDIT_HEALTHCARE_SERVICE_URL } from '../../constants';
import { Link } from 'react-router-dom';
import { IHealthcareService } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IHealthcareService';
import {
  SearchForm,
  BrokenPage,
  TableLayout,
  useSimpleTabularView,
  viewDetailsQuery,
  useSearchParams,
} from '@opensrp/react-utils';
import { parseHealthCare, ViewDetailsWrapper } from '../HealthCareDetail';
import { useTranslation } from '../../mls';

interface HealthCareListProps {
  fhirBaseURL: string;
}

/**
 * Shows the list of all healthcare service
 *
 * @param props -  component props
 * @returns returns healthcare display
 */
export const HealthCareList: React.FC<HealthCareListProps> = (props: HealthCareListProps) => {
  const { fhirBaseURL } = props;

  const { sParams, addParam } = useSearchParams();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;

  const { t } = useTranslation();

  const { searchFormProps, tablePaginationProps, queryValues } =
    useSimpleTabularView<IHealthcareService>(fhirBaseURL, healthCareServiceResourceType);
  const { data, isFetching, isLoading, error } = queryValues;

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data?.records ?? []).map((obj: IHealthcareService, index: number) => {
    return {
      ...parseHealthCare(obj),
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
      title: t('Status'),
      dataIndex: 'active' as const,
      key: 'active' as const,
      render: (value: boolean) => <div>{value ? t('Active') : t('Inactive')}</div>,
    },
    {
      title: t('Last Updated'),
      dataIndex: 'lastUpdated' as const,
      key: 'lastUpdated' as const,
      render: (value: string) => t('{{val, datetime}}', { val: new Date(value) }),
    },
    {
      title: t('Actions'),
      width: '10%',
      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${ADD_EDIT_HEALTHCARE_SERVICE_URL}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              {t('Edit')}
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item key="view-details" className="view-details">
                  <Button onClick={() => addParam(viewDetailsQuery, record.id)} type="link">
                    {t('View Details')}
                  </Button>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined data-testid="action-dropdown" className="more-options" rev={undefined} />
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

  const pageTitle = t('HealthCare service list');

  return (
    <div className="content-section">
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <PageHeader title={pageTitle} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm data-testid="search-form" {...searchFormProps} />
            <Link to={ADD_EDIT_HEALTHCARE_SERVICE_URL}>
              <Button type="primary">
                <PlusOutlined rev={undefined} />
                {t('Create Care Service')}
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
