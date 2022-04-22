import { IPractitioner } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IPractitioner';
import { get } from 'lodash';
import { rawStringSorterFn } from '../../../helpers/utils';
import { parseFhirHumanName } from '@opensrp/react-utils';

export const parsePractitioner = (obj: IPractitioner) => {
  return {
    name: parseFhirHumanName(get(obj, 'name.0')),
    gender: get(obj, 'gender'),
    active: get(obj, 'active'),
  };
};

export type CarePlanTableData = ReturnType<typeof parsePractitioner>;

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: rawStringSorterFn,
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
  },
  {
    title: 'Status',
    dataIndex: 'active',
    render: (value: boolean) => (value === true ? 'Active' : 'Inacitve'),
  },
];
