import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import reducer, {
  reducerName,
  getClientsById,
  getClientById,
  getClientsArray,
  getTotalClients,
  setTotalClients,
  removeClients,
  fetchClients,
  Client,
} from '../clients';
import { client1, client2 } from './fixtures';

reducerRegistry.register(reducerName, reducer);

describe('src/ducks/clients', () => {
  beforeEach(() => {
    store.dispatch(removeClients());
  });

  it('should have initial state', () => {
    expect(getClientsById(store.getState())).toEqual({});
    expect(getClientById(store.getState(), 'someId')).toEqual(null);
    expect(getClientsArray(store.getState())).toEqual([]);
    expect(getTotalClients(store.getState())).toEqual(0);
  });

  it('sets total records correctly', () => {
    store.dispatch(setTotalClients(5));
    expect(getTotalClients(store.getState())).toEqual(5);
    store.dispatch(setTotalClients(10));
    expect(getTotalClients(store.getState())).toEqual(10);
  });

  it('fetches clients correctly', () => {
    store.dispatch(fetchClients([client1, client2] as Client[]));
    expect(getClientsById(store.getState())).toEqual({
      [client1._id]: client1,
      [client2._id]: client2,
    });
    expect(getClientById(store.getState(), client2._id)).toEqual(client2);
    expect(getClientsArray(store.getState())).toEqual([client1, client2]);
  });

  it('removes clients correctly', () => {
    store.dispatch(fetchClients([client1, client2] as Client[]));
    expect(getClientsArray(store.getState())).toHaveLength(2);

    store.dispatch(removeClients());
    expect(getClientsArray(store.getState())).toHaveLength(0);
  });
});
