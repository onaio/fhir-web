import './configs/dispatchConfig'; // this needs to be imported before anything else
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SENTRY_CONFIGS } from './configs/env';
import { URL_HOME } from './constants.ts';
import { history } from '@onaio/connected-reducer-registry';
import { ConnectedRouter } from 'connected-react-router';
import { store } from '@opensrp/store';
import { ErrorBoundaryFallback } from '@opensrp/error-boundary-fallback';
import * as Sentry from '@sentry/react';
import { OpensrpWebI18nProvider } from '@opensrp/i18n';
import '@opensrp/react-utils/dist/components/CommonStyles/index.css';
import { RbacProvider } from '@opensrp/rbac';


const queryClient = new QueryClient();

if (import.meta.env.PROD) {
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
  <Sentry.ErrorBoundary fallback={() => <ErrorBoundaryFallback homeUrl={URL_HOME} />}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <QueryClientProvider client={queryClient}>
          <OpensrpWebI18nProvider>
            <RbacProvider>
              <React.StrictMode>
                <App />
              </React.StrictMode>
            </RbacProvider>
          </OpensrpWebI18nProvider>
        </QueryClientProvider>
      </ConnectedRouter>
    </Provider>
  </Sentry.ErrorBoundary>

);
