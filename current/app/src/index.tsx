import './configs/dispatchConfig'; // this needs to be imported before anything else
import React from 'react';
import ReactDOM from 'react-dom';
import { history } from '@onaio/connected-reducer-registry';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import './index.css';
import App from './App/App';
import { SENTRY_CONFIGS } from './configs/env';
import * as serviceWorker from './serviceWorker';
import { store } from '@opensrp/store';
import { ErrorBoundaryFallback } from '@opensrp/error-boundary-fallback';
import { URL_HOME } from './constants';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { OpensrpWebI18nProvider } from '@opensrp/i18n';
import '@opensrp/react-utils/dist/components/CommonStyles/index.css';

// tslint:disable-next-line: ordered-imports
import './styles/css/index.css';
// tslint:disable-next-line: ordered-imports
const queryClient = new QueryClient();

if (process.env.NODE_ENV === 'production') {
  const { tags, ...sentryConfigs } = SENTRY_CONFIGS;
  Sentry.init(sentryConfigs);
  if (tags) {
    Sentry.configureScope((scope) => {
      Object.entries(tags as Record<string, string>).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    });
  }
}

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={() => <ErrorBoundaryFallback homeUrl={URL_HOME} />}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <QueryClientProvider client={queryClient}>
          <OpensrpWebI18nProvider>
            <App />
          </OpensrpWebI18nProvider>
        </QueryClientProvider>
      </ConnectedRouter>
    </Provider>
  </Sentry.ErrorBoundary>,
  document.getElementById('opensrp-root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
