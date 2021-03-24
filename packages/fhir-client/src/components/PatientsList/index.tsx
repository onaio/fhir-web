/* eslint-disable react/display-name */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, Table, Spin, Divider, Dropdown, Menu, PageHeader, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { RouteComponentProps, useHistory, withRouter } from 'react-router';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import FHIR from 'fhirclient';
import { BrokenPage, createChangeHandler, getQueryParams, SearchForm } from '@opensrp/react-utils';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons';
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
  keycloakBaseURL: string;
}

export type PatientsListTypes = Props & RouteComponentProps<RouteParams>;

/** default component props */
const defaultProps: Partial<PatientsListTypes> = {
  keycloakBaseURL: '',
};

/** Component which shows the list of all patients in FHIR server
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns patients list display
 */
const PatientsListComponent: React.FC<PatientsListTypes> = (props: PatientsListTypes) => {
  const history = useHistory();

  const { data, isLoading, error } = useQuery<fhirclient.FHIR.Bundle, Error>(
    'fetchPatients',
    async () => {
      return await FHIR.client('https://r4.smarthealthit.org')
        .request({
          url: 'Patient',
        })
        .then((res: fhirclient.FHIR.Bundle) => {
          return res;
        });
    }
  );

  if (isLoading) return <Spin size="large" />;

  if (error) {
    return <BrokenPage errorMessage={`${error}`} />;
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
              Edit
            </Button>
          </Link>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu className="menu">
                <Menu.Item
                  className="viewdetails"
                  onClick={() => {
                    history.push(`${'/admin/patients'}/${record.id}`);
                  }}
                >
                  {'View details'}
                </Menu.Item>
              </Menu>
            }
            placement="bottomLeft"
            arrow
            trigger={['click']}
          >
            <MoreOutlined className="more-options" />
          </Dropdown>
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
            <Link to={'/admin/patients/new'}>
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
 * @returns {React.FC} - returns patients list view
 */
export function PatientsList() {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientsComponent keycloakBaseURL="" />
    </QueryClientProvider>
  );
}
