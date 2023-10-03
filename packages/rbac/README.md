# Role Based Access Control (RBAC)

opensrp-web's Role based access control implementation.

**Dependencies**

1. The opensrp store
2. Session-reducer
3. pkg-config

**Parts/Sub-modules**

- The Role definition - defines how a role will be represented internally in the code.
- Adapters - Utils that define how IAM-centric role information is translated to the recognized role language above.
- Rbac HOC -  a wrapper component that will be used to wrap around ui components that require access control.

## Installation

```sh
yarn add @opensrp/rbac
```
