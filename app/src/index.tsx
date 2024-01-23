import './configs/dispatchConfig'; // this needs to be imported before anything else
import React, { Suspense } from 'react';
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
import { RbacProvider } from '@opensrp/rbac';
import ReactDOM from 'react-dom/client'

// tslint:disable-next-line: ordered-imports
import './styles/css/index.css';
import { Spin } from 'antd';
// tslint:disable-next-line: ordered-imports
const queryClient = new QueryClient();

if (import.meta.env.DEV) {
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Suspense fallback={() => <Spin className="custom-spinner" />}>
    <Sentry.ErrorBoundary fallback={() => <ErrorBoundaryFallback homeUrl={URL_HOME} />}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <QueryClientProvider client={queryClient}>
            <OpensrpWebI18nProvider>
              <RbacProvider>
                <App />
              </RbacProvider>
            </OpensrpWebI18nProvider>
          </QueryClientProvider>
        </ConnectedRouter>
      </Provider>
    </Sentry.ErrorBoundary>
  </Suspense>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
