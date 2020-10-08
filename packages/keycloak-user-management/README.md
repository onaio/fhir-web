# Keycloak User Management Module

This package has a set of components that are used to interact with keycloak api. It currently has 3 components

- AdminView - Shows a list of keycloak users, also allows the admin to create, edit or delete users
- CreateEditView - A user form to allow admin to update user info
- Credentials - Allows the admin to set passords to newly created users or update passwords for existing users

## Installation

```node
yarn add @opensrp/keycloak-user-management
```

## Code example

```JSX
import {
  ConnectedAdminView,
  ConnectedCreateEditUsers,
  ConnectedUserCredentials,
} from '@opensrp/keycloak-user-management';

const App = () => {
  return (
    <Layout>
      <Content>
        <Switch>
          <ConnectedPrivateRoute
            redirectPath={APP_CALLBACK_URL}
            disableLoginProtection={false}
            exact
            path="/admin"
            component={ConnectedAdminView}
          />
          <ConnectedPrivateRoute
            redirectPath={APP_CALLBACK_URL}
            disableLoginProtection={false}
            exact
            path="/user/edit/:userId"
            component={ConnectedCreateEditUsers}
          />
          <ConnectedPrivateRoute
            redirectPath={APP_CALLBACK_URL}
            disableLoginProtection={false}
            exact
            path="/user/new"
            component={ConnectedCreateEditUsers}
          />
          <ConnectedPrivateRoute
            redirectPath={APP_CALLBACK_URL}
            disableLoginProtection={false}
            exact
            path="/user/credentials/:userId"
            component={ConnectedUserCredentials}
          />
        </Switch>
      </Content>
    </Layout>
  );
};

export default App;
```
