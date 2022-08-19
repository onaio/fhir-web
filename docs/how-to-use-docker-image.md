# OpenSRP Web

[OpenSRP Web](https://github.com/opensrp/web) is the default frontend for the OpenSRP Server API, providing access to the data collected on the server, configuration options as well as any functionality provided by the API server.

## What is Opensrp?

OpenSRP is an open-source, mobile-first platform, built to enable data-driven decision making at all levels of the health system.

## How to use the image?

### Prerequisites

For opensrp web to work, you need an [opensrp server instance](https://hub.docker.com/r/opensrp/opensrp-server-web) running:

Opensrp web is configured as follows:

1. [config.js.tpl](https://github.com/opensrp/web/blob/master/app/public/config.js)

   - Holds the all the react configurations.

   sample format

   update `< >` with your configurations

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
     // opensrp server
     REACT_APP_OPENSRP_API_BASE_URL: '<opensrp-server-domain>/opensrp/rest/',
     REACT_APP_OPENSRP_API_V2_BASE_URL: '<opensrp-server-domain>/opensrp/rest/v2/',
     REACT_APP_OPENSRP_LOGOUT_URL: '<opensrp-server-domain>/opensrp/logout.do',
     REACT_APP_OPENSRP_USER_URL: '<opensrp-server-domain>/opensrp/user-details/',
     // opensrp web
     REACT_APP_WEBSITE_NAME: '<website-name>',
     REACT_APP_OPENSRP_WEB_VERSION: '<opensrp-web-tag>',
     REACT_APP_DOMAIN_NAME: '<opensrp-web-domain>',
     REACT_APP_EXPRESS_OAUTH_GET_STATE_URL: '<opensrp-web-domain>/oauth/state',
     REACT_APP_EXPRESS_OAUTH_LOGOUT_URL: '<opensrp-web-domain>/logout',
     REACT_APP_FHIR_API_BASE_URL: '<fhir-server-domain>/fhir',
     // UUID's
     REACT_APP_DEFAULT_PLAN_ID: '<default-opensrp-plan-uuid>',
     REACT_APP_ACTION_UUID_NAMESPACE: '<randomly-generated-uuid>',
     REACT_APP_PLAN_UUID_NAMESPACE: '<randomly-generated-uuid>',
     REACT_APP_FHIR_ROOT_LOCATION_IDENTIFIER: '<randomly-generated-uuid>',
     // toggle opensrp web modules
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
     REACT_APP_ENABLE_FHIR_CARE_TEAM: 'false',
     REACT_APP_ENABLE_FHIR_GROUP: 'false',
     REACT_APP_ENABLE_FHIR_HEALTHCARE_SERVICES: 'false',
     REACT_APP_ENABLE_FHIR_LOCATIONS: 'false',
     REACT_APP_ENABLE_FHIR_PATIENTS: 'false',
     REACT_APP_ENABLE_FHIR_TEAMS: 'false',
     REACT_APP_ENABLE_FHIR_USER_MANAGEMENT: 'false',
     REACT_APP_ENABLE_QUEST: 'false',
     // others (optional override)
     SKIP_PREFLIGHT_CHECK: 'true',
     GENERATE_SOURCEMAP: 'false',
     REACT_APP_MAIN_LOGO_SRC:
       'https://github.com/OpenSRP/web/raw/master/app/src/assets/images/opensrp-logo-color.png',
     REACT_APP_OPENSRP_OAUTH_SCOPES: 'profile',
     REACT_APP_OPENSRP_OAUTH_STATE: 'opensrp',
     REACT_APP_ENABLE_OPENSRP_OAUTH: 'true',
     REACT_APP_BACKEND_ACTIVE: 'true',
     REACT_APP_DISABLE_LOGIN_PROTECTION: 'false',
     REACT_APP_DEFAULT_HOME_MODE: 'default',
     REACT_APP_LANGUAGE_CODE: 'en',
     REACT_APP_SUPPORTED_LANGUAGES: 'en',
     REACT_APP_PROJECT_LANGUAGE_CODE: 'core',
     REACT_APP_ENABLE_LANGUAGE_SWITCHER: 'false',
     REACT_APP_DEFAULT_TIME: 'T00:00:00+00:00',
     REACT_APP_PROJECT_CODE: 'demo',
     REACT_APP_FHIR_PATIENT_SORT_FIELDS: '-_lastUpdated',
     REACT_APP_DISABLE_TEAM_MEMBER_REASSIGNMENT: 'true',
     REACT_APP_FILTER_BY_PARENT_ID: 'true',
     REACT_APP_TASK_GENERATION_STATUS: 'False',
     REACT_APP_DATE_FORMAT: 'yyyy-MM-DD',
     REACT_APP_USER_FORM_HIDDEN: 'contact',
     REACT_APP_USER_FORM_HIDDEN_FIELDS: '',
     REACT_APP_USER_FORM_RENDER_FIELDS: '',
     REACT_APP_KEYCLOAK_USERS_PAGE_SIZE: '20',
     REACT_APP_DEFAULTS_TABLE_PAGE_SIZE: '10',
     REACT_APP_DEFAULT_PLAN_DURATION_DAYS: '20',
     REACT_APP_DEFAULT_ACTIVITY_DURATION_DAYS: '7',
     REACT_APP_DEFAULT_PLAN_VERSION: '1',
     REACT_APP_PAGINATION_SIZE: '1000',
     REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL: '0',
     REACT_APP_FHIR_PATIENT_BUNDLE_SIZE: '1000',
     REACT_APP_OPENSRP_ROLES:
       '{"USERS": "ROLE_EDIT_KEYCLOAK_USERS", "PLANS": "ROLE_VIEW_KEYCLOAK_USERS", "LOCATIONS": "ROLE_VIEW_KEYCLOAK_USERS", "CARD_SUPPORT": "ROLE_VIEW_KEYCLOAK_USERS", "INVENTORY": "ROLE_VIEW_KEYCLOAK_USERS", "TEAMS": "ROLE_VIEW_KEYCLOAK_USERS", "PRODUCT_CATALOGUE": "ROLE_VIEW_KEYCLOAK_USERS", "FORM_CONFIGURATION": "ROLE_VIEW_KEYCLOAK_USERS", "CARE_TEAM": "ROLE_VIEW_KEYCLOAK_USERS", "SERVER_SETTINGS": "ROLE_VIEW_KEYCLOAK_USERS", "QUEST": "ROLE_VIEW_KEYCLOAK_USERS", "MANAGE_REPORTS": "ROLE_MANAGE_REPORTS", "DISTRICT_REPORT": "ROLE_DISTRICT_REPORT"}',
     // optional sentry config
     // REACT_APP_SENTRY_CONFIG_JSON: "{\"dsn\":\"<sentry-dsn>\",\"environment\":\"<sentry-environment>\",\"release\":\"<app-release-version>\",\"release-name\":\"<app-release-name>\",\"release-namespace\":\"<app-release-namespace>\",\"tags\":{}}",
   };
   ```

   additional settings can be found [here](https://github.com/opensrp/web/blob/master/app/.env.sample).

2. Container Environment Variables
   - This will supply the express app configurations. Additional configs can be found [here](https://github.com/onaio/express-server/blob/master/.env.sample)

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
      # keycloak
      - 'EXPRESS_OPENSRP_CLIENT_ID=<keycloak-client-id>'
      - 'EXPRESS_OPENSRP_CLIENT_SECRET=<keycloak-client-secret>'
      - 'EXPRESS_OPENSRP_ACCESS_TOKEN_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/token'
      - 'EXPRESS_OPENSRP_AUTHORIZATION_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/auth'
      - 'EXPRESS_KEYCLOAK_LOGOUT_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/logout'
      # opensrp server
      - 'EXPRESS_OPENSRP_LOGOUT_URL=<opensrp-server-domain>/opensrp/logout.do'
      - 'EXPRESS_OPENSRP_USER_URL=<opensrp-server-domain>/opensrp/user-details/'
      # opensrp web
      - 'EXPRESS_OPENSRP_CALLBACK_URL=<opensrp-web-domain>/oauth/callback/OpenSRP/'
      - 'EXPRESS_FRONTEND_OPENSRP_CALLBACK_URL=<opensrp-web-domain>/fe/oauth/callback/opensrp'
      - 'EXPRESS_SERVER_LOGOUT_URL=<opensrp-web-domain>/logout'
      - 'EXPRESS_SESSION_SECRET=<randomly-generated-string>'
      - 'EXPRESS_CONTENT_SECURITY_POLICY_CONFIG={"connect-src":["''self''","<optional-sentry-domain>","<keycloak-domain>","<opensrp-server-domain>"],"default-src":["''self''"],"img-src":["''self''","https://github.com/OpenSRP/","https://*.githubusercontent.com/OpenSRP/"],"script-src":["''self''","''unsafe-inline''"]}'
      # others (optional override)
      - 'NODE_ENV=production'
      - 'EXPRESS_PORT=3000'
      - 'EXPRESS_MAXIMUM_SESSION_LIFE_TIME=10800'
      - 'EXPRESS_SESSION_FILESTORE_PATH=/tmp/express-sessions'
      - 'EXPRESS_SESSION_PATH=/'
      - 'EXPRESS_SESSION_NAME=express-session'
      - 'EXPRESS_SESSION_LOGIN_URL=/login'
      - 'EXPRESS_MAXIMUM_LOGS_FILE_SIZE=5242880'
      - 'EXPRESS_MAXIMUM_LOG_FILES_NUMBER=5'
      - 'EXPRESS_LOGS_FILE_PATH=./logs/default-error.log'
      - 'EXPRESS_COMBINED_LOGS_FILE_PATH=./logs/default-error-and-info.log'
      - 'EXPRESS_REACT_BUILD_PATH=/usr/src/web'
      - 'EXPRESS_FRONTEND_LOGIN_URL=/fe/login'
      - 'EXPRESS_ALLOW_TOKEN_RENEWAL=true'
      - 'EXPRESS_OPENSRP_OAUTH_STATE=opensrp'
      - 'EXPRESS_RESPONSE_HEADERS={}'
      # optional redis and redis sentinel session store config
      # - 'EXPRESS_REDIS_STAND_ALONE_URL=redis://username:password@redis-domain:port/db'
      # - 'EXPRESS_REDIS_SENTINEL_CONFIG={"name":"sentinelMasterName","sentinelPassword":"sentinelMasterPassword","sentinels":[{"host":"sentinel-node-1-domain","port":"12345"},{"host":"sentinel-node-2-domain","port":"12345"},{"host":"sentinel-node-3-domain","port":"12345"}]}'
```

And to run it

```bash
docker-compose up
```

## Licence Information

Open Smart Register Platform (OpenSRP), formerly Dristhi software

Copyright 2012-2021

Foundation for Research in Health Systems; Sustainable Engineering Lab; Columbia University; and The Special Programme of Research,
Development and Research Training in Human Reproduction (HRP) of the World Health Organization; Ona; mPower Social Enterprise Bangladesh;
Interactive Health Solutions; Summit Institute of Development; Interactive Research and Development; Johns Hopkins University Global
mHealth Institute; Harvard University School of Public Health

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at:

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
