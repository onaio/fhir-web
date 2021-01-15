import reducerRegistry from '@onaio/redux-reducer-registry';
import { configsSliceName, addConfigs, configsReducer } from '@opensrp/pkg-config';
import { store } from '@opensrp/store';

/** register catalogue reducer */
reducerRegistry.register(configsSliceName, configsReducer);

store.dispatch(addConfigs({ languageCode: 'sw', projectLanguageCode: 'eusm' }));

console.log('*****************STATE', store.getState());
