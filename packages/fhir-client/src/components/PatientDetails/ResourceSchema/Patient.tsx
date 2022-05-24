import React from 'react';
import { IPatient } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPatient';
import { sorterFn } from '../../../helpers/utils';
import { getPatientName } from '../../PatientsList/utils';
import { LIST_PATIENTS_URL } from '../../../constants';
import { Tag, Button, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { Column } from '@opensrp/react-utils';

const { Text } = Typography;

const id = 'id' as const;
const name = 'name' as const;
const dob = 'dob' as const;
const gender = 'gender' as const;
const deceased = 'deceased' as const;
const active = 'active' as const;

export const parsePatient = (patient: IPatient) => {
  const { birthDate, deceasedBoolean } = patient;
  return {
    [id]: patient.id,
    [name]: getPatientName(patient) ?? id,
    [dob]: birthDate,
    [gender]: patient.gender,
    [deceased]: deceasedBoolean,
    [active]: patient.active,
  };
};

export type PatientTableData = ReturnType<typeof parsePatient>;

const dobSorterFn = sorterFn(dob, true);

export const columns = [
  {
    title: 'Name',
    dataIndex: name,
    key: name,
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
    dataIndex: dob,
    key: dob,
    sorter: dobSorterFn,
  },
  {
    title: 'Active',
    dataIndex: active,
    key: active,
    render: (value: boolean) => <Text>{value === true ? 'Active' : 'Inactive'}</Text>,
  },
  {
    title: 'Gender',
    dataIndex: gender,
    key: gender,
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

/**
 * maps the column field keys to their corresponding Fhir sortable keys for this resource.
 */
export const sortMap = {
  [id]: 'identifier',
  [name]: 'name',
  [dob]: 'birthdate',
};

/**
 * Columns for this resource(Patients) but where sorting happens on the server side as opposed
 * to locally on the ui.
 */
export const serverSideSortedColumns = () => {
  return columns.map((column: typeof columns[0]) => {
    const newColumn = { ...column };
    if (typeof column.sorter === 'function') {
      newColumn.sorter = true;
    }
    return newColumn;
  });
};
