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
  FHIR_PRACTITIONER_ROLE,
  URL_EDIT_PRACTITIONER_ROLE,
  URL_PRACTITIONER_ROLE,
  URL_CREATE_PRACTITIONER_ROLE,
  ROUTE_PARAM_PRACTITIONER_ROLE_ID,
} from '../../constants';
import { ViewDetails } from '../ViewDetails';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';

// route params for user group pages
interface RouteParams {
  practitionerRoleId: string | undefined;
}

interface TableData {
  key: number | string;
  id: string;
  name?: string;
}

interface Props {
  fhirBaseURL: string;
  PractitionerRolePageSize: number;
}

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
}

/** default component props */
const defaultProps = {
  fhirBaseURL: '',
  PractitionerRolePageSize: 5,
};

export type PractitionerRoleListPropTypes = Props & RouteComponentProps<RouteParams>;

export const fetchPractitionerRoles = async (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number,
  setPayloadCount: (count: number) => void
): Promise<IfhirR4.IBundle> => {
  return await FHIR.client(fhirBaseURL)
    .request(`${FHIR_PRACTITIONER_ROLE}/_search?_count=${pageSize}&_getpagesoffset=${pageOffset}`)
    .then((res: IfhirR4.IBundle) => {
      setPayloadCount(res.total as number);
      return res;
    });
};

export const deletePractitionerRole = async (fhirBaseURL: string, id: string): Promise<void> => {
  return await FHIR.client(fhirBaseURL)
    .delete(`${FHIR_PRACTITIONER_ROLE}/${id}`)
    .then(() => sendSuccessNotification(lang.CARE_TEAM_DELETE_SUCCESS))
    .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
};

export const usePractitionerRolesHook = (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number,
  setPayloadCount: (count: number) => void
) => {
  return useQuery(
    FHIR_PRACTITIONER_ROLE,
    () => fetchPractitionerRoles(fhirBaseURL, pageSize, pageOffset, setPayloadCount),
    {
      refetchOnWindowFocus: false,
    }
  );
};

/** Function which shows the list of all roles and their details
 *
 * @param {Object} props - UserRolesList component props
 * @returns {Function} returns User Roles list display
 */
export const PractitionerRoleList: React.FC<PractitionerRoleListPropTypes> = (
  props: PractitionerRoleListPropTypes
) => {
  const { fhirBaseURL, PractitionerRolePageSize } = props;
  const history = useHistory();
  const PractitionerRoleId = props.match.params[ROUTE_PARAM_PRACTITIONER_ROLE_ID] ?? '';

  const [payloadCount, setPayloadCount] = React.useState<number>(0);
  const [pageProps, setPageProps] = React.useState<PaginationProps>({
    currentPage: 1,
    pageSize: PractitionerRolePageSize,
  });
  const { currentPage, pageSize } = pageProps;
  const pageOffset = (currentPage - 1) * pageSize;
  const { data, isLoading, isFetching, error, refetch } = usePractitionerRolesHook(
    fhirBaseURL,
    pageSize as number,
    pageOffset,
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
    };
  });

  const columns = [
    {
      title: lang.NAME,
      dataIndex: 'id',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.id.localeCompare(b.id),
    },
    {
      title: 'Actions',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${URL_EDIT_PRACTITIONER_ROLE}/${record.id.toString()}`}>
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
                      await deletePractitionerRole(fhirBaseURL, record.id);
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
                    history.push(`${URL_PRACTITIONER_ROLE}/${record.id}`);
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
            <Link to={URL_CREATE_PRACTITIONER_ROLE}>
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
              defaultPageSize: pageSize,
              onChange: async (page: number, pageSize: number | undefined) => {
                setPageProps({
                  currentPage: page,
                  pageSize: pageSize ?? PractitionerRolePageSize,
                });
              },
              current: currentPage,
              total: payloadCount,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
        {/* <ViewDetails PractitionerRoleId={PractitionerRoleId} fhirBaseURL={fhirBaseURL} /> */}
      </Row>
    </div>
  );
};

PractitionerRoleList.defaultProps = defaultProps;

export default PractitionerRoleList;
