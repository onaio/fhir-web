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
  <Sentry.ErrorBoundary fallback={ErrorBoundary}>
    <App />
  </Sentry.ErrorBoundary>,
  document.getElementById('root')
);
```
