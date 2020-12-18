import { Organization } from '..';

export const organization1: Organization = {
  active: true,
  id: 1,
  identifier: 'fcc19470-d599-11e9-bb65-2a2ae2dbcce4',
  name: 'The Luang',
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

export const organization2: Organization = {
  active: true,
  id: 3,
  identifier: '4c506c98-d3a9-11e9-bb65-2a2ae2dbcce4',
  name: 'Demo Team',
};

export const organization3: Organization = {
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
        system: 'http://terminology.hl7.org/CodeSystem/organization-type',
      },
    ],
  },
};

export const organizations: Organization[] = [organization1, organization2];
