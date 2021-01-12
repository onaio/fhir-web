# Error Boundary Fallback

This package provides a fallback component which you can use as an error boundary fallback.

## Installation

```node
yarn add @opensrp/error-boundary-fallback
```

## Usage

`error-boundary-fallback` makes use of the following options

- **homeUrl:**(string)
  - **required**
  - URL to redirect after clicking on back to home button

#### Code example

```javascript
import App from '..';
import * as Sentry from '@sentry/react';
import { ErrorBoundaryFallback } from '@opensrp/error-boundary-fallback';

ReactDOM.render(
  <Sentry.ErrorBoundary fallback={() => <ErrorBoundaryFallback homeUrl={'/home'} />}>
    <App />
  </Sentry.ErrorBoundary>,
  document.getElementById('root')
);
```
