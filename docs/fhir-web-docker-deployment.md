# FHIR WEB DOCKER DEPLOYMENT

[OpenSRP FHIR Web](https://github.com/opensrp/web) is the default frontend for [OpenSRP FHIR Server](https://github.com/opensrp/hapi-fhir-jpaserver-starter), as well as a configuration dashboard for the [OpenSRP FHIR Core](https://github.com/opensrp/fhircore) mobile application. It provides access to healthcare data, configuration options, and other functionality provided by OpenSRP FHIR Server and OpenSRP FHIR Core.

## What is OpenSRP FHIR Core?

FHIR Core is a Kotlin application for delivering offline-capable, mobile-first healthcare project implementations from local community to national and international scale using FHIR and the WHO Smart Guidelines on Android.

## Prerequisites

---

- A well configured [keycloak server](https://hub.docker.com/r/onaio/keycloak)
- A well configured [Hapi FHIR server](https://github.com/opensrp/hapi-fhir-jpaserver-starter)

## Background

---

- Whenever we cut a [FHIR web release](https://github.com/opensrp/web/releases) we use [github actions](/.github/workflows/docker-publish.yml) to build, tag, and push a docker image based on our [Dockerfile](/Dockerfile) specification to [docker hub](https://hub.docker.com/r/opensrp/web/tags)

- This means that all our releases have a corresponding docker image on docker hub ready for use. E.g [release v2.3.4](https://github.com/opensrp/web/releases/tag/v2.3.4) has the corresponding [docker image tag v2.3.4](https://hub.docker.com/layers/opensrp/web/v2.3.4/images/sha256-de13e5482194d76fd22980e73cda0e4f77d6b59aab868130dea24c3b609aa312?context=explore)

- These images are self contained; composing of the compiled [express authentication server](https://github.com/onaio/express-server) and the compiled [React FHIR Web front-end](https://github.com/opensrp/web) code bases

## Configuration

---

- To deploy FHIR Web you need to run a FHIR web docker image as a docker container and pass configuration environment variables to it.

- Based on the FHIR web architecture, the express server handles authentication (to Keycloak) and serves the react front-end if the user is properly authenticated.

- The express server is configured as a first class docker service; by passing environment variables to the container.

- The react front-end receives a config file, [config.js](https://github.com/opensrp/web/blob/master/app/public/config.js), with environment variables that are read into the browser's windows environment at run time.

- The config file is created by [confd utility](https://github.com/kelseyhightower/confd) reading a volume file (`config.js.tpl`) holding the react app configurations, and injecting it into the container.

- There are two ways to run the application on docker: Using the `docker run` docker cli command or using a `docker compose` config file.

### Docker CLI

- Use the following docker command paired with a volume config file

  ```docker
  docker run \
  --volume $(pwd)/config.js.tpl:/etc/confd/templates/config.js.tmpl \
  --publish 3000:3000 \
  --env EXPRESS_OPENSRP_CLIENT_ID=example-keycloak-client-id \
  --env EXPRESS_OPENSRP_CLIENT_SECRET=example-keycloak-client-secret \
  `#...rest of the express server envs` \
  --name fhir-web opensrp/web:v2.3.2
  ```

  - With the volume file in the same directory, as below:

  ```js
  // config.js.tpl

  window._env_ = {
    REACT_APP_WEBSITE_NAME: 'The best FHIR Web Deployment Ever!',
    REACT_APP_OPENSRP_WEB_VERSION: 'v2.3.2',
    // rest of the react front-end envs
  };
  ```

### Docker Compose

- Use a docker-compose file with a volume file

  - N/B: Replace variables in angle brackets `"<>"` with your own

    ```yaml
    # docker-compose.yml

    version: '3.9'
    services:
      fhir-web:
        image: opensrp/web:<fhir-web-tag>
        ports:
          - '3000:3000'
        volumes:
          # volume with React front-end environment variables
          - ./config.js.tpl:/etc/confd/templates/config.js.tmpl
        environment:
          # optional overrides
          - 'NODE_ENV=production' # 'NODE_ENV=development' if fhir-web-domain === http://localhost:3000
          - 'EXPRESS_ALLOW_TOKEN_RENEWAL=true'
          - 'EXPRESS_OPENSRP_LOGOUT_URL=null'

          # keycloak
          - 'EXPRESS_OPENSRP_CLIENT_ID=<keycloak-client-id>'
          - 'EXPRESS_OPENSRP_CLIENT_SECRET=<keycloak-client-secret>'
          - 'EXPRESS_OPENSRP_ACCESS_TOKEN_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/token'
          - 'EXPRESS_OPENSRP_AUTHORIZATION_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/auth'
          - 'EXPRESS_KEYCLOAK_LOGOUT_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/logout'
          - 'EXPRESS_OPENSRP_USER_URL=<keycloak-domain>/auth/realms/<keycloak-realm>/protocol/openid-connect/userinfo'

          # fhir web
          - 'EXPRESS_OPENSRP_CALLBACK_URL=<fhir-web-domain>/oauth/callback/OpenSRP/'
          - 'EXPRESS_FRONTEND_OPENSRP_CALLBACK_URL=<fhir-web-domain>/fe/oauth/callback/opensrp'
          - 'EXPRESS_SERVER_LOGOUT_URL=<fhir-web-domain>/logout'

          # UUID's
          - 'EXPRESS_SESSION_SECRET=<randomly-generated-secret-string>'

          # content security policy configuration
          # remove optional-sentry-domain config block if your deployment has no sentry
          - 'EXPRESS_CONTENT_SECURITY_POLICY_CONFIG={"connect-src":["''self''","<optional-sentry-domain>","<keycloak-domain>","<fhir-server-domain>"],"default-src":["''self''"],"img-src":["''self''","https://github.com/opensrp/","https://*.githubusercontent.com/opensrp/"],"script-src":["''self''","''unsafe-inline''"]}'

        # optional sentry config
        # - 'EXPRESS_RESPONSE_HEADERS={"report-to":", {endpoints:[{url:https://<optional-sentry-domain>/api/<optional-sentry-projectId>/security/?sentry_key=<optional-sentry-key>\\u0026sentry_environment=<optional-sentry-environment>\\u0026sentry_release=<optional-sentry-release-name>}],group:csp-endpoint,max_age:10886400}"}'

        # optional redis and redis sentinel session store config (use either or neither not both)
        # - 'EXPRESS_REDIS_STAND_ALONE_URL=redis://username:password@redis-domain:port/db'
        # - 'EXPRESS_REDIS_SENTINEL_CONFIG={"name":"sentinelMasterName","sentinelPassword":"sentinelMasterPassword","sentinels":[{"host":"sentinel-node-1-domain","port":"12345"},{"host":"sentinel-node-2-domain","port":"12345"},{"host":"sentinel-node-3-domain","port":"12345"}]}'
    ```

    ```js
    // config.js.tpl

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

      // fhir-web
      REACT_APP_WEBSITE_NAME: '<website-name>',
      REACT_APP_OPENSRP_WEB_VERSION: '<fhir-web-tag>',
      REACT_APP_DOMAIN_NAME: '<fhir-web-domain>',
      REACT_APP_EXPRESS_OAUTH_GET_STATE_URL: '<fhir-web-domain>/oauth/state',
      REACT_APP_EXPRESS_OAUTH_LOGOUT_URL: '<fhir-web-domain>/logout',

      // fhir-server
      REACT_APP_FHIR_API_BASE_URL: '<fhir-server-domain>/fhir',

      // UUID's
      REACT_APP_FHIR_ROOT_LOCATION_IDENTIFIER: '<randomly-generated-uuid>',
      REACT_APP_COMMODITIES_LIST_RESOURCE_ID: '<randomly-generated-uuid>',
      REACT_APP_DEFAULT_PLAN_ID: '<default-opensrp-plan-uuid>',

      // toggle fhir-web modules
      REACT_APP_ENABLE_FHIR_CARE_TEAM: 'false',
      REACT_APP_ENABLE_FHIR_GROUP: 'false',
      REACT_APP_ENABLE_FHIR_HEALTHCARE_SERVICES: 'false',
      REACT_APP_ENABLE_FHIR_LOCATIONS: 'false',
      REACT_APP_ENABLE_FHIR_PATIENTS: 'false',
      REACT_APP_ENABLE_FHIR_TEAMS: 'false',
      REACT_APP_ENABLE_FHIR_USER_MANAGEMENT: 'false',
      REACT_APP_ENABLE_FHIR_COMMODITY: 'false',
      REACT_APP_ENABLE_QUEST: 'false',

      // composite fhir-web modules
      REACT_APP_ENABLE_USER_MANAGEMENT: 'false',
      REACT_APP_ENABLE_LOCATIONS: 'false',
      REACT_APP_ENABLE_TEAMS: 'false',
      REACT_APP_ENABLE_TEAMS_ASSIGNMENT_MODULE: 'false',

      // optional overrides
      SKIP_PREFLIGHT_CHECK: 'true',
      GENERATE_SOURCEMAP: 'false',
      INLINE_RUNTIME_CHUNK: 'false',
      IMAGE_INLINE_SIZE_LIMIT: '0',
      REACT_APP_MAIN_LOGO_SRC:
        'https://github.com/opensrp/web/raw/master/app/src/assets/images/fhir-web-logo.png',
      REACT_APP_OPENSRP_OAUTH_SCOPES: 'openid,profile',
      REACT_APP_ENABLE_OPENSRP_OAUTH: 'true',
      REACT_APP_BACKEND_ACTIVE: 'true',
      REACT_APP_SUPPORTED_LANGUAGES: 'en',
      REACT_APP_PROJECT_CODE: 'demo',
      REACT_APP_DEFAULTS_TABLE_PAGE_SIZE: '10',
      REACT_APP_OPENSRP_LOGOUT_URL: 'null',
      REACT_APP_OPENSRP_ROLES:
        '{"USERS":"ROLE_EDIT_KEYCLOAK_USERS","PLANS":"ROLE_VIEW_KEYCLOAK_USERS","LOCATIONS":"ROLE_VIEW_KEYCLOAK_USERS","CARD_SUPPORT":"ROLE_VIEW_KEYCLOAK_USERS","INVENTORY":"ROLE_VIEW_KEYCLOAK_USERS","TEAMS":"ROLE_VIEW_KEYCLOAK_USERS","PRODUCT_CATALOGUE":"ROLE_VIEW_KEYCLOAK_USERS","FORM_CONFIGURATION":"ROLE_VIEW_KEYCLOAK_USERS","CARE_TEAM":"ROLE_VIEW_KEYCLOAK_USERS","SERVER_SETTINGS":"ROLE_VIEW_KEYCLOAK_USERS","QUEST":"ROLE_VIEW_KEYCLOAK_USERS","MANAGE_REPORTS":"ROLE_MANAGE_REPORTS","DISTRICT_REPORT":"ROLE_DISTRICT_REPORT","HEALTHCARE_SERVICE":"ROLE_VIEW_KEYCLOAK_USERS","GROUP":"ROLE_VIEW_KEYCLOAK_USERS"}',

      // optional sentry config
      // REACT_APP_SENTRY_CONFIG_JSON: "{\"dsn\":\"<sentry-dsn>\",\"environment\":\"<sentry-environment>\",\"release\":\"<app-release-version>\",\"release-name\":\"<app-release-name>\",\"release-namespace\":\"<app-release-namespace>\",\"tags\":{}}",
    };
    ```

  - run with

    ```bash
    docker compose up
    ```

### Notes

- Running a docker deployment exposes the FHIR Web application on `port 3000`. To expose it to the internet, point a reverse proxy, e.g [nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/), to `localhost:3000`

- Use the detached flag (`-d`) to run the container in the background. Both for `docker run -d` and `docker compose up -d`

- To enforce a react config override (in `config.js.tpl`), run `docker compose down` first before re-running the deployment. This stops, and remove containers, networks, images, and volumes, allowing them to be created again on `docker compose up`

## Toggling App Modules

- To toggle the application's modules, set the react configurations starting with `REACT_APP_ENABLE_` on or off by setting their values to either `true` or `false`.

  - E.g to toggle the fhir teams module off, set the `REACT_APP_ENABLE_FHIR_TEAMS` configuration to false

    ```bash
    REACT_APP_ENABLE_FHIR_TEAMS: 'false',
    ```
