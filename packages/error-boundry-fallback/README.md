# Errorboundary Fallback

This package provides a fallback component which you can use as an error boundry fallback.

## Installation

```node
yarn add @opensrp/error-boundry-fallback
```

#### Code example

```javascript
import * as Sentry from '@sentry/react';
import App from '..';
import Fallback from '@opensrp/error-boundry-fallback';

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={Fallback}>
    <App />
  </Sentry.ErrorBoundary>,
  document.getElementById('root')
);
```
