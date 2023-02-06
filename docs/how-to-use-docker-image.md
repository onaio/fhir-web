# OpenSRP Web

[OpenSRP Web](https://github.com/opensrp/web) is the default frontend for [OpenSRP Server](https://hub.docker.com/r/opensrp/opensrp-server-web); providing access to the data collected on the server, configuration options as well as any functionality provided by the API server.

## What is OpenSRP?

OpenSRP is an open-source, mobile-first platform, built to enable data-driven decision making at all levels of the health system.

## How to use the image?

### Prerequisites

For OpenSRP web to work, you need a running OpenSRP server instance.

OpenSRP web is configured as follows:

1. [config.js.tpl](https://github.com/opensrp/web/blob/master/app/public/config.js) - A docker volume that holds all react app configurations.

   - sample format (update `< >` with your configurations)

   ```js
   window._env_ = {
     // keycloak
     REACT_APP_KEYCLOAK_API_BASE_URL: '<keycloak-domain>/auth/admin/realms/<keycloak-realm>',
     REACT_APP_KEYCLOAK_LOGOUT_URL:
       '<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/logout',
     REACT_APP_OPENSRP_ACCESS_TOKEN_URL:
       '<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/token',
     REACT_APP_OPENSRP_AUTHORIZATION_URL:
       '<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/auth',
     REACT_APP_OPENSRP_CLIENT_ID: '<keycloak-client-id>',
     REACT_APP_OPENSRP_USER_URL:
       '<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/userinfo',

     // OpenSRP web
     REACT_APP_WEBSITE_NAME: '<website-name>',
     REACT_APP_OPENSRP_WEB_VERSION: '<opensrp-web-tag>',
     REACT_APP_DOMAIN_NAME: '<opensrp-web-domain>',
     REACT_APP_EXPRESS_OAUTH_GET_STATE_URL: '<opensrp-web-domain>/oauth/state',
     REACT_APP_EXPRESS_OAUTH_LOGOUT_URL: '<opensrp-web-domain>/logout',

     // OpenSRP server
     REACT_APP_OPENSRP_API_BASE_URL: '<opensrp-server-domain>/opensrp/rest/',
     REACT_APP_OPENSRP_API_V2_BASE_URL: '<opensrp-server-domain>/opensrp/rest/v2/',
     REACT_APP_OPENSRP_LOGOUT_URL: '<opensrp-server-domain>/opensrp/logout.do',

     // UUID's
     REACT_APP_DEFAULT_PLAN_ID: '<default-opensrp-plan-uuid>',
     REACT_APP_ACTION_UUID_NAMESPACE: '<randomly-generated-uuid>',
     REACT_APP_PLAN_UUID_NAMESPACE: '<randomly-generated-uuid>',

     // toggle OpenSRP web modules
     REACT_APP_ENABLE_CARD_SUPPORT: 'false',
     REACT_APP_ENABLE_INVENTORY: 'false',
     REACT_APP_ENABLE_LOCATIONS: 'false',
     REACT_APP_ENABLE_PLANS: 'false',
     REACT_APP_ENABLE_PRODUCT_CATALOGUE: 'false',
     REACT_APP_ENABLE_REPORTS: 'false',
     REACT_APP_ENABLE_SERVER_SETTINGS: 'false',
     REACT_APP_ENABLE_TEAMS: 'false',
     REACT_APP_ENABLE_TEAMS_ASSIGNMENT_MODULE: 'false',
     REACT_APP_ENABLE_USER_MANAGEMENT: 'false',
     REACT_APP_ENABLE_FORM_CONFIGURATION: 'false',

     // optional overrides
     SKIP_PREFLIGHT_CHECK: 'true',
     GENERATE_SOURCEMAP: 'false',
     INLINE_RUNTIME_CHUNK: 'false',
     IMAGE_INLINE_SIZE_LIMIT: '0',
     REACT_APP_MAIN_LOGO_SRC:
       'https://github.com/opensrp/web/raw/master/app/src/assets/images/opensrp-logo-color-40.png',
     REACT_APP_OPENSRP_OAUTH_SCOPES: 'openid,profile',
     REACT_APP_ENABLE_OPENSRP_OAUTH: 'true',
     REACT_APP_BACKEND_ACTIVE: 'true',
     REACT_APP_SUPPORTED_LANGUAGES: 'en',
     REACT_APP_PROJECT_CODE: 'demo',
     REACT_APP_DEFAULTS_TABLE_PAGE_SIZE: '10',
     REACT_APP_OPENSRP_ROLES:
       '{"USERS":"ROLE_EDIT_KEYCLOAK_USERS","PLANS":"ROLE_VIEW_KEYCLOAK_USERS","LOCATIONS":"ROLE_VIEW_KEYCLOAK_USERS","CARD_SUPPORT":"ROLE_VIEW_KEYCLOAK_USERS","INVENTORY":"ROLE_VIEW_KEYCLOAK_USERS","TEAMS":"ROLE_VIEW_KEYCLOAK_USERS","PRODUCT_CATALOGUE":"ROLE_VIEW_KEYCLOAK_USERS","FORM_CONFIGURATION":"ROLE_VIEW_KEYCLOAK_USERS","CARE_TEAM":"ROLE_VIEW_KEYCLOAK_USERS","SERVER_SETTINGS":"ROLE_VIEW_KEYCLOAK_USERS","MANAGE_REPORTS":"ROLE_MANAGE_REPORTS","DISTRICT_REPORT":"ROLE_DISTRICT_REPORT","HEALTHCARE_SERVICE":"ROLE_VIEW_KEYCLOAK_USERS","GROUP":"ROLE_VIEW_KEYCLOAK_USERS"}',

     // optional sentry config
     // REACT_APP_SENTRY_CONFIG_JSON: "{\"dsn\":\"<sentry-dsn>\",\"environment\":\"<sentry-environment>\",\"release\":\"<app-release-version>\",\"release-name\":\"<app-release-name>\",\"release-namespace\":\"<app-release-namespace>\",\"tags\":{}}",
   };
   ```

   additional settings can be found [here](https://github.com/opensrp/web/blob/master/app/.env.sample).

2. Container Environment Variables - Express app configurations. Additional configs can be found [here](https://github.com/onaio/express-server/blob/master/.env.sample)

Now using the image.

- OpenSRP web tags correspond to [OpenSRP web releases here](https://github.com/opensrp/web/releases). It's advised to use the latest official release

#### docker-compose.yml

```yaml
version: '3.9'
services:
  opensrp-web:
    image: opensrp/web:<opensrp-web-tag>
    ports:
      - '3000:3000'
    volumes:
      # volume with React environment variables
      - ./config.js.tpl:/etc/confd/templates/config.js.tmpl
    environment:
      # optional overrides
      - 'NODE_ENV=production' # 'NODE_ENV=development' if opensrp-web-domain === http://localhost:3000
      - 'EXPRESS_ALLOW_TOKEN_RENEWAL=true'
      - 'EXPRESS_REACT_BUILD_PATH=/usr/src/web'

      # keycloak
      - 'EXPRESS_OPENSRP_CLIENT_ID=<keycloak-client-id>'
      - 'EXPRESS_OPENSRP_CLIENT_SECRET=<keycloak-client-secret>'
      - 'EXPRESS_OPENSRP_ACCESS_TOKEN_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/token'
      - 'EXPRESS_OPENSRP_AUTHORIZATION_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/auth'
      - 'EXPRESS_KEYCLOAK_LOGOUT_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/logout'
      - 'EXPRESS_OPENSRP_USER_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/userinfo'

      # OpenSRP server
      - 'EXPRESS_OPENSRP_LOGOUT_URL=<opensrp-server-domain>/opensrp/logout.do'

      # OpenSRP web
      - 'EXPRESS_OPENSRP_CALLBACK_URL=<opensrp-web-domain>/oauth/callback/OpenSRP/'
      - 'EXPRESS_FRONTEND_OPENSRP_CALLBACK_URL=<opensrp-web-domain>/fe/oauth/callback/opensrp'
      - 'EXPRESS_SERVER_LOGOUT_URL=<opensrp-web-domain>/logout'

      # UUID's
      - 'EXPRESS_SESSION_SECRET=<randomly-generated-string>'

      # content security policy configuration
      # remove optional-sentry-domain config block if your deployment has no sentry
      - 'EXPRESS_CONTENT_SECURITY_POLICY_CONFIG={"connect-src":["''self''","<optional-sentry-domain>","<keycloak-domain>","<opensrp-server-domain>"],"default-src":["''self''"],"img-src":["''self''","https://github.com/opensrp/","https://*.githubusercontent.com/opensrp/"]}'

      # optional sentry config
      # - 'EXPRESS_RESPONSE_HEADERS={"report-to":", {endpoints:[{url:https://<optional-sentry-domain>/api/<optional-sentry-projectId>/security/?sentry_key=<optional-sentry-key>\\u0026sentry_environment=<optional-sentry-environment>\\u0026sentry_release=<optional-sentry-release-name>}],group:csp-endpoint,max_age:10886400}"}'

      # optional redis and redis sentinel session store config (use either or neither not both)
      # - 'EXPRESS_REDIS_STAND_ALONE_URL=redis://username:password@redis-domain:port/db'
      # - 'EXPRESS_REDIS_SENTINEL_CONFIG={"name":"sentinelMasterName","sentinelPassword":"sentinelMasterPassword","sentinels":[{"host":"sentinel-node-1-domain","port":"12345"},{"host":"sentinel-node-2-domain","port":"12345"},{"host":"sentinel-node-3-domain","port":"12345"}]}'
```

And to run it

```bash
docker-compose up
```
