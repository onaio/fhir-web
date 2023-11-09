import { Valueof } from './helpers/types';

export enum Permit {
  CREATE = 0b0001,
  READ = 0b0010,
  UPDATE = 0b0100,
  DELETE = 0b1000,
  MANAGE = 0b1111,
}

/**
 * Authorization server resources that this web client is familiar with, thus we can enforce rbac for permissions on views that
 * deal with the below resource.
 */
export const IamResources = ['iam_user', 'iam_role', 'iam_group'] as const;
export type IamResource = typeof IamResources[number];

/**
 * fhir hapi Server resources that this web client is familiar with, thus we can enforce rbac for permissions on views that
 * deal with the below resource.
 */
export const FhirResources = [
  'Patient',
  'Practitioner',
  'PractitionerRole',
  'Group',
  'Organization',
  'OrganizationAffiliation',
  'HealthcareService',
  'Location',
  'Observation',
  'QuestionnaireResponse',
  'CareTeam',
  'PlanDefinition',
  'Questionnaire',
  'PractitionerDetail',
] as const;
export type FhirResource = typeof FhirResources[number];

export type AuthZResource = IamResource | FhirResource;
export type BinaryNumber = number;
export type PermitKey = keyof typeof Permit;
export type PermitKeyValues = Valueof<typeof Permit>;
export type ResourcePermitMap = Map<AuthZResource, number>;
