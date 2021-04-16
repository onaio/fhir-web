import { Organization } from '../organizations';

export const org1: Organization = {
  active: true,
  id: '1',
  identifier: [{ use: 'official', value: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4' }],
  name: 'The Luang',
  resourceType: 'Organization',
};

export const org2: Organization = {
  active: true,
  resourceType: 'Organization',
  id: '3',
  identifier: [{ use: 'official', value: '4c506c98-d3a9-11e9-bb65-2a2ae2dbcce4' }],
  name: 'Demo Team',
};

export const org3: Organization = {
  active: true,
  id: '2',
  identifier: [{ use: 'official', value: 'd23f7350-d406-11e9-bb65-2a2ae2dbcce4' }],
  name: 'Takang 1',
  resourceType: 'Organization',
};

export const teamMember = {
  identifier: '258b4dec-79d3-546d-9c5c-f172aa7e03b0',
  active: true,
  name: 'Team',
  userId: '1',
  username: 'name',
  code: { text: '' },
};

export const organizations: Organization[] = [org1, org2];
