import {
  PlanDefinition,
  EnvConfig,
  PlanFormFields as BasePlanFormFields,
} from '@opensrp-web/plan-form-core';
import { Moment } from 'moment';

/** called before submission starts, return true to proceed with submission */
export type BeforeSubmit = (payload: PlanDefinition) => boolean;

/** called after submission is successful */
export type AfterSubmit = (payload: PlanDefinition) => void;

export type PlanFormConfig = EnvConfig;

export type PlanFormFields = Omit<BasePlanFormFields, 'start' | 'end'> & {
  dateRange: (Moment | undefined)[];
};

export type PlanFormFieldsKeys = keyof PlanFormFields;
