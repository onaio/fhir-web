# Environment Variables

This document describes the environment variables in this code base and how to use them correctly to manuplate different sections.

Below is a list of currently supported environment variables:

- **REACT_APP_KEYCLOAK_LOGOUT_URL**

  - url to logout from the keycloak server
  - **Required**
  - default: `https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/logout`

- **REACT_APP_DOMAIN_NAME**

  - Defines the domain name of the app
  - **Required**
  - default: `http://localhost:3000`

- **REACT_APP_OPENSRP_ACCESS_TOKEN_URL**

  - Defines the backend URL for fetching the oauth2 access token
  - **Required**
  - default: `https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/token`

- **REACT_APP_OPENSRP_AUTHORIZATION_URL**

  - Defines the oauth2 auth URL
  - **Required**
  - default: `https://keycloak-stage.smartregister.org/auth/realms/opensrp-web-stage/protocol/openid-connect/auth`

- **REACT_APP_OPENSRP_OAUTH_STATE**

  - Defines the app oauth2 state to use
  - **Required**
  - default: `opensrp`

- **REACT_APP_OPENSRP_CLIENT_ID**

  - Defines the oauth2 client id the app should use
  - **Required**

- **REACT_APP_ENABLE_OPENSRP_OAUTH**

  - Enable or disable OpenSRP as the oauth2 provider
  - **Required**
  - default: `true`

- **REACT_APP_DISABLE_LOGIN_PROTECTION**

  - Enable or disable login protection for different app pages
  - **Required**
  - default: `false`

- **REACT_APP_EXPRESS_OAUTH_LOGOUT_URL**

  - URL to logout of the express server
  - **Required**
  - default: `https://web.opensrp-stage.smartregister.org/logout`

- **REACT_APP_EXPRESS_OAUTH_GET_STATE_URL**

  - URL to get oauth2 state value
  - **Required**
  - default: `https://web.opensrp-stage.smartregister.org/oauth/state`

- **REACT_APP_ENABLE_FHIR_HEALTHCARE_SERVICES**

  - Enables the Fhir Healthcare services module
  - **Optional**(_string_)
  - default: `"false"`

- **REACT_APP_ENABLE_FHIR_TEAMS**

  - Enables the Fhir teams module
  - **Optional**(_string_)
  - default: `"false"`

- **REACT_APP_TASK_GENERATION_STATUS**

  - _not required_; _(ENUM<["True", "False", "Disabled", "internal"]>)_
  - no defaults, applies a heuristic to pick the correct value when env isn't configured
  - configures the value to be used for taskGenerationStatus context for dynamicPlans

- **REACT_APP_DATE_FORMAT**

  - _not required_; _(`string`)_
  - The default time used by date fields when creating plans

- **REACT_APP_LANGUAGE_CODE**

  - language resources to use for text i18next
  - **optional**_(`string`)_
  - default: `en`

- **REACT_APP_PROJECT_CODE**

  - project code to help decide where to pick the language resource files from
  - **optional**_(`string`)_
  - default: `core`

- **REACT_APP_PLAN_ASSIGNMENT_AT_GEO_LEVEL**

  - geo level to assign teams at
  - **Optional**(`number`)
  - default: `0`

- **REACT_APP_MAIN_LOGO_SRC**

  - Configures the logo src url.
  - **Optional**(`string`)
  - default: `https://github.com/OpenSRP/web/raw/master/app/src/assets/images/opensrp-logo-color.png`

- **REACT_APP_SUPPORTED_LANGUAGES**

  - Use alongside the language switcher, customize the options available for language switching.
  - **Optional**(`string`)
  - default: all available options

- **REACT_APP_ENABLE_LANGUAGE_SWITCHER**

  - whether to show a language switcher
  - **Optional**(`boolean`)
  - default: `true`

- **REACT_APP_FHIR_API_BASE_URL**

  - FHIR server base URL
  - **Required**
  - default: `https://fhir.labs.smartregister.org/fhir`

- **REACT_APP_ENABLE_FHIR_USER_MANAGEMENT**

  - Enable fhir in the user management module
  - **Optional**(`boolean`)
  - default: `"false"`

- **REACT_APP_OPENSRP_OAUTH_SCOPES**

  - Sets the oauth app permission scopes.
  - **Required**(`string`)
  - default: `profile`

- **REACT_APP_FILTER_BY_PARENT_ID**

  - Allows filtering root locations by parentId when set to true
  - **Optional**(_string_)
  - default: `"true"`

