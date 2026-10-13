import type { OrganizationFormFields } from '@opensrp/fhir-team-management';
import type { CareTeamFormFields } from '@opensrp/fhir-care-team';

export enum StepKey {
  LOCATION = 'location',
  ORGANIZATION = 'organization',
  CARE_TEAM = 'careTeam',
  USERS = 'users',
}

export type OrganizationFormValues = OrganizationFormFields;
export type CareTeamFormValues =CareTeamFormFields

export interface WizardState {
  [StepKey.ORGANIZATION]?: OrganizationFormValues;
  [StepKey.CARE_TEAM]?: CareTeamFormValues;
}

export interface StepConfig {
  key: StepKey;
  title: string;
  component: React.ComponentType<any>;
  requiredPermissions: string[];
}
