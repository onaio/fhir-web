# Keycloak API Service

The keycloak api service module allows for making HTTP requests to the keycloak api from the app. It supports the below methods

- **create** - post a data object to an api.
- **read** - get a single data object using its unique id
- **update** - Modify an entity on the api
- **list** - get many entities from specified entry point
- **delete** - make a `DELETE` request to the api

## Installation

```node
yarn add @opensrp/keycloak-service
```

## Usage

`KeycloakService` makes use of the following options

- **accessToken**(string)

  - **required**
  - oauth2 token to be used when making requests to the keycloak endpoints

- **endpoint:**(string)
  - **required**
  - the endpoint.
- **baseURL:**(string)
  - **required**
  - uri of the api
- **getOptions:**(Function)

  - optional
  - A function thats given the signal and method to use. Used to add custom options that you might want to pass on tho the fetch request

- **signal:**(AbortSignal)
  - optional
  - optionally used to cancel pending requests.

### Errors

Keycloak service module exposes 2 additional error classes:

#### HTTPError

This is thrown when the statusCode is not within the allowed success range for any respective operation.

The fetch.response.text() value from the api is attached to the error as the value of `description`.

Also attaches the following fields from the response to the thrown error object: - statusCode - statusText - url

#### NetworkError

This is thrown when the fetch error cannot go through due to a failed internet connection.

### Code example

```typescript
import { KeycloakService } from '@opensrp/keycloak-service';

const loadClients = async () => {
  const clientService = new KeycloakService(accessToken, keycloakEndpoint, keycloakBaseURL);
  return await clientService.list();
};
```
