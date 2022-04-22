import React from 'react';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { dateStringSorterFn, rawStringSorterFn } from '../../../helpers/utils';
import { getPatientName } from '../../PatientsList/utils';
import { LIST_PATIENTS_URL } from '../../../constants';
import { Tag, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Column } from '@opensrp/react-utils';

const { Text } = Typography;

export const parsePatient = (patient: IPatient) => {
  const { id, birthDate, gender, deceasedBoolean, active } = patient;
  return {
    id: id,
    name: getPatientName(patient) ?? id,
    dob: birthDate,
    gender: gender,
    deceased: deceasedBoolean,
    active,
  };
};

export type PatientTableData = ReturnType<typeof parsePatient>;

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name' as const,
    key: 'name' as const,
    sorter: rawStringSorterFn,
    render: (name: string, record: PatientTableData) => {
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
    sorter: dateStringSorterFn,
  },
  {
    title: 'Active',
    dataIndex: 'active' as const,
    key: 'active' as const,
    render: (value: boolean) => <Text>{value === true ? 'Active' : 'Inactive'}</Text>,
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
    render: (record: PatientTableData) => (
      <span className="d-flex justify-content-start align-items-center">
        <Link to={`${LIST_PATIENTS_URL}/${record.id}`}>
          <Button type="link" className="m-0 p-1">
            View
          </Button>
        </Link>
      </span>
    ),
  },
] as Column<PatientTableData>;
