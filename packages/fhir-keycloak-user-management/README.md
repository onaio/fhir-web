# Keycloak User Management Module

This package has a set of components that are used to interact with keycloak api. It currently has 3 components

- UserListView - Shows a list of keycloak users, also allows the admin to create, edit or delete users
- CreateEditUserView - A user form to allow admin to create or update user info
- Credentials - Allows the admin to set passwords to newly created users or update passwords for existing users
- GroupsListView - Shows a list of keycloak user groups with names, roles and members. Also allows the admin to create and edit groups
- CreateEditUserGroupView - Allows the admin to create and edit groups (rename, assign and unassign roles)
- UserRolesListView - Shows a list of roles

## Installation

```node
yarn add @opensrp/fhir-user-management
```

## Code example

```JSX
import {
  ConnectedUserList,
  ConnectedCreateEditUser,
  ConnectedUserCredentials,
  UserGroupsList,
  UserRolesList,
  CreateEditUserGroup,
  URL_USER,
  URL_USER_EDIT,
  ROUTE_PARAM_USER_ID,
  URL_USER_CREATE,
  URL_USER_CREDENTIALS,
  URL_USER_GROUPS,
  URL_USER_ROLES,
  URL_USER_GROUP_EDIT,
  ROUTE_PARAM_USER_GROUP_ID,
} from '@opensrp/fhir-user-management';

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
            <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_USER_GROUPS}
              component={(props: any) => (
                <UserGroupsList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
             <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={URL_USER_ROLES}
              component={(props: any) => (
                <UserRolesList {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
             <ConnectedPrivateRoute
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${URL_USER_GROUP_EDIT}/:${ROUTE_PARAM_USER_GROUP_ID}`}
              component={(props: any) => (
                <CreateEditUserGroup {...props} keycloakBaseURL={KEYCLOAK_API_BASE_URL} />
              )}
            />
        </Switch>
      </Content>
    </Layout>
  );
};

export default App;
```
