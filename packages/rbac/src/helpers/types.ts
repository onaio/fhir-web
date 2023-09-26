import { UserRole } from '../roleDefinition';

export interface RbacAdapter {
  (roles: unknown): UserRole;
}

export type Valueof<T> = T[keyof T];

export type MatchStrategy = 'all' | 'any';
