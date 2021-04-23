import { KeycloakUserGroup } from '../../../ducks/userGroups';

export const userGroups: KeycloakUserGroup[] = [
  { id: '283c5d6e-9b83-4954-9f3b-4c2103e4370c', name: 'Admin', path: '/Admin', subGroups: [] },
  {
    id: '4dd15e66-7132-429b-8939-d1e601611464',
    name: 'New Group',
    path: '/New Group',
    subGroups: [],
  },
  {
    id: '580c7fbf-c201-4dad-9172-1df9faf24936',
    name: 'Super User',
    path: '/Super User',
    subGroups: [],
  },
  {
    id: '2fffbc6a-528d-4cec-aa44-97ef65b9bba2',
    name: 'Test User Group',
    path: '/Test User Group',
    subGroups: [],
  },
];

export const userGroup: KeycloakUserGroup = {
  id: '283c5d6e-9b83-4954-9f3b-4c2103e4370c',
  name: 'Admin',
  path: '/Admin',
  subGroups: [],
};
