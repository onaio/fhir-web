import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';
import { get } from 'lodash';
import { buildObservationValueString } from '../../PatientsList/utils';
import { sorterFn } from '../../../helpers/utils';
import { intlFormatDateStrings } from '@opensrp/react-utils';

export const parseObservation = (obj: IObservation) => {
  return {
    observationValue: buildObservationValueString(obj),
    status: get(obj, 'status'),
    id: get(obj, 'id'),
    issued: get(obj, 'issued'),
  };
};

export type ObservationTableData = ReturnType<typeof parseObservation>;

const issuedSorterFn = sorterFn('issued', true);

export const columns = [
  {
    title: 'Id',
    dataIndex: 'id' as const,
  },
  {
    title: 'Observation value',
    dataIndex: 'observationValue' as const,
  },
  {
    title: 'Status',
    dataIndex: 'status' as const,
  },
  {
    title: 'Observation Issue Date',
    dataIndex: 'issued' as const,
    render: (value: string) => intlFormatDateStrings(value),
    sorter: issuedSorterFn,
  },
];
