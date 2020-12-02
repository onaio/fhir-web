import { PlanDefinition, EnvConfig } from '@opensrp/planform-core';

/** called before submission starts, return true to proceed with submission */
export type BeforeSubmit = (payload: PlanDefinition) => boolean;

/** called after submission is successful */
export type AfterSubmit = (payload: PlanDefinition) => void;

export type PlanFormConfig = EnvConfig;
