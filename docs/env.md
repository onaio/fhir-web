# Environment Variables

This document describes the environment variables in this code base and how to use them correctly to manuplate different sections.

Below is a list of currently supported environment variables:

1. **REACT_APP_KEYCLOAK_LOGOUT_URL**

- url to logout from the keycloak server
- **Required**
- default: `https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout`

2. **REACT_APP_DOMAIN_NAME**

- Defines the domain name of the app
- **Required**
- default: `http://localhost:3000`

3. **REACT_APP_OPENSRP_ACCESS_TOKEN_URL**

- Defines the backend URL for fetching the oauth2 access token
- **Required**
- default: `https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/token`

4. **REACT_APP_OPENSRP_AUTHORIZATION_URL**

- Defines the oauth2 auth URL
- **Required**
- default: `https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/auth`

5. **REACT_APP_REACT_APP_OPENSRP_OAUTH_STATE**

- Defines the app oauth2 state to use
- **Required**
- default: `opensrp`

6. **REACT_APP_OPENSRP_CLIENT_ID**

- Defines the oauth2 client id the app should use
- **Required**

7. **REACT_APP_ENABLE_OPENSRP_OAUTH**

- Enable or disable OpenSRP as the oauth2 provider
- **Required**
- default: `true`

8. **REACT_APP_DISABLE_LOGIN_PROTECTION**

- Enable or disable login protection for different app pages
- **Required**
- default: `false`

9. **REACT_APP_EXPRESS_OAUTH_LOGOUT_URL**

- URL to logout of the express server
- **Required**
- default: `https://web.opensrp-stage.smartregister.org/logout`

10. **REACT_APP_EXPRESS_OAUTH_GET_STATE_URL**

- Enable or disable OpenSRP as the oauth2 provider
- **Required**
- default: `https://web.opensrp-stage.smartregister.org/oauth/state`
