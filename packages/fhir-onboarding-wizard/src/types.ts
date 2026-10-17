import type { OrganizationFormFields } from '@opensrp/fhir-team-management';
import type { CareTeamFormFields } from '@opensrp/fhir-care-team';
import { ILocation } from '@smile-cdr/fhirts/dist/FHIR-R4/interfaces/ILocation';
import { FormFields } from '@opensrp/user-management';
import type { DuplicateCheck } from '../src/components/utils/duplicateChecks';

export enum StepKey {
  LOCATION = 'location',
  ORGANIZATION = 'organization',
  CARE_TEAM = 'careTeam',
  USERS = 'users',
}

export type OrganizationFormValues = OrganizationFormFields;
export type CareTeamFormValues = CareTeamFormFields;
export type LocationFormValues = ILocation;
export type UserFormValues = FormFields;

export interface WizardState {
  [StepKey.LOCATION]?: LocationFormValues;
   [StepKey.USERS]?: UserFormValues[];
  [StepKey.ORGANIZATION]?: OrganizationFormValues;
  [StepKey.CARE_TEAM]?: CareTeamFormValues;
}

export interface StepConfig {
  key: StepKey;
  title: string;
  component: React.ComponentType<any>;
  requiredPermissions: string[];
  findDuplicate?: DuplicateCheck;
}
