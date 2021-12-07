export const careTeam1 = {
  resourceType: 'CareTeam',
  id: '308',
  meta: {
    versionId: '4',
    lastUpdated: '2021-06-18T06:07:29.649+00:00',
    source: '#9bf085bac3f61473',
  },
  identifier: [
    {
      use: 'official',
      value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
    },
  ],
  status: 'active',
  name: 'Care Team One',
  subject: {
    reference: 'Group/306',
  },
  participant: [
    {
      member: {
        reference: 'Practitioner/206',
      },
    },
    {
      member: {
        reference: 'Practitioner/103',
      },
    },
  ],
};

export const group1 = {
  resourceType: 'Group',
  id: '306',
  meta: {
    versionId: '1',
    lastUpdated: '2021-05-26T16:31:30.444+00:00',
    source: '#0d2306dfa4b90412',
  },
  identifier: [
    {
      use: 'official',
      value: '93bc9c3d-6321-41b0-9b93-1275d7114e22',
    },
  ],
  active: true,
  name: 'ANC patients',
  quantity: 1,
  member: [
    {
      entity: {
        reference: 'Patient/3',
      },
    },
  ],
};

export const practitioner1 = {
  resourceType: 'Practitioner',
  id: '206',
  meta: {
    versionId: '1',
    lastUpdated: '2021-04-20T07:00:53.598+00:00',
    source: '#85ea6b68103eba2b',
  },
  identifier: [
    {
      use: 'secondary',
      value: 'c1d36d9a-b771-410b-959e-af2c04d132a2',
    },
  ],
  active: true,
  name: [
    {
      use: 'official',
      family: 'Allan',
      given: ['Allay'],
    },
  ],
  telecom: [
    {
      system: 'email',
    },
  ],
};

export const practitioner2 = {
  resourceType: 'Practitioner',
  id: '103',
  meta: {
    versionId: '1',
    lastUpdated: '2021-04-06T14:23:33.833+00:00',
    source: '#6410e3946e34d533',
    tag: [
      {
        system: 'https://fhir.labs.smartregister.org/tags',
        code: 'ona-7-2017',
      },
    ],
  },
  text: {
    status: 'generated',
    div: '<div xmlns="http://www.w3.org/1999/xhtml">Ward Williams</div>',
  },
  identifier: [
    {
      use: 'official',
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/identifier-type',
            code: 'SB',
            display: 'Social Beneficiary Identifier',
          },
        ],
        text: 'US Social Security Number',
      },
      system: 'http://hl7.org/fhir/sid/us-ssn',
      value: '000-00-0002',
    },
    {
      use: 'secondary',
      type: {
        coding: [
          {
            system: 'http://hl7.org/fhir/identifier-type',
            code: 'KUID',
            display: 'Keycloak user ID',
          },
        ],
        text: 'Keycloak user ID',
      },
      system: 'http://hl7.org/fhir/sid/us-ssn',
      value: '287aff05-ff9b-4b07-b525-8860c70377d0',
    },
  ],
  active: true,
  name: [
    {
      use: 'official',
      family: 'Williams',
      given: ['Ward', 'N'],
      suffix: ['MD'],
    },
  ],
  telecom: [
    {
      system: 'phone',
      value: '800-651-2242',
      use: 'home',
    },
    {
      system: 'phone',
      value: '800-471-8810',
      use: 'mobile',
    },
    {
      system: 'email',
      value: 'susan.williams@example.com',
    },
  ],
  address: [
    {
      use: 'home',
      line: ['27 South Ave'],
      city: 'Tulsa',
      state: 'OK',
      postalCode: '74126',
      country: 'USA',
    },
  ],
  gender: 'female',
  birthDate: '1996-11-22',
};
