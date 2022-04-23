export const patients = {
  resourceType: 'Bundle',
  id: '2ea64c09-db71-46a1-81cb-e33a9e2f3956',
  meta: {
    lastUpdated: '2021-03-17T11:07:21.882+00:00',
  },
  type: 'searchset',
  total: 4,
  link: [
    {
      relation: 'self',
      url: 'http://fhir.labs.smartregister.org/fhir/Patient?_format=json',
    },
  ],
  entry: [
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Patient/52',
      resource: {
        resourceType: 'Patient',
        id: '52',
        meta: {
          versionId: '1',
          lastUpdated: '2021-03-10T13:51:22.933+00:00',
          source: '#73d7e97bbba440eb',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Apple <b>PARK </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>213,One Pademore </span><br/><span>Nairobi </span><span>Kenya </span></td></tr><tr><td>Date of birth</td><td><span>04 August 1988</span></td></tr></tbody></table></div>',
        },
        name: [
          {
            use: 'official',
            family: 'Park',
            given: ['Apple'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '+254722123456',
            use: 'mobile',
          },
          {
            system: 'email',
            value: 'papple@ona.io',
          },
        ],
        gender: 'male',
        birthDate: '1988-08-04',
        address: [
          {
            line: ['213,One Pademore'],
            city: 'Nairobi',
            postalCode: '00100',
            country: 'Kenya',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Patient/2',
      resource: {
        resourceType: 'Patient',
        id: '2',
        meta: {
          versionId: '5',
          lastUpdated: '2021-03-10T13:28:24.717+00:00',
          source: '#75a730fc3ef5db45',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Jane <b>DOE </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>213,One Pademore </span><br/><span>Nairobi </span><span>Kenya </span></td></tr><tr><td>Date of birth</td><td><span>04 August 1988</span></td></tr></tbody></table></div>',
        },
        name: [
          {
            use: 'official',
            family: 'Doe',
            given: ['Jane'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '+254722123456',
            use: 'mobile',
          },
          {
            system: 'email',
            value: 'jndoe@ona.io',
          },
        ],
        gender: 'male',
        birthDate: '1988-08-04',
        address: [
          {
            line: ['213,One Pademore'],
            city: 'Nairobi',
            postalCode: '00100',
            country: 'Kenya',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Patient/1',
      resource: {
        resourceType: 'Patient',
        id: '1',
        meta: {
          versionId: '4',
          lastUpdated: '2021-03-10T13:27:48.632+00:00',
          source: '#14dfbe238f0933a5',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">John <b>DOE </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>213,One Pademore </span><br/><span>Nairobi </span><span>Kenya </span></td></tr><tr><td>Date of birth</td><td><span>04 August 1988</span></td></tr></tbody></table></div>',
        },
        name: [
          {
            use: 'official',
            family: 'Doe',
            given: ['John'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '+254722123456',
            use: 'mobile',
          },
          {
            system: 'email',
            value: 'jdoe@ona.io',
          },
        ],
        gender: 'male',
        birthDate: '1988-08-04',
        address: [
          {
            line: ['213,One Pademore'],
            city: 'Nairobi',
            postalCode: '00100',
            country: 'Kenya',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl: 'http://fhir.labs.smartregister.org/fhir/Patient/3',
      resource: {
        resourceType: 'Patient',
        id: '3',
        meta: {
          versionId: '4',
          lastUpdated: '2021-03-10T13:18:22.074+00:00',
          source: '#e896699578eaae1f',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Albert <b>EINSTEIN </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>213,One Pademore </span><br/><span>Nairobi </span><span>Kenya </span></td></tr><tr><td>Date of birth</td><td><span>04 August 1988</span></td></tr></tbody></table></div>',
        },
        deceasedBoolean: true,
        name: [
          {
            use: 'official',
            family: 'Einstein',
            given: ['Albert'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '+254722123456',
            use: 'mobile',
          },
          {
            system: 'email',
            value: 'aeinstein@ona.io',
          },
        ],
        gender: 'male',
        birthDate: '1988-08-04',
        address: [
          {
            line: ['213,One Pademore'],
            city: 'Nairobi',
            postalCode: '00100',
            country: 'Kenya',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
