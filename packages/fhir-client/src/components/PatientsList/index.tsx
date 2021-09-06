/* eslint-disable react/display-name */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Table, Spin, PageHeader, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import FHIR from 'fhirclient';
import { handleSessionOrTokenExpiry } from '@opensrp/react-utils';
import { BrokenPage, createChangeHandler, getQueryParams, SearchForm } from '@opensrp/react-utils';
import { PlusOutlined } from '@ant-design/icons';
import { getPatientName } from './utils';
import { fhirclient } from 'fhirclient/lib/types';

const queryClient = new QueryClient();

// route params for patients
interface RouteParams {
  patientId: string | undefined;
}

interface TableData {
  key: number | string;
  id: string | undefined;
  name: string;
  dob: string;
  gender: string;
  deceased: string | boolean;
}

interface Props {
  fhirBaseURL: string;
  sortFields: string[];
}

export interface PaginationProps {
  currentPage: number;
  pageSize: number | undefined;
}

export type PatientsListTypes = Props & RouteComponentProps<RouteParams>;

/** default component props */
const defaultProps: Partial<PatientsListTypes> = {
  fhirBaseURL: '',
};

export const fetchPatients = async (
  fhirBaseURL: string,
  pageSize: number,
  pageOffset: number,
  searchParam: string | undefined,
  sortFields: string[] | undefined,
  setUsersCountCallback: (count: number) => void
) => {
  const token = await handleSessionOrTokenExpiry();
  return await FHIR.client(fhirBaseURL)
    .request({
      url: `Patient/_search?_count=${pageSize}${
        sortFields ? '&_sort=' + sortFields.join() : ''
      }&_getpagesoffset=${pageOffset}${searchParam ? '&name=' + searchParam : ''}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res: fhirclient.FHIR.Bundle) => {
      setUsersCountCallback(res.total as number);
      return res;
    });
};

/** Component which shows the list of all patients in FHIR server
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns patients list display
 */
const PatientsListComponent: React.FC<PatientsListTypes> = (props: PatientsListTypes) => {
  const { fhirBaseURL, sortFields } = props;
  const [usersCount, setUsersCount] = React.useState<number>(0);
  const [pageProps, setPageProps] = React.useState<PaginationProps>({
    currentPage: 1,
    pageSize: 20,
  });
  const { currentPage, pageSize } = pageProps;
  const pageOffset = (currentPage - 1) * (pageSize ?? 20);
  const searchParam = getQueryParams(props.location)['querySearch'];
  const { data, error, isFetching, refetch } = useQuery<fhirclient.FHIR.Bundle, Error>(
    'fetchPatients',
    () =>
      fetchPatients(
        fhirBaseURL,
        pageSize as number,
        pageOffset,
        searchParam as string,
        sortFields,
        setUsersCount
      ),
    { refetchOnWindowFocus: false }
  );

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pageProps), searchParam]);

  if (isFetching) return <Spin size="large" />;

  if (error) {
    return <BrokenPage errorMessage={'An error occured'} />;
  }

  const tableData: TableData[] | undefined =
    data &&
    data.entry?.map((datum: fhirclient.FHIR.BundleEntry, index: number) => {
      return {
        key: `${index}`,
        id: datum.resource.id,
        name: getPatientName(datum.resource),
        dob: datum.resource.birthDate,
        gender: datum.resource.gender,
        deceased: datum.resource.deceasedBoolean || datum.resource.deceasedDateTime,
      };
    });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.name.localeCompare(b.name),
      render: (name: string, record: TableData) => {
        return (
          <>
            {' '}
            <span>
              {name} {record.deceased ? <Tag color="red">Deceased</Tag> : null}
            </span>{' '}
          </>
        );
      },
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dob',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.dob.localeCompare(b.name),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      editable: true,
      sorter: (a: TableData, b: TableData) => a.gender.localeCompare(b.name),
    },
    {
      title: 'Actions',
      width: '20%',

      // eslint-disable-next-line react/display-name
      render: (record: TableData) => (
        <span className="d-flex justify-content-start align-items-center">
          <Link to={`${'/admin/patients'}/${record.id}`}>
            <Button type="link" className="m-0 p-1">
              View
            </Button>
          </Link>
        </span>
      ),
    },
  ];

  const searchFormProps = {
    defaultValue: getQueryParams(props.location)['querySearch'],
    onChangeHandler: createChangeHandler('querySearch', props),
  };

  return (
    <div className="content-section">
      <Helmet>
        <title>{'Patients'}</title>
      </Helmet>
      <PageHeader title={'Patients'} className="page-header" />
      <Row className="list-view">
        <Col className={'main-content'} span={24}>
          <div className="main-content__header">
            <SearchForm {...searchFormProps} />
            <Link to="#">
              <Button type="primary">
                <PlusOutlined />
                {'Add patient'}
              </Button>
            </Link>
          </div>
          <Table
            dataSource={tableData}
            columns={columns}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultPageSize: 20,
              onChange: (page: number, pageSize: number | undefined) => {
                setPageProps({
                  currentPage: page,
                  pageSize: pageSize,
                });
              },
              current: currentPage,
              total: usersCount,
              pageSizeOptions: ['5', '10', '20', '50', '100'],
            }}
          />
        </Col>
        {/* <ViewDetails keycloakBaseURL={keycloakBaseURL} groupId={groupId} /> */}
      </Row>
    </div>
  );
};

PatientsListComponent.defaultProps = defaultProps;

const PatientsComponent = withRouter(PatientsListComponent);

/** Wrap component in QueryClientProvider
 *
 * @param props - component props
 * @returns {React.FC} - returns patients list view
 */
export function PatientsList(props: PatientsListTypes) {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientsComponent {...props} />
    </QueryClientProvider>
  );
}
