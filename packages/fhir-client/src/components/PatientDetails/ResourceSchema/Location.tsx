import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { get } from 'lodash';
import { getCodeableConcepts, sorterFn } from '../../../helpers/utils';

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

export const nameSorterFn = sorterFn('name');

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: true,
    sorter: nameSorterFn,
  },
  {
    title: 'City',
    dataIndex: 'city',
  },
  {
    title: 'State',
    dataIndex: 'state',
  },
  {
    title: 'Country',
    dataIndex: 'country',
  },
];
