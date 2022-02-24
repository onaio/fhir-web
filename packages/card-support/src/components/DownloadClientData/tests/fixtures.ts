/* eslint-disable @typescript-eslint/naming-convention */
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
    registration_location_name: 'CSB Hopital Bouficha',
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
    registration_location_name: 'CSB Hopital Bouficha',
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
    registration_location_name: 'CSB Hopital Bouficha',
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
    registration_location_name: 'CSB Hopital Bouficha',
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
    parentChildren: {
      '70589012-899c-401d-85a1-13fabce26aab': [
        '325b9549-80fa-4dd0-9cf8-f0538cbebb18',
        'e2b4a441-21b5-4d03-816b-09d45b17cad7',
        '72f8ae88-58c9-40b4-863a-1c7bc6549a8b',
        '52c10f07-6653-470d-9fee-14b0bb111c2a',
        'd309898b-3925-494f-a30c-689222d3fcce',
        'dbacb5dc-c8a3-439d-b407-13ffd570b9ef',
        '27400130-8127-4f54-b14f-e26f20ecae14',
        '14e83edc-5a54-44f5-816e-c96c61b5d911',
        '9c183088-e498-4183-af41-b29bd32d94b6',
        '66c88197-8281-4eb4-ae2e-4a89ae8419ed',
      ],
      'e447d5bb-8d42-4be4-b91d-b8d185cf81a6': ['1018b255-0889-492c-b5dd-31a50cb3db4d'],
      'e5631d3e-70c3-4083-ac17-46f9467c6dd5': ['5d99a60e-126e-4c40-b5ce-439f920de090'],
      '7a663f5e-2619-4a2d-a7df-7250263f47d2': ['9a0e7727-b011-458f-832a-61108b2fe381'],
      '18b3841b-b5b1-4971-93d0-d36ac20c4565': ['70589012-899c-401d-85a1-13fabce26aab'],
      'fee237ef-75e8-4ada-b15f-6d1a92633f33': ['e5631d3e-70c3-4083-ac17-46f9467c6dd5'],
      '16c58ef5-3b19-4ec2-ba9c-aefac3d08a66': ['e447d5bb-8d42-4be4-b91d-b8d185cf81a6'],
      'ede2c7cf-331e-497e-9c7f-2f914d734604': [
        '18b3841b-b5b1-4971-93d0-d36ac20c4565',
        'fee237ef-75e8-4ada-b15f-6d1a92633f33',
        '16c58ef5-3b19-4ec2-ba9c-aefac3d08a66',
        '7a663f5e-2619-4a2d-a7df-7250263f47d2',
      ],
    },
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

export const sampleTeamAssignment = {
  team: {
    team: {
      teamName: 'Weekly Call',
      uuid: '903594cf-7890-4c64-9e12-143fda948a72',
      location: {
        name: 'Nairobi',
        uuid: 'e2b4a441-21b5-4d03-816b-09d45b17cad7',
      },
    },
  },
};
