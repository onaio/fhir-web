import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import { FlushThunks } from 'redux-testkit';
import { reducer, addConfigs, getConfigsFactory, sliceName } from '../';

const configSelector = getConfigsFactory();

reducerRegistry.register(sliceName, reducer);

describe('reducers/pkg-configs', () => {
  beforeEach(() => {
    FlushThunks.createMiddleware();
    jest.resetAllMocks();
  });

  it('should have initial state', () => {
    expect(configSelector(store.getState())).toEqual({});
  });

  it('stores and gets configuration correctly', () => {
    // action creators dispatch
    const sampleConfig = {
      languageCode: 'en',
    };
    store.dispatch(addConfigs(sampleConfig));
    expect(configSelector(store.getState())).toEqual(sampleConfig);
  });
});
