/* eslint-disable @typescript-eslint/naming-convention */

import {
  fetchActionCreatorFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  reducerFactory,
  getItemsByIdFactory,
  getItemsArrayFactory,
  getItemByIdFactory,
  getTotalRecordsFactory,
} from '..';

/** describes an ANC client object */
export interface ANCClientType {
  type: 'Client';
  dateCreated: string | number;
  serverVersion: number;
  clientApplicationVersion: number;
  clientDatabaseVersion: number;
  baseEntityId: string;
  identifiers: { [key: string]: string | null };
}

/** reducer name for the ANC module */
export const reducerName = 'opensrp-web/client-type/ANC';

/** ANC Reducer */
const reducer = reducerFactory<ANCClientType>(reducerName);

// action
/** actionCreator returns action to to add anc records to store */
export const fetchANC = fetchActionCreatorFactory<ANCClientType>(reducerName, 'baseEntityId');
export const removeANCAction = removeActionCreatorFactory(reducerName);
export const setTotalANCRecords = setTotalRecordsFactory(reducerName);

// selectors
export const getAllANCById = getItemsByIdFactory<ANCClientType>(reducerName);
export const getANCById = getItemByIdFactory<ANCClientType>(reducerName);
export const getAllANCArray = getItemsArrayFactory<ANCClientType>(reducerName);
export const getTotalANCRecords = getTotalRecordsFactory(reducerName);

export default reducer;

export const ANCClient1: ANCClientType = {
  baseEntityId: 'f1a3e6ee-58d2-4d5c-9588-5e2658abe21c',
  identifiers: {
    opensrp_id: '1029340',
  },
  dateCreated: '2019-11-27T14:13:52.524+06:00',
  serverVersion: 1574842432522,
  clientApplicationVersion: 9,
  clientDatabaseVersion: 12,
  type: 'Client',
};
export const ANCClient2: ANCClientType = {
  baseEntityId: '564fce60-29c8-4a9d-b99b-6a74411a1457',
  identifiers: {
    opensrp_id: '1008206',
  },
  dateCreated: '2019-11-17T12:21:06.552+06:00',
  serverVersion: 1573971666532,
  clientApplicationVersion: 9,
  clientDatabaseVersion: 12,
  type: 'Client',
};

export const client1: ANCClientType = {
  type: 'Client',
  dateCreated: 1557670951023,
  serverVersion: 1557670950986,
  clientApplicationVersion: 2,
  clientDatabaseVersion: 2,
  baseEntityId: '71ad460c-bf76-414e-9be1-0d1b2cb1bce8',
  identifiers: {
    opensrp_id: '11096120_family',
  },
};

export const client2: ANCClientType = {
  type: 'Client',
  dateCreated: 1557670951165,
  serverVersion: 1557670950999,
  clientApplicationVersion: 2,
  clientDatabaseVersion: 2,
  baseEntityId: '7d97182f-d623-4553-8651-5a29d2fe3f0b',
  identifiers: {
    opensrp_id: '11096120',
  },
};
