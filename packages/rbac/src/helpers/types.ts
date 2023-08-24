import { UserRole } from '../roleDefinition';

export interface RbacAdapter {
  (roles: string[]): UserRole;
}

export type Valueof<T> = T[keyof T];
