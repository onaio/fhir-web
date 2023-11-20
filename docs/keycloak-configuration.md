# Setting up your keycloak web client.

Setting up your keycloak realm and client incorrectly can lead to frustrating application behavior, that can be hard to debug. In this section we will look at the optimal configuration that works for fhir-web.

## Version compatibility

We have previously tested fhir-web on the following keycloak versions

- v18.0.0-legacy
- v19.0.3-legacy
- v22.0.5

## Keycloak config

The following instructions including screenshots assumes the keycloak version is `v19.0.3-legacy`

### Realm

A single full openSRP FHIR end to end system will probably include several services which FHIR-web is one of. All these services should belong to the same realm but to different AUthN clients. We will see how to add such a client for FHIR-web below.

Login using an admin account on the master realm.
On the account console below click on `Add realm`.
Add a realm name in the loaded page and click `create`

[Add realm image.]

[sample realm configuration]

### Client

Next we create the client that fhir-web will use to authenticate users.

1. On the left sidebar, click on `clients`.
2. This loads up a table with a few default clients that provide specific administrative purposes within the keycloak identity management system.
3. click on `Create client`,
4. fill in the client's id, and set the the capability config.
5. Next you will want to edit the following sections:
   1. `valid redirect URIs` - to whitelist AuthN redirection urls.
   2. `Valid post logout redirect URIs` - to enable logout flow completion
   3. `Web origins` - whitelist CORS
6. Save the client configuration.

### Create a realm admin user account

### Groups, Roles and permissions.

At this point you can use the client credentials to run fhir-web. However, when you login with the admin user, you will notice that you get a 403 Unauthorized page. This is because we have not yet assigned the user with the required permissions to view content on the web app.

To do this we first have to create these roles. We then need to assign these roles to the user by either:

1. directly assigning roles to a user or
2. curate roles into contextual groups and then add users to the groups.

Note: We have 2 types of roles:

1. client-centric Roles that effect permissions on keycloak resources like `users, and roles`. These are provided out of the box by keycloak in the `realm-management` client.
2. Custom roles that effect permissions on Fhir resources. These should be added as realm roles, so that we can re-use the same set of roles across all the different clients.

We will look at how we can create the required resources manually using the keycloak admin web ui, and then later see what automation alternatives we can use.

#### Creating roles.

Fhir resource roles take the following shape: `<GET|POST|PUT|DELETE|MANAGE>_<FHIR_RESOURCE_NAME>`, all in caps.`MANAGE_FHIR_RESOURCE_NAME` should be created as a composite role of the permutation of the these roles. `<GET|POST|PUT|DELETE>_<FHIR_RESOURCE_NAME>`

1. Click on realm roles menu.
2. Then click on `Create role`

#### Creating groups.

1. Click on the Groups menu item
2. Click `Create group`
3. After saving the group, you will be redirected to the view shown below
4. Click on the role to open its details view.
5. Clik on the Role mapping pill nav item,
6. From here you can click `Assign role` to add roles to this group.

#### assign user to group

1. By adding members to a group.
   1. Go groups menu
   2. click on group of interest
   3. click on the `members` pill nav item.
   4. Click on `Add member button`, and add users who you would like assigned permissions in this group. You can also remove members from the group.
2. By adding groups to a user.
   1. Go to users menu
   2. Click on the user you whose groups you would like to edit. You might have to search for the user.
   3. Click on `Groups` pill nav item
   4. Click on `Join Group` to add groups to this user. You can also revoke existing group assignments from here

Use 1 when you need to modify alot of users per single group, and 2 when you have to edit several groups per user.

#### Automation

Going by the FHIR resource role's definition, you can tell that we need 5 roles for each resource. If you are dealing with 10 resources, then the number of needed roles becomes atleast 50. To create this number of roles and perform their assignments can become unwieldy quickly when done manually.

// TODO - efsity importer is not available externally yet.
One option we have is an importer script that we internally maintain [here](github.com/onaio/fhir-tooling)

You can also write your own importer script using the [keycloak-admin-client npm package](https://www.npmjs.com/package/@keycloak/keycloak-admin-client). [Here](github.com/onaio/fhir-web-e2e-docker) is an example that we use to bootstrap a local fhir installation

## Conclusion

Invalidating any existing session and re-logging into the app will now not yield a 403 view, but should load up at-least one module that the user can explore. If the 403 persists or you run into any new errors, create a support issue [here](), and we will help take a look at your setup.
