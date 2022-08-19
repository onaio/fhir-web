# Opensrp server Logout

Exposes a helper function that can be re-used to logout from an opensrp server that uses keycloak for user management.

## Installation

```node
yarn add @opensrp/server-logout
```

### Options

- **payload**
  - `{ headers: HeadersInit; method: HTTPMethod; }`
  - **required**
  - options to add to fetch for instance: the authorization headers
- **opensrpLogoutUri**
  - `string`
  - **required**
  - opensrp server logout uri, this is invoked as a fetch function call
- **keycloakLogoutUri**
  - `string`
  - **required**
  - kecloack server logout uri, this is invoked by redirecting the browser to the url
- **redirectUri**
  - `string`
  - **required**
  - the uri to redirect to after succesfully logging out of keycloak
- **idtoken**
  - `string`
  - **optional**
  - id_token when scope is 'openid', if present then a query string is added to the logout url, which enables keycloak to auto logout user.

#### an example

```typescript
import React from 'react';
import { logout } from '@opensrp/server-logout';

const payload = {
  method: 'GET',
  headers: {
    authorization: 'Bearer <token>',
  },
};
const opensrpLogoutUri = 'https://global.smartregister.org/opensrp/logout.do';
const keycloakLogoutUri = 'https://keycloak.smartregister.org/realm/<realm>/openid-connect/logout';
const redirectUri = 'https://opensrp-web.smartregister.org';

export const logoutComponent = () => {
  logout(payload, opensrpLogoutUri, keycloakLogoutUri, redirectUri).catch(() => {
    /** logout failed*/
  });
  return null;
};
```
