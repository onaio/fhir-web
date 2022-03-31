/* eslint-disable react/display-name */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Button, PageHeader, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { TableLayout } from '@opensrp/react-utils';
import { BrokenPage, SearchForm } from '@opensrp/react-utils';
import { PlusOutlined } from '@ant-design/icons';
import { getPatientName, useSortParams } from './utils';
import { useSimpleTabularView } from '@opensrp/react-utils';
import { IPatient, Patient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { patientResourceType } from '../../constants';
import { SortOrder } from 'antd/lib/table/interface';

interface TableData {
  key?: string;
  id?: string;
  name?: string;
  dob?: string;
  gender?: Patient.GenderEnum;
  deceased?: boolean;
}

interface PatientListProps {
  fhirBaseURL: string;
}

/**
 * Component which shows the list of all patients in FHIR server
 *
 * @param {Object} props - UserGoupsList component props
 * @returns {Function} returns patients list display
 */
export const PatientsList = (props: PatientListProps) => {
  const { fhirBaseURL } = props;
  const { filters, toggleSort, isAscending, isDescending } = useSortParams();

  const { searchFormProps, tablePaginationProps, queryValues } = useSimpleTabularView<IPatient>(
    fhirBaseURL,
    patientResourceType,
    filters
  );
  const { data, isFetching, isLoading, error } = queryValues;

  if (error && !data) {
    return <BrokenPage errorMessage={(error as Error).message} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const tableData: TableData[] = (data?.records ?? []).map((patient: IPatient) => {
    const { id, birthDate, gender, deceasedBoolean } = patient;
    return {
      key: id as string,
      id: id,
      name: getPatientName(patient),
      dob: birthDate,
      gender: gender,
      deceased: deceasedBoolean,
    };
  });
  const sortKeyDirection = (key: string): SortOrder =>
    isAscending(key) ? 'ascend' : isDescending(key) ? 'descend' : null;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name' as const,
      key: 'name' as const,
      sorter: () => {
        toggleSort('name');
        return 0;
      },
      sortDirections: [sortKeyDirection('name')],
      render: (name: string, record: TableData) => {
        return (
          <>
            <span>
              {name} {record.deceased ? <Tag color="red">Deceased</Tag> : null}
            </span>
          </>
        );
      },
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dob' as const,
      key: 'dob' as const,
      sorter: () => {
        toggleSort('date');
        return 0;
      },
      sortDirections: [sortKeyDirection('date')],
    },
    {
      title: 'Gender',
      dataIndex: 'gender' as const,
      key: 'gender' as const,
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

  const tableProps = {
    datasource: tableData,
    columns,
    loading: isFetching || isLoading,
    pagination: tablePaginationProps,
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
          <TableLayout {...tableProps} />
        </Col>
      </Row>
    </div>
  );
};
