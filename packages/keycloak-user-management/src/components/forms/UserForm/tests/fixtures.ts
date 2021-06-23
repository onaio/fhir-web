import { FormFields } from '..';
import { KeycloakUser, UserGroup } from '../../../../ducks/user';

export const userGroup: UserGroup[] = [
  { id: '283c5d6e-9b83-4954-9f3b-4c2103e4370c', name: 'Admin', path: '/Admin', subGroups: [] },
  { id: 'a55f0b02-950f-4c6a-9857-667ffbba1dd5', name: 'Admin 2', path: '/Admin 2', subGroups: [] },
  {
    id: '4dd15e66-7132-429b-8939-d1e601611464',
    name: 'New Group',
    path: '/New Group',
    subGroups: [],
  },
  {
    id: '580c7fbf-c201-4dad-9172-1df9faf24936',
    name: 'Super User',
    path: '/Super User',
    subGroups: [],
  },
  {
    id: '2fffbc6a-528d-4cec-aa44-97ef65b9bba2',
    name: 'Test User Group',
    path: '/Test User Group',
    subGroups: [],
  },
];

export const keycloakUsersArray: KeycloakUser[] = [
  {
    id: '97f36061-52fb-4474-88f2-fd286311ff1d',
    createdTimestamp: 1600843525533,
    username: 'mwalimu',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Benjamin',
    lastName: 'Mwalimu',
    email: 'dubdabasoduba@gmail.com',
    disableableCredentialTypes: [],
    requiredActions: ['UPDATE_PASSWORD'],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: '80385001-f385-42ec-8edf-8591dc181a54',
    createdTimestamp: 1600156374050,
    username: 'ona',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Ona',
    lastName: 'kenya',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: '520b579e-70e9-4ae9-b1f8-0775c605b8d2',
    createdTimestamp: 1599565616551,
    username: 'ona-admin',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Ona',
    lastName: 'Admin',
    email: 'test@onatest.com',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 1600329648,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
    createdTimestamp: 1600156317992,
    username: 'opensrp',
    enabled: false,
    totp: false,
    emailVerified: false,
    firstName: 'Demo',
    lastName: 'kenya',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
];

export const keycloakUsersArray1 = [
  {
    id: 'a9f06552-b266-48e6-9fff-a7ffa296ad0a',
    createdTimestamp: 1621631413549,
    username: 'zkakoma',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Ziza',
    lastName: 'Kakoma',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: '00310eab-7267-479e-b154-6012313fb550',
    createdTimestamp: 1617031840778,
    username: 'zkalimina',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Zemba',
    lastName: 'Kalimina',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
  {
    id: 'c1e3d5d7-fe1a-4ff0-afcb-de15f237b967',
    createdTimestamp: 1621631128800,
    username: 'zkapele',
    enabled: true,
    totp: false,
    emailVerified: false,
    firstName: 'Zyinga',
    lastName: 'Kapele',
    disableableCredentialTypes: [],
    requiredActions: [],
    notBefore: 0,
    access: {
      manageGroupMembership: true,
      view: true,
      mapRoles: true,
      impersonate: false,
      manage: true,
    },
  },
];

export const keycloakUser = {
  id: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
  createdTimestamp: 1600156317992,
  username: 'opensrp',
  enabled: true,
  totp: false,
  emailVerified: false,
  firstName: 'Demo',
  lastName: 'kenya',
  email: 'test@onatest.com',
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 0,
  access: {
    manageGroupMembership: true,
    view: true,
    mapRoles: true,
    impersonate: false,
    manage: true,
  },
};

export const practitioner1 = {
  identifier: 'cab07278-c77b-4bc7-b154-bcbf01b7d35b',
  active: true,
  name: 'prac one',
  userId: '7306784c-64fb-4d45-990b-306863eb478b',
  username: 'prac_1',
};

export const practitioner2 = {
  identifier: '718e2b7d-22d7-4c23-aaa7-62cca4b9e318',
  active: false,
  name: 'prac one',
  userId: '7306784c-64fb-4d45-990b-306863eb478b',
  username: 'prac_1',
};

export const userAction1 = {
  alias: 'CONFIGURE_TOTP',
  name: 'Configure OTP',
  providerId: 'CONFIGURE_TOTP',
  enabled: true,
  defaultAction: false,
  priority: 10,
  config: {},
};

export const userAction2 = {
  alias: 'terms_and_conditions',
  name: 'Terms and Conditions',
  providerId: 'terms_and_conditions',
  enabled: false,
  defaultAction: false,
  priority: 20,
  config: {},
};

export const userAction3 = {
  alias: 'UPDATE_PASSWORD',
  name: 'Update Password',
  providerId: 'UPDATE_PASSWORD',
  enabled: true,
  defaultAction: false,
  priority: 30,
  config: {},
};

export const userAction4 = {
  alias: 'UPDATE_PROFILE',
  name: 'Update Profile',
  providerId: 'UPDATE_PROFILE',
  enabled: true,
  defaultAction: false,
  priority: 40,
  config: {},
};

export const userAction5 = {
  alias: 'VERIFY_EMAIL',
  name: 'Verify Email',
  providerId: 'VERIFY_EMAIL',
  enabled: true,
  defaultAction: false,
  priority: 50,
  config: {},
};

export const userAction6 = {
  alias: 'update_user_locale',
  name: 'Update User Locale',
  providerId: 'update_user_locale',
  enabled: true,
  defaultAction: false,
  priority: 1000,
  config: {},
};

export const requiredActions = [
  userAction1,
  userAction2,
  userAction3,
  userAction4,
  userAction5,
  userAction6,
];

export const value: FormFields = {
  firstName: 'Jane',
  lastName: 'Doe',
  username: 'janedoe',
  email: 'janedoe@example.com',
  requiredActions: ['UPDATE_PASSWORD'],
  id: '',
  userGroup: userGroup.splice(3).map((e) => e.id),
};

export const defaultInitialValue: FormFields = {
  firstName: '',
  id: '',
  lastName: '',
  username: '',
  active: false,
  userGroup: undefined,
  practitioner: undefined,
  email: '',
  enabled: false,
  attributes: {
    contact: '',
  },
};
