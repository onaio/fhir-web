import reducerRegistry, { store } from '@onaio/redux-reducer-registry';
import { values } from 'lodash';
import {
  reducerFactory,
  fetchActionCreatorFactory,
  getItemByIdFactory,
  getItemsArrayFactory,
  getItemsByIdFactory,
  removeActionCreatorFactory,
  setTotalRecordsFactory,
  getTotalRecordsFactory,
} from '..';
import ANCReducer, {
  reducerName as ANCReducerName,
  fetchANC,
  getANCById,
  getAllANCArray,
  getAllANCById,
  removeANCAction,
  setTotalANCRecords,
  getTotalANCRecords,
  client1,
  client2,
  ANCClient1,
  ANCClient2,
  ANCClientType,
} from './fixtures';

const customReducerName = 'opensrp-web/client-type/base';

const baseReducer = reducerFactory<ANCClientType>(customReducerName);

reducerRegistry.register(customReducerName, baseReducer);
reducerRegistry.register(ANCReducerName, ANCReducer);

const getBaseClientsById = getItemsByIdFactory<ANCClientType>(customReducerName);
const getBaseClientById = getItemByIdFactory<ANCClientType>(customReducerName);
const getBaseClientsArray = getItemsArrayFactory<ANCClientType>(customReducerName);
const fetchBaseClients = fetchActionCreatorFactory<ANCClientType>(
  customReducerName,
  'baseEntityId'
);
const removeBaseClientsAction = removeActionCreatorFactory(customReducerName);
const setBaseTotalRecords = setTotalRecordsFactory(customReducerName);
const getBaseTotalRecords = getTotalRecordsFactory(customReducerName);

describe('reducers/clients', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    store.dispatch(removeBaseClientsAction());
    store.dispatch(removeANCAction());
  });

  it('selectors work for empty initialState', () => {
    expect(getBaseClientsById(store.getState())).toEqual({});
    expect(getBaseClientsArray(store.getState())).toEqual([]);
    expect(getBaseClientById(store.getState(), 'some-id')).toBeNull();
    expect(getANCById(store.getState(), 'some-id')).toBeNull();
    expect(getAllANCArray(store.getState())).toEqual([]);
    expect(getAllANCById(store.getState())).toEqual({});
  });

  it('fetches clients correctly', () => {
    store.dispatch(fetchBaseClients([client1, client2] as ANCClientType[]));
    store.dispatch(fetchANC([ANCClient1, ANCClient2]));
    expect(getBaseClientsById(store.getState())).toEqual({
      '71ad460c-bf76-414e-9be1-0d1b2cb1bce8': client1,
      '7d97182f-d623-4553-8651-5a29d2fe3f0b': client2,
    });
    expect(getBaseClientsArray(store.getState())).toEqual(values([client1, client2]));
    expect(getBaseClientById(store.getState(), '71ad460c-bf76-414e-9be1-0d1b2cb1bce8')).toEqual(
      client1
    );
    expect(getAllANCById(store.getState())).toEqual({
      'f1a3e6ee-58d2-4d5c-9588-5e2658abe21c': ANCClient1,
      '564fce60-29c8-4a9d-b99b-6a74411a1457': ANCClient2,
    });
    expect(getAllANCArray(store.getState())).toEqual(values([ANCClient1, ANCClient2]));
    expect(getANCById(store.getState(), 'f1a3e6ee-58d2-4d5c-9588-5e2658abe21c')).toEqual(
      ANCClient1
    );
  });

  it('removes clients correctly', () => {
    store.dispatch(fetchBaseClients([client1, client2] as ANCClientType[]));
    let numberOfClients = getBaseClientsArray(store.getState()).length;
    expect(numberOfClients).toEqual(2);
    store.dispatch(fetchANC([ANCClient1, ANCClient2]));
    let numberOfANC = getAllANCArray(store.getState()).length;
    expect(numberOfANC).toEqual(2);

    store.dispatch(removeBaseClientsAction());
    numberOfClients = getBaseClientsArray(store.getState()).length;
    expect(numberOfClients).toEqual(0);

    store.dispatch(removeANCAction());
    numberOfANC = getAllANCArray(store.getState()).length;
    expect(numberOfANC).toEqual(0);
  });

  it('dispatches clients correctly on non-empty state', () => {
    store.dispatch(removeBaseClientsAction());
    store.dispatch(fetchBaseClients([client1] as ANCClientType[]));
    let numberOfClients = getBaseClientsArray(store.getState()).length;
    expect(numberOfClients).toEqual(1);

    store.dispatch(fetchBaseClients([client2] as ANCClientType[]));
    numberOfClients = getBaseClientsArray(store.getState()).length;
    expect(numberOfClients).toEqual(2);

    store.dispatch(fetchANC([ANCClient1]));
    let numberOfANC = getAllANCArray(store.getState()).length;
    expect(numberOfANC).toEqual(1);

    store.dispatch(fetchANC([ANCClient2]));
    numberOfANC = getAllANCArray(store.getState()).length;
    expect(numberOfANC).toEqual(2);
  });

  it('should not save the same object twice', () => {
    store.dispatch(removeBaseClientsAction());
    store.dispatch(fetchBaseClients([client1] as ANCClientType[]));
    let numberOfClients = getBaseClientsArray(store.getState()).length;
    expect(numberOfClients).toEqual(1);

    store.dispatch(fetchBaseClients([client1] as ANCClientType[]));
    numberOfClients = getBaseClientsArray(store.getState()).length;
    expect(numberOfClients).toEqual(1);
  });

  it('sets total records correctly', () => {
    store.dispatch(setBaseTotalRecords(5));
    expect(getBaseTotalRecords(store.getState())).toEqual(5);
    store.dispatch(setBaseTotalRecords(10));
    expect(getBaseTotalRecords(store.getState())).toEqual(10);
    expect(getTotalANCRecords(store.getState())).toEqual(0);

    store.dispatch(setTotalANCRecords(4));
    expect(getBaseTotalRecords(store.getState())).toEqual(10);
    expect(getTotalANCRecords(store.getState())).toEqual(4);

    store.dispatch(setTotalANCRecords(9));
    expect(getTotalANCRecords(store.getState())).toEqual(9);
  });
});
