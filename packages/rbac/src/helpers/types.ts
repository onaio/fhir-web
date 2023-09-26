import { UserRole } from '../roleDefinition';

export interface RbacAdapter {
  (roles: any): UserRole;
}

export type Valueof<T> = T[keyof T];

export type MatchStrategy = 'all' | 'any';
