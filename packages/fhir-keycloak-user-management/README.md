# Fhir User Management Module

This package has a set of components that are used to interact with keycloak api. It exports components that can perform different user management tasks, like creating users in a keycloak servers, and creating associated practitioners in a fhir hapi server.

This module builds upon `@opensrp/user-management` module. Alot of the ui workflows are very similary and the only differences yet, is that this package edits practitioners to the fhir-server while the `@opensrp/user-management` does the same to the opensrp web server.

## Installation

```node
yarn add @opensrp/fhir-user-management
```

## Code example

```JSX
import {
  UserList,
  CreateEditUser,
  URL_USER,
  URL_USER_EDIT,
  ROUTE_PARAM_USER_ID,
} from '@opensrp/user-management';

const App = () => {
  return (
    <Layout>
      <Content>
        <Switch>
           <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_USER}
              component={(props: any) => (
                <UserList {...props} 
                keycloakBaseURL={KEYCLOAK_API_BASE_URL}
                firBaseUrl=""
                 />
              )}
            />
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_USER_EDIT}/:${ROUTE_PARAM_USER_ID}`}
              component={(props: any) => (
                <UserList {...props} 
                keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
                firBaseUrl=""
              )}
            />
        </Switch>
      </Content>
    </Layout>
  );
};

export default App;
```
