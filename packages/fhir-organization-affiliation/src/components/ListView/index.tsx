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
  FHIR_ORG_AFFILIATION,
  URL_EDIT_ORG_AFFILIATION,
  URL_ORG_AFFILIATION,
  URL_CREATE_ORG_AFFILIATION,
  ROUTE_PARAM_ORG_AFFILIATION_ID,
} from '../../constants';
import { ViewDetails } from '../ViewDetails';
import { Dictionary } from '@onaio/utils';
import { sendErrorNotification, sendSuccessNotification } from '@opensrp/notifications';

// route params for user group pages
interface RouteParams {
  orgAffiliationId: string | undefined;
}

interface TableData {
  key: number | string;
  id: string;
  active?: boolean;
  orgName: string;
  locationName: string;
}

interface Props {
  fhirBaseURL: string;
  OrgAffiliationPageSize: number;
}

export interface PaginationProps {
  currentPage: number;
  pageSize: number;
}

/** default component props */
const defaultProps = {
  fhirBaseURL: '',
  OrgAffiliationPageSize: 5,
};

export type OrgAffiliationListPropTypes = Props & RouteComponentProps<RouteParams>;

export const fetchOrgAffiliations = async (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number,
  setPayloadCount: (count: number) => void
): Promise<IfhirR4.IBundle> => {
  return await FHIR.client(fhirBaseURL)
    .request(`${FHIR_ORG_AFFILIATION}/_search?_count=${pageSize}&_getpagesoffset=${pageOffset}`)
    .then((res: IfhirR4.IBundle) => {
      setPayloadCount(res.total as number);
      return res;
    });
};

export const deleteOrgAffiliation = async (fhirBaseURL: string, id: string): Promise<void> => {
  return await FHIR.client(fhirBaseURL)
    .delete(`${FHIR_ORG_AFFILIATION}/${id}`)
    .then(() => sendSuccessNotification(lang.ORG_AFFILIATION_DELETE_SUCCESS))
    .catch(() => sendErrorNotification(lang.ERROR_OCCURRED));
};

export const useOrgAffiliationHook = (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number,
  setPayloadCount: (count: number) => void
) => {
  return useQuery([FHIR_ORG_AFFILIATION, pageOffset], () =>
    fetchOrgAffiliations(fhirBaseURL, pageSize, pageOffset, setPayloadCount)
  );
};

/** Function which shows the list of all assignments and their details
 *
 * @param {Object} props - OrgAffiliationList component props
 * @returns {Function} returns Org affiliation list display
 */
export const OrgAffiliationList: React.FC<OrgAffiliationListPropTypes> = (
  props: OrgAffiliationListPropTypes
) => {
  const { fhirBaseURL, OrgAffiliationPageSize } = props;
  const history = useHistory();
  const PractitionerRoleId = props.match.params[ROUTE_PARAM_ORG_AFFILIATION_ID] ?? '';

  const [payloadCount, setPayloadCount] = React.useState<number>(0);
  const [paginationProps, setPaginationProps] = React.useState<PaginationProps>({
    currentPage: 1,
    pageSize: OrgAffiliationPageSize,
  });
  const { currentPage, pageSize } = paginationProps;
  const pageOffset = (currentPage - 1) * pageSize;
  const { data, isLoading, error, refetch } = useOrgAffiliationHook(
    fhirBaseURL,
    pageSize as number,
    pageOffset,
    setPayloadCount
  );

  if (isLoading) return <Spin size="large" />;

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
      status: datum.resource.active.toString(),
      orgName: datum.resource.organization?.display,
      locationName: datum.resource.location?.display,
    };
  });

  const columns = [
    {
      title: lang.LOCATION_NAME,
      dataIndex: 'locationName',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.locationName.localeCompare(b.locationName),
    },
    {
      title: lang.ORGANIZATION_NAME,
      dataIndex: 'orgName',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.orgName.localeCompare(b.orgName),
    },
    {
      title: lang.STATUS,
      dataIndex: 'status',
      editable: true,
    },
    {
      title: 'Actions',
      width: '10%',

      // eslint-disable-next-line react/display-name
      render: (_: unknown, record: TableData) => (
        <span className="d-flex align-items-center">
          <Link to={`${URL_EDIT_ORG_AFFILIATION}/${record.id.toString()}`}>
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
                      await deleteOrgAffiliation(fhirBaseURL, record.id);
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
                    history.push(`${URL_ORG_AFFILIATION}/${record.id}`);
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
        <title>{lang.ORG_AFFILIATION_PAGE_HEADER}</title>
      </Helmet>
      <PageHeader title={lang.ORG_AFFILIATION_PAGE_HEADER} className="page-header" />
      <Row className="list-view">
        <Col className="main-content">
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to={URL_CREATE_ORG_AFFILIATION}>
              <Button type="primary">
                <PlusOutlined />
                {lang.CREATE_ORG_AFFILIATION}
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
              onChange: (page: number, pageSize: number | undefined) => {
                setPaginationProps({
                  currentPage: page,
                  pageSize: pageSize ?? OrgAffiliationPageSize,
                });
              },
              current: currentPage,
              total: payloadCount,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
        {/* <ViewDetails practitionerRoleId={PractitionerRoleId} fhirBaseURL={fhirBaseURL} /> */}
      </Row>
    </div>
  );
};

OrgAffiliationList.defaultProps = defaultProps;

export default OrgAffiliationList;
