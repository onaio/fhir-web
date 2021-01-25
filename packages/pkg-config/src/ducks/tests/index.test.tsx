import reducerRegistry from '@onaio/redux-reducer-registry';
import { store } from '@opensrp/store';
import { FlushThunks } from 'redux-testkit';
import { configsReducer, addConfigs, getConfigsFactory, configsSliceName } from '../';

const configSelector = getConfigsFactory();

reducerRegistry.register(configsSliceName, configsReducer);

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

  it('dux module is used without registration', () => {
    // mock reducer de-registration;
    const mockStore = {};
    expect(configSelector(mockStore)).toEqual({});
  });
});
