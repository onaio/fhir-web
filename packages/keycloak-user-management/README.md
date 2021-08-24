# Keycloak User Management Module

This package has a set of components that are used to interact with keycloak api. It currently has 3 components

- UserListView - Shows a list of keycloak users, also allows the admin to create, edit or delete users
- CreateEditView - A user form to allow admin to update user info
- Credentials - Allows the admin to set passords to newly created users or update passwords for existing users

## Installation

```node
yarn add @opensrp-web/keycloak-user-management
```

## Code example

```JSX
import {
  ConnectedUserList,
  ConnectedCreateEditUser,
  ConnectedUserCredentials,
  URL_USER,
  URL_USER_EDIT,
  ROUTE_PARAM_USER_ID,
  URL_USER_CREATE,
  URL_USER_CREDENTIALS,
} from '@opensrp-web/user-management';

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
                <ConnectedUserList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_USER_EDIT}/:${ROUTE_PARAM_USER_ID}`}
              component={(props: any) => (
                <ConnectedCreateEditUser {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_USER_CREATE}
              component={(props: any) => (
                <ConnectedCreateEditUser {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_USER_CREDENTIALS}/:${ROUTE_PARAM_USER_ID}`}
              component={(props: any) => (
                <ConnectedUserCredentials {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
        </Switch>
      </Content>
    </Layout>
  );
};

export default App;
```
