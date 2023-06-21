# FHIR WEB DOCKER DEPLOYMENT

We use different technologies to deploy OpenSRP FHIR Web. This documentation will focus on [Docker](https://www.docker.com/)

## Prerequisites

---

- A basic knowledge of containerization technologies with focus on Docker.
- A well configured [keycloak server](https://hub.docker.com/r/onaio/keycloak) deployment.
  - We currently support version `18.0.0-legacy`
  - This should include the Keycloak [Realm](https://www.keycloak.org/docs/latest/server_admin/#configuring-realms) and [Client](https://www.keycloak.org/docs/latest/server_admin/#assembly-managing-clients_server_administration_guide) configurations.
- A well configured [Hapi FHIR server](https://github.com/opensrp/hapi-fhir-jpaserver-starter) deployment.

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

- Configs are injected into the container by a [confd](https://github.com/kelseyhightower/confd) service that runs during container startup. This service creates the `config.js` file within the container by parsing and syncing the mounted file `config.js.tpl` contents to the `config.js` file.

- There are two ways to run the application on docker: Using the `docker run` docker cli command or using a `docker compose` config file.

### Docker CLI (`docker run`)

- Use the following docker command paired with a volume config file

  ```docker
  docker run \
  --detach \
  --volume $(pwd)/config.js.tpl:/etc/confd/templates/config.js.tmpl \
  --publish 3000:3000 \
  --env EXPRESS_OPENSRP_CLIENT_ID=example-keycloak-client-id \
  --env EXPRESS_OPENSRP_CLIENT_SECRET=example-keycloak-client-secret \
  `#...rest of the express server envs` \
  --name fhir-web opensrp/web:v2.3.2
  ```

  - With the volume file (`config.js.tpl`) in the same directory, as below:

  ```js
  // config.js.tpl

  window._env_ = {
    REACT_APP_WEBSITE_NAME: 'The best FHIR Web Deployment Ever!',
    REACT_APP_OPENSRP_WEB_VERSION: 'v2.3.2',
    // rest of the react front-end envs
  };
  ```

### Docker Compose (`docker compose`)

- Use a docker-compose file with a volume file

  - N/B: Replace variables in angle brackets `"<>"` with your own

    ```yaml
    # docker-compose.yml

    version: '3.9'
    services:
      fhir-web:
        image: opensrp/web:<fhir-web-release-tag>
        ports:
          - '3000:3000'
        volumes:
          # volume with React front-end environment variables
          - ./config.js.tpl:/etc/confd/templates/config.js.tmpl
        environment:
          # optional overrides
          - 'NODE_ENV=production' # 'NODE_ENV=development' if fhir-web-base-url === http://localhost:3000
          - 'EXPRESS_ALLOW_TOKEN_RENEWAL=true'
          - 'EXPRESS_OPENSRP_LOGOUT_URL=null'
          - 'EXPRESS_REACT_BUILD_PATH=/usr/src/web'

          # keycloak
          - 'EXPRESS_OPENSRP_CLIENT_ID=<keycloak-client-id>'
          - 'EXPRESS_OPENSRP_CLIENT_SECRET=<keycloak-client-secret>'
          - 'EXPRESS_OPENSRP_ACCESS_TOKEN_URL=<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/token'
          - 'EXPRESS_OPENSRP_AUTHORIZATION_URL=<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/auth'
          - 'EXPRESS_KEYCLOAK_LOGOUT_URL=<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/logout'
          - 'EXPRESS_OPENSRP_USER_URL=<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/userinfo'

          # fhir web
          - 'EXPRESS_OPENSRP_CALLBACK_URL=<fhir-web-base-url>/oauth/callback/OpenSRP/'
          - 'EXPRESS_FRONTEND_OPENSRP_CALLBACK_URL=<fhir-web-base-url>/fe/oauth/callback/opensrp'
          - 'EXPRESS_SERVER_LOGOUT_URL=<fhir-web-base-url>/logout'

          # UUID's
          - 'EXPRESS_SESSION_SECRET=<randomly-generated-secret-string>'

          # content security policy configuration
          # remove optional-sentry-base-url config block if your deployment has no sentry
          - 'EXPRESS_CONTENT_SECURITY_POLICY_CONFIG={"connect-src":["''self''","<optional-sentry-base-url>","<keycloak-base-url>","<fhir-server-base-url>"],"default-src":["''self''"],"img-src":["''self''","https://github.com/opensrp/","https://*.githubusercontent.com/opensrp/"]}'

        # optional sentry config
        # - 'EXPRESS_RESPONSE_HEADERS={"report-to":", {endpoints:[{url:https://<optional-sentry-base-url>/api/<optional-sentry-projectId>/security/?sentry_key=<optional-sentry-key>\\u0026sentry_environment=<optional-sentry-environment>\\u0026sentry_release=<optional-sentry-release-name>}],group:csp-endpoint,max_age:10886400}"}'

        # optional redis and redis sentinel session store config (use either or neither not both)
        # - 'EXPRESS_REDIS_STAND_ALONE_URL=redis://username:password@redis-base-url:port/db'
        # - 'EXPRESS_REDIS_SENTINEL_CONFIG={"name":"sentinelMasterName","sentinelPassword":"sentinelMasterPassword","sentinels":[{"host":"sentinel-node-1-base-url","port":"12345"},{"host":"sentinel-node-2-base-url","port":"12345"},{"host":"sentinel-node-3-base-url","port":"12345"}]}'
    ```

    ```js
    // config.js.tpl

    window._env_ = {
      // keycloak
      REACT_APP_KEYCLOAK_API_BASE_URL: '<keycloak-base-url>/auth/admin/realms/<keycloak-realm>',
      REACT_APP_KEYCLOAK_LOGOUT_URL:
        '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/logout',
      REACT_APP_OPENSRP_ACCESS_TOKEN_URL:
        '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/token',
      REACT_APP_OPENSRP_AUTHORIZATION_URL:
        '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/auth',
      REACT_APP_OPENSRP_CLIENT_ID: '<keycloak-client-id>',
      REACT_APP_OPENSRP_USER_URL:
        '<keycloak-base-url>/auth/realms/<keycloak-realm>/protocol/openid-connect/userinfo',

      // fhir-web
      REACT_APP_WEBSITE_NAME: '<website-name>',
      REACT_APP_OPENSRP_WEB_VERSION: '<fhir-web-release-tag>',
      REACT_APP_DOMAIN_NAME: '<fhir-web-base-url>',
      REACT_APP_EXPRESS_OAUTH_GET_STATE_URL: '<fhir-web-base-url>/oauth/state',
      REACT_APP_EXPRESS_OAUTH_LOGOUT_URL: '<fhir-web-base-url>/logout',

      // fhir-server
      REACT_APP_FHIR_API_BASE_URL: '<fhir-server-base-url>/fhir',

      // UUID's
      REACT_APP_FHIR_ROOT_LOCATION_IDENTIFIER:
        '<identifier-of-the-root-location-on-the-HAPI-server>',
      REACT_APP_COMMODITIES_LIST_RESOURCE_ID: '<id-of-a-list-on-HAPI-fhir-server>',

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
        '{"USERS":"ROLE_EDIT_KEYCLOAK_USERS","LOCATIONS":"ROLE_VIEW_KEYCLOAK_USERS","TEAMS":"ROLE_VIEW_KEYCLOAK_USERS","CARE_TEAM":"ROLE_VIEW_KEYCLOAK_USERS","QUEST":"ROLE_VIEW_KEYCLOAK_USERS","HEALTHCARE_SERVICE":"ROLE_VIEW_KEYCLOAK_USERS","GROUP":"ROLE_VIEW_KEYCLOAK_USERS","COMMODITY":"ROLE_VIEW_KEYCLOAK_USERS",}',
      REACT_APP_PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY: 'MANY_TO_ONE',

      // optional sentry config
      // REACT_APP_SENTRY_CONFIG_JSON: "{\"dsn\":\"<sentry-dsn>\",\"environment\":\"<sentry-environment>\",\"release\":\"<app-release-version>\",\"release-name\":\"<app-release-name>\",\"release-namespace\":\"<app-release-namespace>\",\"tags\":{}}",
    };
    ```

  - run with

    ```bash
    docker compose up --detach
    ```

### Notes

- Running a docker deployment exposes the FHIR Web application on `port 3000`. To expose it to the internet, point a reverse proxy, e.g [nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/), to `localhost:3000`

- To enforce a react config override (in `config.js.tpl`), run `docker compose down` first before re-running the deployment. This stops, and remove containers, networks, images, and volumes, allowing them to be created again on `docker compose up`

## Toggling App Modules

- To toggle the application's modules, set the react configurations starting with `REACT_APP_ENABLE_` on or off by setting their values to either `true` or `false`.

  - E.g to toggle the fhir teams module off, set the `REACT_APP_ENABLE_FHIR_TEAMS` configuration to false

    ```bash
    REACT_APP_ENABLE_FHIR_TEAMS: 'false',
    ```
