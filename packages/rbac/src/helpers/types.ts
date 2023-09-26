import { UserRole } from '../roleDefinition';

export interface RbacAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (roles: any): UserRole;
}

export type Valueof<T> = T[keyof T];

export type MatchStrategy = 'all' | 'any';
