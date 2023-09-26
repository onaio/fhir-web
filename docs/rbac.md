# Role based acces control (RBAC)

Fhir web Rbac implementation limits what logged in users can see and actions they can perform on the web client.

## Approach

The rbac module provisions an internal role definition and plugins that can parse IAM role information into the pre-defined internal role representation. [This comment](https://github.com/onaio/fhir-web/issues/1182#issuecomment-1486729934) has more information on what this role definition looks like.

The following adapters exist and can be configured using the `REACT_APP_AUTHZ_STRATEGY` env

1. Keycloak adapter

### Keycloak Adapter

The keycloak plugins extract role information from the encoded JWT response upon authentication. This can be added as [custom claims](https://stackoverflow.com/a/63937331) to the JWT if they are not included by default.

Keycloak has 2 type of roles:

1. RealmRoles

Realm roles are global to the realm and defined at realm level. They are used to define permissions and access control across several clients within a single realm. Roles associated with fhir server resource will usually be created as realm roles

2. ClientRoles

Client roles are specific to an individual client application.They allow you to fine-tune access control within the context of a single client. Keycloak provides a `realm-management` client that has a few default roles that define permissions involving managing keycloak resources like users, groups and client

This adapter is able to understand user, and group related client roles from keycloak. Furthermore its able to parse FHIR resource related roles using the structure below.

| **HTTP Methods** | **Keycloak Roles** | **Examples**   |
| :--------------- | :----------------- | :------------- |
| GET              | GET Resource       | GET_PATIENT    |
| POST             | POST Resource      | CREATE_PATIENT |
| PUT              | PUT Resource       | UPDATE_PATIENT |
| DELETE           | DELETE Resource    | DELETE_PATIENT |
|                  | MANAGE Resource    | MANAGE_PATIENT |

Read more about this [here](https://github.com/opensrp/fhircore/discussions/1603)
