# Errorboundary Fallback

This package provides a fallback component which you can use as an error boundary fallback.

## Installation

```node
yarn add @opensrp/error-boundary-fallback
```

#### Code example

```javascript
import * as Sentry from '@sentry/react';
import App from '..';
import { ErrorBoundary } from '@opensrp/error-boundary-fallback';

ReactDOM.render(
  <ErrorBoundary dsn={SENTRY_DSN} homeUrl={HOME_URL}>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
```
