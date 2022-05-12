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

export const sortedDescPatients = {
  resourceType: 'Bundle',
  id: '4b2eac2d-30c9-464a-8871-f5749b615248',
  meta: {
    lastUpdated: '2022-05-12T11:20:41.766+00:00',
  },
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Patient/_search/?_count=5&_format=json&_sort=-birthdate',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=4b2eac2d-30c9-464a-8871-f5749b615248&_getpagesoffset=5&_count=5&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/b1ef2f2d-fd0c-4377-96a7-fbdf571cfd16',
      resource: {
        resourceType: 'Patient',
        id: 'b1ef2f2d-fd0c-4377-96a7-fbdf571cfd16',
        meta: {
          versionId: '1',
          lastUpdated: '2022-05-05T16:39:11.336+00:00',
          source: '#0434350ee09454d6',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Victoria <b>DIRI </b></div><table class="hapiPropertyTable"><tbody><tr><td>Identifier</td><td/></tr><tr><td>Address</td><td/></tr><tr><td>Date of birth</td><td><span>05 May 2022</span></td></tr></tbody></table></div>',
        },
        identifier: [
          {
            use: 'usual',
          },
          {
            use: 'official',
            value: '112212',
          },
          {
            use: 'secondary',
            value: 'cbfabf37-0221-4493-b353-75f9c32b00e8',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            text: 'Ruba',
            family: 'Diri',
            given: ['Victoria'],
          },
        ],
        gender: 'female',
        birthDate: '2022-05-05',
        address: [
          {
            use: 'home',
            type: 'physical',
          },
        ],
        generalPractitioner: [
          {
            reference: 'Practitioner/b87ff3c2-cbc6-43e6-b753-a9620756f9e4',
          },
        ],
        managingOrganization: {
          reference: 'Organization/105',
        },
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/8628a228-15ea-47fb-9459-662145e9e19d',
      resource: {
        resourceType: 'Patient',
        id: '8628a228-15ea-47fb-9459-662145e9e19d',
        meta: {
          versionId: '1',
          lastUpdated: '2022-05-05T13:38:43.088+00:00',
          source: '#4440325844a23bad',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Ahmed <b>UMER </b></div><table class="hapiPropertyTable"><tbody><tr><td>Identifier</td><td/></tr><tr><td>Address</td><td/></tr><tr><td>Date of birth</td><td><span>03 May 2022</span></td></tr></tbody></table></div>',
        },
        identifier: [
          {
            use: 'usual',
          },
          {
            use: 'official',
            value: '121233',
          },
          {
            use: 'secondary',
            value: '36c91317-25ed-4869-b939-ee370f444d65',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            text: 'Swamad',
            family: 'Umer',
            given: ['Ahmed'],
          },
        ],
        gender: 'male',
        birthDate: '2022-05-03',
        address: [
          {
            use: 'home',
            type: 'physical',
          },
        ],
        generalPractitioner: [
          {
            reference: 'Practitioner/b87ff3c2-cbc6-43e6-b753-a9620756f9e4',
          },
        ],
        managingOrganization: {
          reference: 'Organization/105',
        },
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/bb91218f-c4c5-40df-9b57-82277fc6e2ea',
      resource: {
        resourceType: 'Patient',
        id: 'bb91218f-c4c5-40df-9b57-82277fc6e2ea',
        meta: {
          versionId: '1',
          lastUpdated: '2022-05-05T16:24:53.738+00:00',
          source: '#1ecbe5fcc8c8a332',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Peter <b>ENSTENIN </b></div><table class="hapiPropertyTable"><tbody><tr><td>Identifier</td><td>182988</td></tr><tr><td>Address</td><td/></tr><tr><td>Date of birth</td><td><span>01 May 2022</span></td></tr></tbody></table></div>',
        },
        identifier: [
          {
            use: 'usual',
            value: '182988',
          },
          {
            use: 'official',
            value: '1112',
          },
          {
            use: 'secondary',
            value: 'd3c9db55-93d4-4d66-ada3-6f2623267e32',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            text: 'Fraghut',
            family: 'Enstenin',
            given: ['Peter'],
          },
        ],
        gender: 'male',
        birthDate: '2022-05-01',
        address: [
          {
            use: 'home',
            type: 'physical',
          },
        ],
        generalPractitioner: [
          {
            reference: 'Practitioner/b87ff3c2-cbc6-43e6-b753-a9620756f9e4',
          },
        ],
        managingOrganization: {
          reference: 'Organization/105',
        },
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/7b16a1e2-0fea-47f6-a67c-bb84ffb4cce6',
      resource: {
        resourceType: 'Patient',
        id: '7b16a1e2-0fea-47f6-a67c-bb84ffb4cce6',
        meta: {
          versionId: '1',
          lastUpdated: '2022-04-29T15:16:24.835+00:00',
          source: '#9eac0774ef37e840',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Joe <b>TURNER </b></div><table class="hapiPropertyTable"><tbody><tr><td>Identifier</td><td>444</td></tr><tr><td>Address</td><td/></tr><tr><td>Date of birth</td><td><span>29 April 2022</span></td></tr></tbody></table></div>',
        },
        identifier: [
          {
            use: 'usual',
            value: '444',
          },
          {
            use: 'official',
            value: '444',
          },
          {
            use: 'secondary',
            value: '78cc6f3b-8461-4f4c-a36f-64f6ab74538a',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Turner',
            given: ['Joe'],
          },
        ],
        gender: 'male',
        birthDate: '2022-04-29',
        address: [
          {
            use: 'home',
            type: 'physical',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/d7a624c2-831b-4624-baa0-7fe21a8e4d7a',
      resource: {
        resourceType: 'Patient',
        id: 'd7a624c2-831b-4624-baa0-7fe21a8e4d7a',
        meta: {
          versionId: '1',
          lastUpdated: '2022-04-29T15:16:35.319+00:00',
          source: '#282afeb2f3692102',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">adia <b>ARI </b></div><table class="hapiPropertyTable"><tbody><tr><td>Identifier</td><td/></tr><tr><td>Address</td><td/></tr><tr><td>Date of birth</td><td><span>29 April 2022</span></td></tr></tbody></table></div>',
        },
        identifier: [
          {
            use: 'usual',
          },
          {
            use: 'official',
            value: '4444',
          },
          {
            use: 'secondary',
            value: '385a3534-07bb-4dbe-9496-d5ce14c61a31',
          },
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'ari',
            given: ['adia'],
          },
        ],
        gender: 'male',
        birthDate: '2022-04-29',
        address: [
          {
            use: 'home',
            type: 'physical',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
  ],
};

export const sortedAscPatients = {
  resourceType: 'Bundle',
  id: 'd815e121-3cb6-4e20-82dd-a22f790a4969',
  meta: {
    lastUpdated: '2022-05-12T11:27:52.168+00:00',
  },
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url: 'https://fhir.labs.smartregister.org:443/fhir/Patient/_search/?_count=5&_format=json&_sort=birthdate',
    },
    {
      relation: 'next',
      url: 'https://fhir.labs.smartregister.org:443/fhir?_getpages=d815e121-3cb6-4e20-82dd-a22f790a4969&_getpagesoffset=5&_count=5&_format=json&_pretty=true&_bundletype=searchset',
    },
  ],
  entry: [
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/4dfc4657-9981-4cfd-b351-42ecae56ce97',
      resource: {
        resourceType: 'Patient',
        id: '4dfc4657-9981-4cfd-b351-42ecae56ce97',
        meta: {
          versionId: '2',
          lastUpdated: '2021-09-03T22:20:04.140+00:00',
          source: '#e7164daacc59e7ad',
          profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Moses <b>CANAAN </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>Nairobi </span><span>Kenya </span></td></tr><tr><td>Date of birth</td><td><span>10 July 1909</span></td></tr></tbody></table></div>',
        },
        active: true,
        name: [
          {
            family: 'Canaan',
            given: ['Moses'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '7374774',
          },
        ],
        gender: 'male',
        birthDate: '1909-07-10',
        address: [
          {
            city: 'Nairobi',
            country: 'Kenya',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/983ae6b4-0581-4066-a9b0-a31afebc2cf6',
      resource: {
        resourceType: 'Patient',
        id: '983ae6b4-0581-4066-a9b0-a31afebc2cf6',
        meta: {
          versionId: '2',
          lastUpdated: '2021-09-03T22:20:40.040+00:00',
          source: '#45882b1ac1190e7b',
          profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Nelson <b>MANDELA </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>Cape Town </span><span>South Africa </span></td></tr><tr><td>Date of birth</td><td><span>28 May 1919</span></td></tr></tbody></table></div>',
        },
        active: true,
        name: [
          {
            family: 'Mandela',
            given: ['Nelson'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '747378383',
          },
        ],
        gender: 'male',
        birthDate: '1919-05-28',
        address: [
          {
            city: 'Cape Town',
            country: 'South Africa',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/fc40560c-544b-43dc-b56f-97703f489a43',
      resource: {
        resourceType: 'Patient',
        id: 'fc40560c-544b-43dc-b56f-97703f489a43',
        meta: {
          versionId: '1',
          lastUpdated: '2021-09-02T22:12:09.338+00:00',
          source: '#745e3bac2b0f1567',
          profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
          tag: [
            {
              system: 'https://www.snomed.org',
              code: '35359004',
              display: 'Family',
            },
          ],
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">sada <b>RAZI </b></div><table class="hapiPropertyTable"><tbody><tr><td>Address</td><td><span>Nairobi </span></td></tr><tr><td>Date of birth</td><td><span>14 September 1921</span></td></tr></tbody></table></div>',
        },
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
        ],
        active: true,
        name: [
          {
            family: 'razi',
            given: ['sada'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '32313232323',
          },
        ],
        gender: 'male',
        birthDate: '1921-09-14',
        address: [
          {
            city: 'Nairobi',
            district: 'Ibrahim Hyderi',
          },
        ],
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/d6b7acab-ada1-45ef-917e-c56e5d7b9041',
      resource: {
        resourceType: 'Patient',
        id: 'd6b7acab-ada1-45ef-917e-c56e5d7b9041',
        meta: {
          versionId: '6',
          lastUpdated: '2022-04-29T17:06:46.927+00:00',
          source: '#40c87a2b00c2251d',
          tag: [
            {
              system: 'https://www.snomed.org',
              code: '35359004',
              display: 'Family',
            },
          ],
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Charles <b>MENGI </b></div><table class="hapiPropertyTable"><tbody><tr><td>Identifier</td><td>727272</td></tr><tr><td>Address</td><td><span>616272 </span><br/></td></tr><tr><td>Date of birth</td><td><span>03 January 1935</span></td></tr></tbody></table></div>',
        },
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/flag-detail',
            valueString: 'Family',
          },
        ],
        identifier: [
          {
            value: '727272',
          },
        ],
        active: true,
        name: [
          {
            family: 'Mengi',
            given: ['Charles'],
          },
        ],
        gender: 'male',
        birthDate: '1935-01-03',
        address: [
          {
            line: ['616272'],
            district: 'Kilifi',
          },
        ],
        managingOrganization: {
          reference: 'Organization/105',
        },
      },
      search: {
        mode: 'match',
      },
    },
    {
      fullUrl:
        'https://fhir.labs.smartregister.org:443/fhir/Patient/83ec9121-4b2f-410b-8a15-c3a137ee9b8a',
      resource: {
        resourceType: 'Patient',
        id: '83ec9121-4b2f-410b-8a15-c3a137ee9b8a',
        meta: {
          versionId: '1',
          lastUpdated: '2021-09-10T20:10:36.939+00:00',
          source: '#8e566407c1a0a396',
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><div class="hapiHeaderText">Rick <b>SANCHEZ </b></div><table class="hapiPropertyTable"><tbody><tr><td>Date of birth</td><td><span>10 September 1938</span></td></tr></tbody></table></div>',
        },
        active: true,
        name: [
          {
            family: 'Sanchez',
            given: ['Rick'],
          },
        ],
        telecom: [
          {
            system: 'phone',
            value: '0235666875',
          },
        ],
        gender: 'male',
        birthDate: '1938-09-10',
      },
      search: {
        mode: 'match',
      },
    },
  ],
};
