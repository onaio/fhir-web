# Errorboundary Fallback

This package provides a fallback component which you can use as an error boundary fallback.

## Installation

```node
yarn add @opensrp/error-boundary-fallback
```

## Usage

`error-boundary-fallback` makes use of the following options

- **dsn:**(string)

  - **optional**
  - dsn uri for sentry.

- **homeUrl:**(string)
  - **required**
  - URL to redirect after clicking on back to home button

#### Code example

```javascript
import App from '..';
import { ErrorBoundary } from '@opensrp/error-boundary-fallback';

ReactDOM.render(
  <ErrorBoundary dsn={'https://something@something.org/12345'} homeUrl={'/home'}>
    <App />
  </ErrorBoundary>,
  document.getElementById('root')
);
```
