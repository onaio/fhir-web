/* eslint-disable @typescript-eslint/camelcase */
import { Organization } from '../../../ducks/organizations';
import { Practitioner } from '../../../ducks/practitioners';

export const accessToken = 'token';
export const id = '258b4dec-79d3-546d-9c5c-f172aa7e03b0';

export const team: Organization = {
  id: 1,
  identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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

export const practitioner: Practitioner[] = [
  {
    identifier: '718e2b7d-22d7-4c23-aaa7-62cca4b9e318',
    active: false,
    name: 'prac one',
    userId: '7306784c-64fb-4d45-990b-306863eb478b',
    username: 'prac_1',
  },
  {
    identifier: '24fe334a-4bbf-4698-99b8-1fa1a5a46d35',
    active: true,
    name: 'prac two',
    userId: 'e09deae4-50fe-40d4-8b5a-6f59683dbdba',
    username: 'prac2',
  },
];

export const intialValue = {
  name: team.name,
  active: team.active,
  practitioners: practitioner.map((prac) => prac.identifier),
};

export const teams: Organization[] = [
  {
    id: 39,
    identifier: '143f58b0-47ab-41b3-9de1-4ca227da7dee',
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
    id: 38,
    identifier: '091a90ed-890d-4bd6-930d-be1fa909737d',
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
    id: 37,
    identifier: '92494ccc-c2b0-49b1-ade8-69898dc9d707',
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
    id: 36,
    identifier: '0a8d47e0-f9f1-43b9-bf8d-2951b1887aff',
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
    id: 35,
    identifier: 'd9d1b572-5582-4a55-8160-c7b922f47702',
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
    id: 34,
    identifier: 'e9930f71-9895-401b-b3bd-ac2e9f75e701',
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
    id: 33,
    identifier: '1cc9a39a-f201-4c2f-b34d-50967c478817',
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
    id: 32,
    identifier: 'f74e1f3b-cfb7-4d10-a59e-d01b05b6c12a',
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
    id: 31,
    identifier: '21f84255-54d6-43ae-a1b6-d266c2ae943c',
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
    id: 30,
    identifier: '5c5ba346-2e2e-4a30-810e-92d5cc842c1a',
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
    id: 29,
    identifier: 'f9ee75b0-6042-4106-af89-d0c145709617',
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
    id: 28,
    identifier: '8e2426a2-0b05-47d2-af74-88694faca00e',
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
    id: 27,
    identifier: '199cf3e4-003f-4441-bc69-9bad691821c8',
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
    id: 26,
    identifier: 'a01d9f96-4a51-451d-af28-8c6cf313ebbe',
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
    identifier: 'a88cf059-8b84-4e05-9711-cf893afe67e3',
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
    identifier: '0f2c943d-6215-4e45-9729-67a7b2b37e4a',
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
    id: 23,
    identifier: 'a9c55fa8-0d56-4b16-9117-b13fc1c6d073',
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
    id: 22,
    identifier: '982029c8-c24c-4247-9c7b-461c707f76f7',
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
    id: 21,
    identifier: '74bf9d8c-5461-4e5c-a6c3-b54333394429',
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
    identifier: '628d126a-f430-49b1-b81c-b4a922b07a48',
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
    id: 19,
    identifier: '0d0318f9-fdcc-4e3f-af31-ca006c9eb233',
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
    id: 18,
    identifier: 'f26107fd-d4e3-489d-9869-14516d31a8b9',
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
    id: 17,
    identifier: 'b24d68fa-f905-4d78-b592-e713db4f73e3',
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
    identifier: 'f94759ef-57b4-48df-b12a-c11f56d2cae8',
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
    identifier: '2544a714-e115-499a-9bbb-cd7e9761c173',
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
    id: 14,
    identifier: '40d6f552-42b8-4975-bc42-7fd7c9763fc9',
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
    id: 13,
    identifier: '8d816df7-92da-47a4-be6c-d3b960c97933',
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
    id: 12,
    identifier: 'c4635fda-6342-4d65-97f6-dc5ada4fe252',
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
    id: 11,
    identifier: 'eb8aba24-42d4-499f-b77e-6467701df629',
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
    id: 10,
    identifier: '20c160e4-5248-4597-ac56-2ef7a5e09997',
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
    id: 9,
    identifier: '8c77df5f-5e69-4670-ba29-858d5fce5bae',
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
    id: 8,
    identifier: '5627961d-1f39-4556-bb1f-88525b0c7743',
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
    id: 7,
    identifier: 'aa3d1bcf-820a-462a-9137-b56b493bd6e0',
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
    id: 6,
    identifier: 'b9ed3cef-f802-4a55-8836-b3ef0e98c68f',
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
    id: 5,
    identifier: 'f7cb02b5-4d8c-4b8c-ad7c-de24b15776e5',
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
    id: 4,
    identifier: '7db7be9a-eccd-453e-a9a6-37a0f77a117f',
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
    id: 3,
    identifier: '1cb25782-89ec-4a35-8609-95729cc1035f',
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
    id: 2,
    identifier: '6f1de669-05c1-4b8b-90e3-0d47394e4644',
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
    id: 1,
    identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
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

export const practitioners: Practitioner[] = [
  {
    identifier: '24fe334a-4bbf-4698-99b8-1fa1a5a46d35',
    active: true,
    name: 'prac two',
    userId: 'e09deae4-50fe-40d4-8b5a-6f59683dbdba',
    username: 'prac2',
  },
  {
    identifier: '718e2b7d-22d7-4c23-aaa7-62cca4b9e318',
    active: false,
    name: 'prac one',
    userId: '7306784c-64fb-4d45-990b-306863eb478b',
    username: 'prac_1',
  },
  {
    identifier: '63f82d06-5b93-4668-b25c-77ce23a6da1c',
    active: false,
    name: 'prac one',
    userId:
      'https://keycloak-stage.smartregister.org/auth/admin/realms/opensrp-web-stage/users/ae3b12b6-a111-4c0f-b3ac-aa005dcc1459',
    username: 'prac_one',
  },
  {
    identifier: 'a7bf0992-c6e1-4946-b70a-61474f249adb',
    active: false,
    name: 'Practitioner Two',
    userId: '',
    username: 'prac_two',
  },
  {
    identifier: '7a399660-e069-41f7-863c-9b52b3abd2d8',
    active: false,
    name: 'Practitioner One',
    userId: '',
    username: 'practitioner_one',
  },
  {
    identifier: '030eecb4-d1d2-491b-9655-fbb869a610ff',
    active: true,
    name: 'Benjamin Mulyungi',
    userId: '97f36061-52fb-4474-88f2-fd286311ff1d',
    username: 'mwalimu',
  },
  {
    identifier: '398d28f1-85d1-4ce1-b5f1-19676e544e8f',
    active: true,
    name: 'test admin',
    userId: 'bb5aa312-1e7f-4ef8-81bb-34636aa1877c',
    username: 'admin-2',
  },
];
