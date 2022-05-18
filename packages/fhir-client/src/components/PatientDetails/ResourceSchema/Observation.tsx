import { IObservation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/IObservation';
import { get } from 'lodash';
import { buildObservationValueString } from '../../PatientsList/utils';
import { dateStringSorterFn } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';

export const parseObservation = (obj: IObservation) => {
  return {
    observationValue: buildObservationValueString(obj),
    status: get(obj, 'status'),
    id: get(obj, 'id'),
    issued: get(obj, 'instant'),
  };
};

export type ObservationTableData = ReturnType<typeof parseObservation>;

export const columns = (t: TFunction) => [
  {
    title: t('Id'),
    dataIndex: 'id' as const,
  },
  {
    title: t('Observation value'),
    dataIndex: 'observationValue' as const,
  },
  {
    title: t('Status'),
    dataIndex: 'status' as const,
  },
  {
    title: t('Observation Issue Date'),
    dataIndex: 'issued' as const,
    sorter: dateStringSorterFn,
  },
];
