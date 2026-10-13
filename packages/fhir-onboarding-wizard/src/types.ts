import type { OrganizationFormFields } from '@opensrp/fhir-team-management';

export enum StepKey {
  LOCATION = 'location',
  ORGANIZATION = 'organization',
  CARE_TEAM = 'careTeam',
  USERS = 'users',
}

export type OrganizationFormValues = OrganizationFormFields;

export interface WizardState {
  [StepKey.ORGANIZATION]?: OrganizationFormValues;
}

export interface StepConfig {
  key: StepKey;
  title: string;
  component: React.ComponentType<any>;
  requiredPermissions: string[];
}
