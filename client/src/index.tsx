import React from 'react';
import ReactDOM from 'react-dom';
import { history } from '@onaio/connected-reducer-registry';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App/App';
import { SENTRY_DSN } from './configs/env';
import * as serviceWorker from './serviceWorker';
import { store } from '@opensrp/store';
import Fallback from '@opensrp/error-boundary-fallback';

// tslint:disable-next-line: ordered-imports
import './styles/css/index.css';

if (SENTRY_DSN && SENTRY_DSN !== '') {
  Sentry.init({ dsn: SENTRY_DSN });
}

ReactDOM.render(
  <Provider store={store}>
    <Sentry.ErrorBoundary fallback={Fallback}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Sentry.ErrorBoundary>
  </Provider>,
  document.getElementById('opensrp-root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
