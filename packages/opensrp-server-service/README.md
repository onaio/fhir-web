# OpenSRP Service

Exposes an api that abstracts making CRUD requests to a server. This module was built for the openSRPService but is
generic enough to be used on most apis. It exposes the below methods.

- **create** - post a data object to an api.
- **read** - get a single data object using its unique id
- **update** - Modify an entity on the api
- **list** - get many entities from specified entry point
- **delete** - make a `DELETE` request to the api

## Installation

```node
yarn add @opensrp-web/server-service
```

## Usage

`OpenSRPService` makes use of the following options

- **accessTokenOrCallBack:**(string | function)
  - **required**
  - an async call back function that returns access token
- **baseURL:**(string)
  - **required**
  - uri of the api
- **endpoint:**(string)
  - **required**
  - the endpoint.
- **signal:**(AbortSignal)
  - optional
  - optionally used to cancel pending requests.
- **getOptions:**(Function)
  - optional
  - A function thats given the signal and method to use. Used to add custom options that you might want to pass on tho the fetch request

### Errors

OpenSRP exposes 2 additional error classes:

#### HTTPError

This is thrown when the statusCode is not within the allowed success range for any respective operation.

The fetch.response.text() value from the api is attached to the error as the value of `description`.

Also attaches the following fields from the response to the thrown error object: - statusCode - statusText - url

#### NetworkError

This is thrown when the fetch error cannot go through due to a failed internet connection.

### Code example

```typescript
import OpenSRPService from '@opensrp-web/server-service';

function getFetchOptions(
  signal: AbortSignal,
  method: HTTPMethod
): { headers: HeadersInit; method: HTTPMethod } {
  return {
    headers: {
      /**... */
    },
    method,
    signal,
  };
}

const loadClients = async () => {
  const clientService = new openSRPService(
    OPENSRP_API_BASE_URL,
    OPENSRP_CLIENT_ENDPOINT,
    getFetchOptions
  );
  return await clientService.list();
};
```
