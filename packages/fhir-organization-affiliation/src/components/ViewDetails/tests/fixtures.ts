export const practitionerRole1 = {
  resourceType: 'PractitionerRole',
  id: '388',
  meta: {
    versionId: '2',
    lastUpdated: '2021-08-16T13:18:24.126+00:00',
    source: '#1e274683ed9d3c54',
  },
  identifier: [
    {
      use: 'official',
      value: 'b3046485-1591-46b4-959f-02db30a2f622',
    },
  ],
  active: true,
  practitioner: {
    reference: 'Practitioner/206',
    display: 'Allay Allan',
  },
  organization: {
    reference: 'Organization/105',
    display: 'OpenSRP web Test Organisation',
  },
};

export const org1 = {
  resourceType: 'Organization',
  id: '205',
  meta: {
    versionId: '2',
    lastUpdated: '2021-06-22T08:43:41.801+00:00',
    source: '#e4f4daada5b65d9b',
  },
  identifier: [
    {
      use: 'official',
      value: '205',
    },
  ],
  active: true,
  name: 'test 345',
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
