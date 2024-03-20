/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Divider, Dropdown, Popconfirm } from 'antd';
import type { MenuProps } from 'antd';
import { PageHeader } from '@opensrp/react-utils';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { useHistory, Link } from 'react-router-dom';
import {
  FHIRServiceClass,
  useSimpleTabularView,
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
import { RbacCheck, useUserRole } from '@opensrp/rbac';

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
    .catch(() => sendErrorNotification(t('There was a problem deleting the Care Team')));
};

const getSearchParams = (search: string | null) => {
  if (search) {
    return { [`name:contains`]: search };
  }
  return {};
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
  const history = useHistory();

  const { addParam, sParams } = useSearchParams();
  const userRole = useUserRole();
  const resourceId = sParams.get(viewDetailsQuery) ?? undefined;

  const {
    queryValues: { data, isFetching, isLoading, error, refetch },
    tablePaginationProps,
    searchFormProps,
  } = useSimpleTabularView<ICareTeam>(fhirBaseURL, careTeamResourceType, getSearchParams);

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = (data?.records ?? []).map((datum: Dictionary) => {
    return {
      key: datum.id,
      id: datum.id,
      name: datum.name,
    };
  });
  type TableData = typeof tableData[0];

  const getItems = (record: TableData): MenuProps['items'] => {
    return [
      {
        key: '1',
        permissions: ['CareTeam.delete'],
        label: (
          <Popconfirm
            title={t('Are you sure you want to delete this Care Team?')}
            okText={t('Yes')}
            className="delCareteam"
            cancelText={t('No')}
            onConfirm={async () => {
              await deleteCareTeam(fhirBaseURL, record.id, t);
              await refetch();
            }}
          >
            <Button danger data-testid="deleteBtn" type="link" style={{ color: '#' }}>
              {t('Delete')}
            </Button>
          </Popconfirm>
        ),
      },
      {
        key: '2',
        permissions: [],
        label: (
          <Button type="link" onClick={() => addParam(viewDetailsQuery, record.id)}>
            View Details
          </Button>
        ),
      },
    ]
      .filter((item) => userRole.hasPermissions(item.permissions))
      .map((item) => {
        const { permissions, ...rest } = item;
        return rest;
      });
  };

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
          <RbacCheck permissions={['CareTeam.update']}>
            <>
              <Link to={`${URL_EDIT_CARE_TEAM}/${record.id.toString()}`} className="m-0 p-1">
                {t('Edit')}
              </Link>
              <Divider type="vertical" />
            </>
          </RbacCheck>
          <Dropdown
            menu={{ items: getItems(record) }}
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
      <PageHeader title={t('FHIR Care Team')} />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <RbacCheck permissions={['CareTeam.create']}>
              <Link to={URL_CREATE_CARE_TEAM}>
                <Button type="primary" onClick={() => history.push(URL_CREATE_CARE_TEAM)}>
                  <PlusOutlined />
                  {t('Create Care Team')}
                </Button>
              </Link>
            </RbacCheck>
          </div>
          <TableLayout {...tableProps} />
        </Col>
        {resourceId && <ViewDetails careTeamId={resourceId} fhirBaseURL={fhirBaseURL} />}
      </Row>
    </div>
  );
};
