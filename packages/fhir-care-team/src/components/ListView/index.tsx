/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Table, PageHeader, Button, Divider, Dropdown, Menu, Popconfirm } from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps, useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {
  FHIRServiceClass,
  useSimpleTabularView,
  BrokenPage,
  SearchForm,
} from '@opensrp/react-utils';
import lang from '../../lang';
import {
  FHIR_CARE_TEAM,
  URL_EDIT_CARE_TEAM,
  URL_CARE_TEAM,
  URL_CREATE_CARE_TEAM,
  careTeamResourceType,
} from '../../constants';
import { ViewDetails } from '../ViewDetails';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';
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

export const deleteCareTeam = async (fhirBaseURL: string, id: string): Promise<void> => {
  const serve = new FHIRServiceClass(fhirBaseURL, FHIR_CARE_TEAM);
  return serve
    .delete(id)
    .then(() => sendSuccessNotification(lang.CARE_TEAM_DELETE_SUCCESS))
    .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
};

/**
 * Function which shows the list of all roles and their details
 *
 * @param {Object} props - UserRolesList component props
 * @returns {Function} returns User Roles list display
 */
export const CareTeamList: React.FC<CareTeamListPropTypes> = (props: CareTeamListPropTypes) => {
  const { fhirBaseURL } = props;

  const { careTeamId: resourceId } = useParams<RouteParams>();
  const { searchFormProps, tablePaginationProps, queryValues } = useSimpleTabularView<ICareTeam>(
    fhirBaseURL,
    careTeamResourceType
  );
  const history = useHistory();

  const { data, isFetching, isLoading, error, refetch } = queryValues;

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  const tableData = data?.records.map((datum: Dictionary, index: number) => {
    return {
      key: `${index}`,
      id: datum.resource.id,
      name: datum.resource.name,
    };
  });
  type TableData = typeof tableData[0];

  const columns = [
    {
      title: lang.NAME,
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
    },
    {
      title: 'Actions',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${URL_EDIT_CARE_TEAM}/${record.id.toString()}`}>
            <Button type="link" className="m-0 p-1">
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item>
                  <Popconfirm
                    title={lang.CONFIRM_DELETE}
                    okText={lang.YES}
                    cancelText={lang.NO}
                    onConfirm={async () => {
                      await deleteCareTeam(fhirBaseURL, record.id);
                      await refetch();
                    }}
                  >
                    <Button danger type="link" style={{ color: '#' }}>
                      Delete
                    </Button>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item
                  className="viewdetails"
                  onClick={() => {
                    history.push(`${URL_CARE_TEAM}/${record.id}`);
                  }}
                >
                  View Details
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" />
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
        <title>{lang.CARE_TEAM_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={lang.CARE_TEAM_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={URL_CREATE_CARE_TEAM}>
              <Button type="primary">
                <PlusOutlined />
                {lang.CREATE_CARE_TEAM}
              </Button>
            </Link>
          </div>
          <Table {...tableProps} />
        </Col>
        resourceId && <ViewDetails careTeamId={resourceId as string} fhirBaseURL={fhirBaseURL} />
      </Row>
    </div>
  );
};
