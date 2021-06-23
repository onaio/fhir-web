/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Helmet } from 'react-helmet';
import {
  Row,
  Col,
  Table,
  Spin,
  PageHeader,
  Button,
  Divider,
  Dropdown,
  Menu,
  Popconfirm,
} from 'antd';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import FHIR from 'fhirclient';
import { IfhirR4 } from '@smile-cdr/fhirts';
import { useQuery } from 'react-query';
import { createChangeHandler, getQueryParams, SearchForm, BrokenPage } from '@opensrp/react-utils';
import lang from '../../lang';
import {
  SEARCH_QUERY_PARAM,
  FHIR_CARE_TEAM,
  URL_EDIT_CARE_TEAM,
  URL_CARE_TEAM,
  ROUTE_PARAM_CARE_TEAM_ID,
  URL_CREATE_CARE_TEAM,
} from '../../constants';
import { ViewDetails } from '../ViewDetails';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';

// route params for user group pages
interface RouteParams {
  careTeamId: string | undefined;
}

interface TableData {
  key: number | string;
  id: string;
  name: string;
}

interface Props {
  fhirBaseURL: string;
}

export interface PaginationProps {
  currentPage: number;
  pageSize: number | undefined;
}

/** default component props */
const defaultProps = {
  fhirBaseURL: '',
};

export type CareTeamListPropTypes = Props & RouteComponentProps<RouteParams>;

/** Function which shows the list of all roles and their details
 *
 * @param {Object} props - UserRolesList component props
 * @returns {Function} returns User Roles list display
 */

export const fetcCareTeams = async (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number,
  searchParam: string | undefined,
  setPayloadCount: (count: number) => void
): Promise<IfhirR4.IBundle> => {
  return await FHIR.client(fhirBaseURL)
    .request(`${FHIR_CARE_TEAM}/_search?_count=${pageSize}&_getpagesoffset=${pageOffset}`)
    .then((res: IfhirR4.IBundle) => {
      setPayloadCount(res.total as number);
      return res;
    });
};

export const deleteCareTeam = async (fhirBaseURL: string, id: string): Promise<void> => {
  return await FHIR.client(fhirBaseURL)
    .delete(`${FHIR_CARE_TEAM}/${id}`)
    .then(() => sendSuccessNotification(lang.CARE_TEAM_DELETE_SUCCESS))
    .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
};

export const useCareTeamsHook = (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number,
  searchParam: string,
  setPayloadCount: (count: number) => void
) => {
  return useQuery(
    FHIR_CARE_TEAM,
    () => fetcCareTeams(fhirBaseURL, pageSize, pageOffset, searchParam, setPayloadCount),
    {
      refetchOnWindowFocus: false,
    }
  );
};
export const CareTeamList: React.FC<CareTeamListPropTypes> = (props: CareTeamListPropTypes) => {
  const { fhirBaseURL } = props;
  const history = useHistory();
  const careTeamId = props.match.params[ROUTE_PARAM_CARE_TEAM_ID] ?? '';

  const [payloadCount, setPayloadCount] = React.useState<number>(0);
  const [pageProps, setPageProps] = React.useState<PaginationProps>({
    currentPage: 1,
    pageSize: 20,
  });
  const { currentPage, pageSize } = pageProps;
  const pageOffset = (currentPage - 1) * (pageSize ?? 20);
  const searchParam = getQueryParams(props.location)[SEARCH_QUERY_PARAM];

  const { data, isLoading, isFetching, error, refetch } = useCareTeamsHook(
    fhirBaseURL,
    pageSize as number,
    pageOffset,
    searchParam as string,
    setPayloadCount
  );

  if (isLoading || isFetching) return <Spin size="large" />;

  if (error) {
    return <BrokenPage errorMessage={`${error}`} />;
  }

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)[SEARCH_QUERY_PARAM],
    onChangeHandler: createChangeHandler(SEARCH_QUERY_PARAM, props),
  };

  const tableData = data?.entry?.map((datum: Dictionary, index: number) => {
    return {
      key: `${index}`,
      id: datum.resource.id,
      name: datum.resource.name,
    };
  });

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
                    title="Are you sure you want to delete this user?"
                    okText="Yes"
                    cancelText="No"
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
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultPageSize: pageSize ?? 20,
              onChange: (page: number, pageSize: number | undefined) => {
                setPageProps({
                  currentPage: page,
                  pageSize: pageSize,
                });
              },
              current: currentPage,
              total: payloadCount,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
        <ViewDetails careTeamId={careTeamId} fhirBaseURL={fhirBaseURL} />
      </Row>
    </div>
  );
};

CareTeamList.defaultProps = defaultProps;

export default CareTeamList;
