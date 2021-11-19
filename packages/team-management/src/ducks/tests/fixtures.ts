import { Organization } from '../organizations';

export const org1: Organization = {
  active: true,
  id: 1,
  identifier: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
  name: 'The Luang',
  type: {
    coding: [
      {
        code: 'team',
        display: 'Team',
        system: 'http://terminology.hl7.org/CodeSystem/team-type',
      },
    ],
  },
};

export const org2: Organization = {
  active: true,
  id: 3,
  identifier: '4c506c98-d3a9-11e9-bb65-2a2ae2dbcce4',
  name: 'Demo Team',
};

export const org3: Organization = {
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
};

export const org1Assignment = [
  {
    identifier: '42a51b05-52f6-4d90-8335-87a08edd4924',
    active: true,
    name: 'julian kipembe',
    userId: '2f2c1fbd-b20b-4bba-aafd-de86f0f7aab3',
    username: 'kipembe',
  },
];

export const teamMember = {
  identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
  active: true,
  name: 'Team',
  userId: '1',
  username: 'name',
  code: { text: '' },
};

export const organizations: Organization[] = [org1, org2];
