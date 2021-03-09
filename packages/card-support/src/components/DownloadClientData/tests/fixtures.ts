/* eslint-disable @typescript-eslint/camelcase */
export const mother = {
  type: 'Client',
  dateCreated: '2020-11-26T04:43:26.392+01:00',
  serverVersion: 1600329284700,
  baseEntityId: '3b9ccc06-43f7-426a-a2dd-e7215797e1af',
  identifiers: {
    M_ZEIR_ID: '183310-2',
  },
  addresses: [
    {
      addressType: '',
      addressFields: {
        address1: 'Matuu',
        address2: 'Home',
      },
    },
  ],
  attributes: {
    first_birth: 'no',
    card_status_date: '2020-11-24T16:55:42.748Z',
    mother_tdv_doses: '2_plus_tdv_doses',
    mother_nationality: 'tunisian',
    registration_location_id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
  },
  firstName: 'Massah',
  lastName: 'Nameless',
  birthdate: '1984-08-01T13:00:00.000+01:00',
  birthdateApprox: false,
  deathdateApprox: false,
  gender: 'female',
  _id: 'e394f29e-2ec7-4d48-9d38-8ee22d3fb495',
  _rev: 'v1',
};

export const mother2 = {
  type: 'Client',
  dateCreated: '2020-08-26T04:43:26.392+01:00',
  serverVersion: 1600329284700,
  baseEntityId: '3b9ccc06-43f7-426a-a2dd-e7215797e1af',
  identifiers: {
    M_ZEIR_ID: '183310-2',
  },
  addresses: [
    {
      addressType: '',
      addressFields: {
        address1: 'Matuu',
        address2: 'Home',
      },
    },
  ],
  attributes: {
    first_birth: 'no',
    card_status_date: '2020-11-24T16:55:42.748Z',
    mother_tdv_doses: '2_plus_tdv_doses',
    mother_nationality: 'tunisian',
    registration_location_id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
  },
  firstName: 'Massah',
  lastName: 'Nameless',
  birthdate: '1984-08-01T13:00:00.000+01:00',
  birthdateApprox: false,
  deathdateApprox: false,
  gender: 'female',
  _id: 'e394f29e-2ec7-4d48-9d38-8ee22d3fb495',
  _rev: 'v1',
};

export const child1 = {
  type: 'Client',
  dateCreated: '2020-11-26T04:43:26.380+01:00',
  serverVersion: 1600329284699,
  clientApplicationVersion: 1,
  clientDatabaseVersion: 13,
  baseEntityId: 'e7d579dc-068b-4ade-ac4c-342ed8f4a609',
  identifiers: {
    zeir_id: '1833045',
  },
  addresses: [
    {
      addressType: '',
      addressFields: {
        address1: 'Matuu',
        address2: 'Home',
      },
    },
  ],
  attributes: {
    age: '3.09',
    card_status: 'needs_card',
    ga_at_birth: '37',
    sms_recipient: 'mother',
    place_of_birth: 'home',
    card_status_date: '2020-11-24T16:55:42.748Z',
    registration_location_id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
  },
  firstName: 'Baby',
  lastName: 'Nameless',
  birthdate: '2017-10-26T13:00:00.000+01:00',
  birthdateApprox: false,
  deathdateApprox: false,
  gender: 'Male',
  relationships: {
    mother: ['3b9ccc06-43f7-426a-a2dd-e7215797e1af'],
  },
  teamId: '8c1112a5-7d17-41b3-b8fa-e1dafa87e9e4',
  locationId: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
  _id: 'e0ee6e75-5350-4ff1-99e0-4c2b545aedde',
  _rev: 'v1',
};

export const child2 = {
  type: 'Client',
  dateCreated: '2020-08-26T04:48:36.714+01:00',
  serverVersion: 1600329284701,
  clientApplicationVersion: 1,
  clientDatabaseVersion: 13,
  baseEntityId: '7f9d8c82-1267-43ad-b30c-21fe4f4ca388',
  identifiers: {
    zeir_id: '1833128',
  },
  addresses: [
    {
      addressType: '',
      addressFields: {
        address1: 'Wangige',
        address2: 'wangige',
      },
    },
  ],
  attributes: {
    age: '0.92',
    card_status: 'needs_card',
    ga_at_birth: '40',
    sms_recipient: 'father',
    place_of_birth: 'hospital',
    card_status_date: '2020-11-24T16:55:42.748Z',
    registration_location_id: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
  },
  firstName: 'Baby',
  lastName: 'Hameed',
  birthdate: '2019-12-26T13:00:00.000+01:00',
  birthdateApprox: false,
  deathdateApprox: false,
  gender: 'Male',
  relationships: {
    mother: ['c62864a6-3fe9-4805-8197-6d906697621d'],
  },
  teamId: '8c1112a5-7d17-41b3-b8fa-e1dafa87e9e4',
  locationId: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
  _id: '07d4fd04-faea-4695-8945-2a7547c2d3f2',
  _rev: 'v1',
};

export const child1CsvEntry = {
  id: '1833045',
  dob: '26/10/2017',
  first_name: 'Baby',
  last_name: 'Nameless',
  gender: 'Male',
  facility_of_registration: 'CSB Hopital Bouficha',
  date_of_registration: '26/11/2020',
  card_status: 'needs_card',
  card_status_last_update: '24/11/2020',
};

export const child2CsvEntry = {
  id: '1833128',
  dob: '26/12/2019',
  first_name: 'Baby',
  last_name: 'Hameed',
  gender: 'Male',
  facility_of_registration: 'CSB Hopital Bouficha',
  date_of_registration: '26/08/2020',
  card_status: 'needs_card',
  card_status_last_update: '24/11/2020',
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

export const locationTreeNode1 = {
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
  key: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
  title: 'CSB Hopital Bouficha',
};

export const locationTreeNode2 = {
  id: 'u5b4a441-21b5-4d03-816b-09d45b17cad1',
  label: 'Hospital',
  node: {
    locationId: 'u5b4a441-21b5-4d03-816b-09d45b17cad1',
    name: 'Hospital',
    attributes: {
      geographicLevel: 1,
    },
    voided: false,
  },
  key: 'u5b4a441-21b5-4d03-816b-09d45b17cad1',
  title: 'Hospital',
};

export const locationTreeNode3 = {
  id: 'a3b4a441-21b5-4d03-816b-09d45b17cad6',
  label: 'CSB Hopital New York',
  node: {
    locationId: 'a3b4a441-21b5-4d03-816b-09d45b17cad6',
    name: 'CSB Hopital New York',
    attributes: {
      geographicLevel: 0,
    },
    voided: false,
  },
  key: 'a3b4a441-21b5-4d03-816b-09d45b17cad6',
  title: 'CSB Hopital New York',
  children: [locationTreeNode2],
};

export const locations = [locationTreeNode1];

export const userAssignment = {
  organizationIds: [2],
  jurisdictions: ['e2b4a441-21b5-4d03-816b-09d45b17cad7'],
  plans: [],
};
