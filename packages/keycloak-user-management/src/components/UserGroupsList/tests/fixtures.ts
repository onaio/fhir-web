export const members = [
  {
    id: '821f587d-734f-4263-8d50-ec37f2e84ef4',
    createdTimestamp: 1612271964528,
    username: 'demo',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Demo',
    lastName: 'User',
    email: 'xdr55712@eoopy.com',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
  },
  {
    id: '687a196d-b43e-4f0a-9784-e85334178155',
    createdTimestamp: 1608127636898,
    username: 'onadev',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'ona',
    lastName: 'dev',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
  },
];

export const userGroup1 = {
  id: '261c67fe-918b-4369-a35f-095b5e284fcb',
  name: 'Provider',
  path: '/Provider',
  attributes: {},
  realmRoles: ['PLANS_FOR_USER', 'ALL_EVENTS', 'OPENMRS'],
  clientRoles: {},
  subGroups: [],
  access: { view: true, manage: true, manageMembership: true },
};

export const effectiveRoles = [
  {
    id: 'cb4d5fc9-3b05-4514-b007-5971adba6d2f',
    name: 'EDIT_KEYCLOAK_USERS',
    description: 'Allows the management of keycloak users',
    composite: true,
    clientRole: false,
    containerId: 'FHIR_Android',
  },
  {
    id: '55c89f15-94b4-4395-b343-fb57740ff234',
    name: 'VIEW_KEYCLOAK_USERS',
    description: 'Allows the user to view the users created in keycloak',
    composite: true,
    clientRole: false,
    containerId: 'FHIR_Android',
  },
];
