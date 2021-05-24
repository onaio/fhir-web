/* eslint-disable @typescript-eslint/camelcase */
import { Organization, OrganizationPOST } from '../../../ducks/organizations';
import { Practitioner } from '../../../ducks/practitioners';
import { FormField } from '../Form';

export const accessToken = 'token';
export const opensrpBaseURL = 'https://opensrp-stage.smartregister.org/opensrp/rest/';
export const id = '258b4dec-79d3-546d-9c5c-f172aa7e03b0';

export const team: Organization = {
  id: 1,
  identifier: id,
  active: true,
  name: 'Test Test Team',
  type: {
    coding: [
      {
        system: 'http://terminology.hl7.org/CodeSystem/team-type',
        code: 'team',
        display: 'Team',
      },
    ],
  },
};

export const practitioners: Practitioner[] = [
  {
    identifier: '1',
    active: true,
    name: 'prac two',
    userId: '1',
    username: 'prac2',
  },
  {
    identifier: '2',
    active: false,
    name: 'prac one',
    userId: '2',
    username: 'prac_1',
  },
  {
    identifier: '3',
    active: false,
    name: 'prac one',
    userId: '3',
    username: 'prac_one',
  },
  {
    identifier: '4',
    active: false,
    name: 'Practitioner Two',
    userId: '4',
    username: 'prac_two',
  },
  {
    identifier: '5',
    active: false,
    name: 'Practitioner One',
    userId: '5',
    username: 'practitioner_one',
  },
  {
    identifier: '6',
    active: true,
    name: 'Benjamin Mulyungi',
    userId: '6',
    username: 'mwalimu',
  },
  {
    identifier: '7',
    active: true,
    name: 'test admin',
    userId: '7',
    username: 'admin-2',
  },
];

export const intialValue: FormField = {
  name: team.name,
  active: team.active,
  practitioners: practitioners.slice(0, 3).map((prac) => prac.identifier),
  practitionersList: practitioners.slice(0, 3),
};

export const teamPost: OrganizationPOST = {
  active: intialValue.active,
  identifier: id,
  name: intialValue.name,
  type: {
    coding: [
      {
        code: 'team',
        display: 'Team',
        system: 'http://terminology.hl7.org/CodeSystem/organization-type',
      },
    ],
  },
};

export const teams: Organization[] = [
  {
    id: 1,
    identifier: '1',
    active: true,
    name: 'Sample test Team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 2,
    identifier: '2',
    active: true,
    name: 'Sample test Team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 3,
    identifier: '3',
    active: true,
    name: 'Sample test Team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 4,
    identifier: '4',
    active: true,
    name: 'Sample test Team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 5,
    identifier: '5',
    active: true,
    name: 'test team 11',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 6,
    identifier: '6',
    active: true,
    name: 'sample test 1',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 7,
    identifier: '7',
    active: true,
    name: 'test team 1',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 8,
    identifier: '8',
    active: true,
    name: 'asdasd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 9,
    identifier: '9',
    active: true,
    name: 'asdasd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 10,
    identifier: '10',
    active: true,
    name: 'asdasd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 11,
    identifier: '11',
    active: true,
    name: 'test again',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 12,
    identifier: '12',
    active: true,
    name: 'test again',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 13,
    identifier: '13',
    active: true,
    name: 'test again',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 14,
    identifier: '14',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 15,
    identifier: '15',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 16,
    identifier: '16',
    active: true,
    name: 'asd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 17,
    identifier: '17',
    active: true,
    name: 'asd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 18,
    identifier: '18',
    active: true,
    name: 'asd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 19,
    identifier: '19',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 20,
    identifier: '20',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 21,
    identifier: '21',
    active: true,
    name: 'test new',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 22,
    identifier: '22',
    active: true,
    name: 'test new',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 23,
    identifier: '23',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 24,
    identifier: '24',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 25,
    identifier: '25',
    active: true,
    name: 'test new',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 26,
    identifier: '26',
    active: true,
    name: 'test new',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 27,
    identifier: '27',
    active: true,
    name: 'testing new',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 28,
    identifier: '28',
    active: true,
    name: '',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 29,
    identifier: '29',
    active: true,
    name: 'asd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 30,
    identifier: '30',
    active: true,
    name: 'asd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 31,
    identifier: '31',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 32,
    identifier: '32',
    active: true,
    name: '',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 33,
    identifier: '33',
    active: true,
    name: 'asd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 34,
    identifier: '34',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 35,
    identifier: '35',
    active: true,
    name: 'test',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 36,
    identifier: '36',
    active: true,
    name: 'asd',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 37,
    identifier: '37',
    active: true,
    name: 'Sample test Team 2',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 38,
    identifier: '38',
    active: true,
    name: 'Sample test Team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
  {
    id: 39,
    identifier: '39',
    active: true,
    name: 'Test Test Team',
    type: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/team-type',
          code: 'team',
          display: 'Team',
        },
      ],
    },
  },
];
