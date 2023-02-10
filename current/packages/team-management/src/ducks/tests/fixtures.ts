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

const assignment1 = {
  organizationId: null,
  jurisdictionId: 'noOrganization',
  planId: '335ef7a3-7f35-58aa-8263-4419464946d8',
  fromDate: 1600128000000,
  toDate: 1600128000000,
};

const assignment2 = {
  organizationId: 'validAsignment',
  jurisdictionId: 'null',
  planId: '335ef7a3-7f35-58aa-8263-4419464946d8',
  fromDate: 1600128000000,
  toDate: 1600128000000,
};

export const assignments = [assignment1, assignment2];
export const practitioners = [
  {
    identifier: '390d8961-65d6-41e7-9c2b-c20fdd71b923',
    active: true,
    name: 'Test11 Eleven',
    userId: 'ff2e15be-b4d8-4065-9a92-f6829b9e1cfd',
    username: 'test11',
    dateCreated: 1644219812336,
    dateEdited: 1644219812336,
    serverVersion: 5,
  },
  {
    identifier: '39c178b3-8cd4-434c-a597-74f17200ccda',
    active: true,
    name: 'Gareth Graham',
    userId: '0e9e8304-2c1b-42c5-a673-a91eafc67970',
    username: 'ggraham',
    dateCreated: 1644219812336,
    dateEdited: 1644219812336,
    serverVersion: 12,
  },
  {
    identifier: '296a9687-c7fe-4571-8b70-f6aa14e7990c',
    active: true,
    name: 'Demo dev User',
    userId: '821f587d-734f-4263-8d50-ec37f2e84ef4',
    username: 'demo',
    dateCreated: 1644219812336,
    dateEdited: 1644219812336,
    serverVersion: 14,
  },
];
