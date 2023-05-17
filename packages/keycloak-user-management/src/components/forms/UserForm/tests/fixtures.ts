import { FormFields } from '../types';
import { KeycloakUser, UserGroup } from '../../../../ducks/user';
import { Organization } from '@opensrp/team-management';

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
  id: '',
  lastName: 'Doe',
  username: 'janedoe',
  email: 'janedoe@example.com',
  userGroups: userGroup.splice(3).map((e) => e.id),
};

export const organization: Organization[] = [
  {
    active: true,
    id: 2,
    identifier: 'd23f7350-d406-11e9-bb65-2a2ae2dbcce4',
    name: 'Takang 1',
    partOf: 1,
    type: {
      coding: [
        {
          code: 'team',
          display: 'Team',
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
        },
      ],
    },
  },
];

export const compositionPage1 = {
  resourceType: 'Bundle',
  id: 'a1b1aca5-d381-4296-a612-0fca2fc0a50c',
  meta: {
    lastUpdated: '2023-01-31T14:52:13.171+00:00',
  },
  type: 'searchset',
  total: 22,
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Composition/_search?_count=5&_elements=identifier%2Ctitle&_getpagesoffset=0&type=http%3A%2F%2Fsnomed.info%2Fsct%7C1156600005',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=a1b1aca5-d381-4296-a612-0fca2fc0a50c&_getpagesoffset=5&_count=5&_pretty=true&_bundletype=searchset&_elements=identifier,title',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Composition/4a5e4d98-9bac-41de-9775-7ca795c3de12',
      resource: {
        resourceType: 'Composition',
        id: '4a5e4d98-9bac-41de-9775-7ca795c3de12',
        meta: {
          versionId: '12',
          lastUpdated: '2022-10-31T15:26:18.785+00:00',
          source: '#49475fbba4633d3c',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        identifier: {
          use: 'official',
          value: 'cha',
        },
        title: 'Device configurations',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Composition/145752',
      resource: {
        resourceType: 'Composition',
        id: '145752',
        meta: {
          versionId: '5',
          lastUpdated: '2022-10-14T10:37:30.790+00:00',
          source: '#c2e14bf14f0d03b3',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        identifier: {
          use: 'official',
          value: 'notice-f',
        },
        title: 'Device configurations',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Composition/145753',
      resource: {
        resourceType: 'Composition',
        id: '145753',
        meta: {
          versionId: '2',
          lastUpdated: '2022-10-19T12:25:22.888+00:00',
          source: '#864b4da9e94ed6b7',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        identifier: {
          use: 'official',
          value: 'map',
        },
        title: 'Device configurations',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Composition/138190',
      resource: {
        resourceType: 'Composition',
        id: '138190',
        meta: {
          versionId: '1',
          lastUpdated: '2022-08-19T08:08:18.875+00:00',
          source: '#97457935f2b2b5b2',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        identifier: {
          use: 'official',
          value: 'ecbis_sc',
        },
        title: 'Device configurations',
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'https://fhir.labs.smartregister.org:443/fhir/Composition/141060',
      resource: {
        resourceType: 'Composition',
        id: '141060',
        meta: {
          versionId: '7',
          lastUpdated: '2022-09-06T14:28:14.715+00:00',
          source: '#fd2cab40d76ebddc',
          tag: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationValue',
              code: 'SUBSETTED',
              display: 'Resource encoded in summary mode',
            },
          ],
        },
        identifier: {
          use: 'official',
          value: 'ay',
        },
        title: 'Device configurations',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const createdUser = {
  firstName: 'Test',
  id: '',
  lastName: 'One',
  username: 'TestOne',
  email: 'testone@gmail.com',
  enabled: true,
  attributes: { fhir_core_app_id: ['cha'] },
};
