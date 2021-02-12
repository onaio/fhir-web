# Inventory

Provides UI components and utils for managing inventory items per service point

## Installation

```sh
yarn add @opensrp/inventory
```

```typescript
import '@opensrp/inventory/dist/index.css';
```

## Code example

```JSX
import {
  INVENTORY_SERVICE_POINT_LIST_VIEW,
  INVENTORY_SERVICE_POINT_PROFILE_VIEW,
  INVENTORY_SERVICE_POINT_PROFILE_PARAM,
  ConnectedServicePointList,
  ServicePointProfile,
  INVENTORY_EDIT_SERVICE_POINT,
  INVENTORY_ADD_SERVICE_POINT,
  ServicePointEdit,
  ServicePointsAdd,
  BulkUpload,
  INVENTORY_BULK_UPLOAD_URL,
} from '@opensrp/inventory';

const App = () => {
  return (
    <Layout>
      <Content>
        <Switch>
           <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={`${INVENTORY_SERVICE_POINT_PROFILE_VIEW}/:${INVENTORY_SERVICE_POINT_PROFILE_PARAM}`}
              {...inventoryServiceProps}
              component={ServicePointProfile}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={INVENTORY_SERVICE_POINT_LIST_VIEW}
              {...inventoryServiceProps}
              component={ConnectedServicePointList}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              {...inventoryServiceProps}
              path={INVENTORY_ADD_SERVICE_POINT}
              component={ServicePointsAdd}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              path={INVENTORY_BULK_UPLOAD_URL}
              {...inventoryServiceProps}
              component={BulkUpload}
            />
            <PrivateComponent
              redirectPath={APP_CALLBACK_URL}
              disableLoginProtection={DISABLE_LOGIN_PROTECTION}
              exact
              {...inventoryServiceProps}
              path={`${INVENTORY_EDIT_SERVICE_POINT}/:id`}
              component={ServicePointEdit}
            />
        </Switch>
      </Content>
    </Layout>
  );
};

export default App;
```
