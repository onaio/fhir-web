import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { get } from 'lodash';
import { getCodeableConcepts, rawStringSorterFn } from '../../../helpers/utils';
import type { TFunction } from '@opensrp/i18n';

export const parseLocation = (obj: ILocation) => {
  return {
    name: get(obj, 'name'),
    alias: get(obj, 'alias'),
    id: get(obj, 'id'),
    type: getCodeableConcepts(get(obj, 'type')),
    city: get(obj, 'address.city'),
    country: get(obj, 'address.country'),
    state: get(obj, 'address.state'),
  };
};

export type LocationTableData = ReturnType<typeof parseLocation>;

export const columns = (t: TFunction) => [
  {
    title: t('Name'),
    dataIndex: 'name',
    editable: true,
    sorter: rawStringSorterFn,
  },
  {
    title: t('City'),
    dataIndex: 'city',
  },
  {
    title: t('State'),
    dataIndex: 'state',
  },
  {
    title: t('Country'),
    dataIndex: 'country',
  },
];