- **REACT_APP_KEYCLOAK_USERS_PAGE_SIZE**

  - keycloak users page size
  - **Optional**(`number`)
  - default: `20`

- **REACT_APP_FHIR_API_BASE_URL**

  - FHIR server base URL
  - **Required**
  - default: `https://fhir.labs.smartregister.org/fhir`

- **REACT_APP_USER_FORM_RENDER_FIELDS** `partially-implemented`

  - module: `user-management`
  - configure rendered form fields in creating editing users, a comma separated list of `FormFieldsKey's`
  - **optional**
  - default: `''`

- **REACT_APP_USER_FORM_HIDDEN_FIELDS** `partially-implemented`

  - module: `user-management`
  - configure hidden form fields in creating editing users, a comma separated list of `FormFieldsKey's`.
  - hidden form fields need to be first rendered in `REACT_APP_USER_FORM_RENDER_FIELDS`
  - **optional**
  - default: `''`

- **REACT_APP_ENABLE_FHIR_LOCATIONS**

  - Enables FHIR location management module
  - **Optional**(`boolean`)
  - default: `"false"`

- **REACT_APP_ENABLE_FHIR_CARE_TEAM**

  - Enables the FHIR Care Team module
  - **Optional**(`boolean`)
  - default: `"false"`

- **REACT_APP_DEFAULTS_TABLE_PAGE_SIZE**

  - Default number of rows per table page
  - default: 5
  - `Enum: 5, 10, 20 , 50, 100`

- **REACT_APP_FHIR_PATIENT_SORT_FIELDS**

  - A comma separated list of sort fields for the FHIR patient resource
  - **Optional**(`strng`)
  - default: `"-_lastUpdated,status"`

- **REACT_APP_FHIR_PATIENT_BUNDLE_SIZE**

  - Default FHIR patient resource bundle size
  - **Optional**(`strng`)
  - default: 5000

- **REACT_APP_ENABLE_FHIR_TEAMS**

  - Enables the FHIR Organization module
  - **Optional**(`boolean`)
  - default: `"false"`

- **REACT_APP_FHIR_ROOT_LOCATION_ID**

  - FHIR Hierarchy root location Id
  - **Optional**_(`string`)_

- **REACT_APP_OPENSRP_WEB_VERSION**

  - Opensrp web version deployed
  - **Optional**(_string_)
  - default: ""

- **REACT_APP_SENTRY_CONFIG_JSON**

  - Stringified json That has sentry custom sentry configurations, refer to [the sdk](https://docs.sentry.io/platforms/javascript/guides/react/enriching-events/tags/) for more information on custom Sentry tags.
  - The full enum space of the keys that can be passed in the config object can be described as: {...[key in [doc](https://getsentry.github.io/sentry-javascript/interfaces/browser.browseroptions-2.html) where value is json serializable]: value, tags:{ // any key value pair }}
  - **Optional**(_string_)
  - default: ""

- **REACT_APP_ENABLE_QUEST**

  - Enable the fhir Quest views
  - **Optional**(_'true'|'false'_)
  - default: 'false'

- **REACT_APP_ENABLE_FHIR_GROUP**

  - enables the fhir groups module
  - **Optional**('true'|'false')
  - default: 'false'

- **REACT_APP_ENABLE_FHIR_COMMODITY**

  - enables the fhir commodities module
  - **Optional**('true'|'false')
  - default: 'false'

- **REACT_APP_COMMODITIES_LIST_RESOURCE_ID**

  - scopes down what commodities are shown on the fhir commidities module.
  - **Conditionally Optional**(`string`) - required when `REACT_APP_ENABLE_FHIR_COMMODITY` is set to `"true"`
  - default: ''

- **REACT_APP_PRACTITIONER_TO_ORG_ASSIGNMENT_STRATEGY=ONE_TO_ONE**

  - define the assignment relationship between practitioners to organizations for fhir deployments. This strategy only applies unilaterally, i.e. form practitioner to organization. It does not imply any relations in the opposite direction i.e. from organization to practitioner.
  - **Optional**(`ONE_TO_ONE, ONE_TO_MANY`)
  - default: `ONE_TO_MANY`

- **REACT_APP_AUTHZ_STRATEGY**
  - defines which authorization strategy to use. This affects how roles and permissions fetched from the Authorization server are parsed and used in the web app.Currently only keycloak is supported which means Role based acces will only work when using keycloak as the IAM server.
  - **Required**(`keycloak`).
  - default: `keycloak`
