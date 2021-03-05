import './dispatchConfig'; // this needs to be imported before anything else
import React from 'react';
import ReactDOM from 'react-dom';
import { history } from '@onaio/connected-reducer-registry';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import './index.css';
import App from './App/App';
import { SENTRY_DSN } from './configs/env';
import * as serviceWorker from './serviceWorker';
import { store } from '@opensrp/store';
import { ErrorBoundaryFallback } from '@opensrp/error-boundary-fallback';
import { URL_HOME } from './constants';
import * as Sentry from '@sentry/react';
// import { configStore } from '@opensrp/pkg-config';
// import { ConfigProvider } from 'antd';
// import frFR from 'antd/lib/locale/fr_FR';
// import { Dictionary } from '@onaio/utils';
// import { Locale } from 'antd/lib/locale-provider';
import './styles/css/index.css';

// const languageCode: any = configStore.getConfig('LANGUAGE_CODE');

// const antdLocalesLookup: Dictionary<Locale> = {
//   fr: frFR,
// };

// const currentAntdLocale = antdLocalesLookup[languageCode];

if (SENTRY_DSN) {
  Sentry.init({ dsn: SENTRY_DSN });
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Sentry.ErrorBoundary fallback={() => <ErrorBoundaryFallback homeUrl={URL_HOME} />}>
        {/* <ConfigProvider locale={currentAntdLocale}> */}
        <App />
        {/* </ConfigProvider> */}
      </Sentry.ErrorBoundary>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('opensrp-root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
