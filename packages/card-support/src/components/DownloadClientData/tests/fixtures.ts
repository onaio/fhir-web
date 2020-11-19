/* eslint-disable @typescript-eslint/camelcase */
export const mother = {
  type: 'Client',
  dateCreated: '2020-08-31T10:32:48.045+01:00',
  serverVersion: 1598866400732,
  baseEntityId: 'e33c1ff7-f6ea-4b1b-8f3b-92140c000dd6',
  identifiers: {
    M_ZEIR_ID: '150264',
  },
  addresses: [
    {
      addressType: '',
      addressFields: {
        address1: 'Lawson',
        address2: 'William',
      },
    },
  ],
  attributes: {
    first_birth: 'No',
    mother_tdv_doses: '2+ doses of TDV during pregnancy',
    mother_nationality: 'Not known',
    second_phone_number: '74789656',
    mother_guardian_number: '78963665',
  },
  firstName: 'Abbott',
  lastName: 'Lusiano',
  birthdate: '1985-01-01T01:00:00.000+01:00',
  birthdateApprox: false,
  deathdateApprox: false,
  gender: 'female',
  _id: '32be4788-b01f-4647-b2a7-033c4323b64a',
  _rev: 'v2',
};

export const child = {
  type: 'Client',
  dateCreated: '2020-08-31T13:03:37.464+01:00',
  dateEdited: '2020-08-31T10:10:55.654+01:00',
  serverVersion: 1598865139735,
  clientApplicationVersion: 1,
  clientDatabaseVersion: 11,
  baseEntityId: '6f9a7905-385c-4070-ba51-68372ea75ed1',
  identifiers: {
    zeir_id: '149901',
  },
  addresses: [
    {
      addressType: '',
      addressFields: {
        address1: 'Kiwele Village',
        address2: 'Kiwele',
      },
    },
  ],
  attributes: {
    age: '1.11',
    child_reg: '12121212121',
    ga_at_birth: '32',
    place_of_birth: 'Hospital',
    birth_registration_number: '2019/0723',
  },
  firstName: 'Lona',
  lastName: 'Njabi',
  birthdate: '2019-07-23T13:00:00.000+01:00',
  birthdateApprox: false,
  deathdateApprox: false,
  gender: 'Female',
  relationships: {
    mother: ['e0c32e38-1be7-4b79-83cf-6af409c45725'],
  },
  _id: '6e995f19-aac4-4ec5-a2ad-94d697ffdaaf',
  _rev: 'v3',
};

export const child2 = {
  type: 'Client',
  dateCreated: '2020-08-31T13:05:52.245+01:00',
  dateEdited: '2020-08-31T10:10:55.662+01:00',
  serverVersion: 1598865139737,
  clientApplicationVersion: 1,
  clientDatabaseVersion: 11,
  baseEntityId: '9e6bf9e1-feb3-4a48-b74a-06757bcf98c3',
  identifiers: {
    zeir_id: '149904',
  },
  addresses: [
    {
      addressType: '',
      addressFields: {
        address1: 'Tumaini Moja',
        address2: 'Tumani',
      },
    },
  ],
  attributes: {
    age: '0.07',
    child_reg: '88888888888',
    ga_at_birth: '38',
    place_of_birth: 'Home',
    birth_registration_number: '2020/0408',
  },
  firstName: 'Silas',
  lastName: 'Isaboke',
  birthdate: '2020-08-04T13:00:00.000+01:00',
  birthdateApprox: false,
  deathdateApprox: false,
  gender: 'Male',
  relationships: {
    father: ['7458f191-4de6-4059-8b65-aa5aab733c6e'],
    mother: ['8c3eb993-b0ce-49b7-93d7-854ce2621113'],
  },
  _id: '013fb2e9-a86c-4b94-9629-5691fcfb0cb2',
  _rev: 'v3',
};

export const csvEntry1 = {
  id: '149901',
  dob: '23/07/2019',
  firstName: 'Lona',
  lastName: 'Njabi',
  gender: 'Female',
};

export const csvEntry2 = {
  id: '149904',
  dob: '04/08/2020',
  firstName: 'Silas',
  lastName: 'Isaboke',
  gender: 'Male',
};

export const locationHierarchy = {
  locationsHierarchy: {
    map: {
      'e2b4a441-21b5-4d03-816b-09d45b17cad7': {
        id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
        label: 'CSB Hopital Bouficha',
        node: {
          locationId: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
          name: 'CSB Hopital Bouficha',
          attributes: {
            geographicLevel: 0,
          },
          voided: false,
        },
      },
    },
    parentChildren: {},
  },
};

export const userAssignment = {
  organizationIds: [2],
  jurisdictions: ['5d99a60e-126e-4c40-b5ce-439f920de090'],
  plans: [],
};
