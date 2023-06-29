/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, PageHeader, Button, Divider, Dropdown, Menu, Popconfirm } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import {
  FHIRServiceClass,
  useTabularViewWithLocalSearch,
  BrokenPage,
  SearchForm,
  TableLayout,
  useSearchParams,
  viewDetailsQuery,
} from '@opensrp/react-utils';
import {
  FHIR_CARE_TEAM,
  URL_EDIT_CARE_TEAM,
  URL_CREATE_CARE_TEAM,
  careTeamResourceType,
} from '../../constants';
import { ViewDetails } from '../ViewDetails';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
import { useTranslation } from '../../mls';
import type { TFunction } from '@opensrp/i18n';
import { ICareTeam } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ICareTeam';

// route params for care team pages
interface RouteParams {
  careTeamId: string | undefined;
}

interface Props {
  fhirBaseURL: string;
  careTeamPageSize: number;
}

export type CareTeamListPropTypes = Props & RouteComponentProps<RouteParams>;

export const deleteCareTeam = async (
  fhirBaseURL: string,
  id: string,
  t: TFunction
): Promise<void> => {
  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM);
  return serve
    .delete(id)
    .then(() => sendSuccessNotification(t('Successfully Deleted Care Team')))
    .catch(() => sendErrorNotification(t('An error occurred')));
};

/**
 * Function which shows the list of all roles and their details
 *
 * @param {Object} props - UserRolesList component props
 * @returns {Function} returns User Roles list display
 */
export const CareTeamList: React.FC<CareTeamListPropTypes> = (props: CareTeamListPropTypes) => {
  const { fhirBaseURL } = props;
  const { t } = useTranslation();

  const { addParam, sParams } = useSearchParams();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;

  const {
    queryValues: { data, isFetching, isLoading, error, refetch },
    tablePaginationProps,
    searchFormProps,
  } = useTabularViewWithLocalSearch<ICareTeam>(fhirBaseURL, careTeamResourceType);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data ?? []).map((datum: Dictionary) => {
    return {
      key: datum.id,
      id: datum.id,
      name: datum.name,
    };
  });
  type TableData = typeof tableData[0];

  const columns = [
    {
      title: t('Name'),
      dataIndex: 'name' as const,
      editable: true,
    },
    {
      title: t('Actions'),
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${URL_EDIT_CARE_TEAM}/${record.id.toString()}`}>
            <Button type="link" className="m-0 p-1">
              {t('Edit')}
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item key="delete">
                  <Popconfirm
                    title={t('Are you sure you want to delete this Care Team?')}
                    okText={t('Yes')}
                    cancelText={t('No')}
                    onConfirm={async () => {
                      await deleteCareTeam(fhirBaseURL, record.id, t);
                      await refetch();
                    }}
                  >
                    <Button danger type="link" style={{ color: '#' }}>
                      {t('Delete')}
                    </Button>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item key="view-details" className="view-details">
                  <Button type="link" onClick={() => addParam(viewDetailsQuery, record.id)}>
                    View Details
                  </Button>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" data-testid="action-dropdown" />
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
        <title>{t('FHIR Care Team')}</title>
      </Helmet>
      <PageHeader title={t('FHIR Care Team')} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={URL_CREATE_CARE_TEAM}>
              <Button type="primary">
                <PlusOutlined />
                {t('Create Care Team')}
              </Button>
            </Link>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        {resourceId && <ViewDetails careTeamId={resourceId} fhirBaseURL={fhirBaseURL} />}
      </Row>
    </div>
  );
};
