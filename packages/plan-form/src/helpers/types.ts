import {
  PlanDefinition,
  EnvConfig,
  PlanFormFields as BasePlanFormFields,
} from '@opensrp/plan-form-core';
import dayjs from 'dayjs';

/** called before submission starts, return true to proceed with submission */
export type BeforeSubmit = (payload: PlanDefinition) => boolean;

/** called after submission is successful */
export type AfterSubmit = (payload: PlanDefinition) => void;

export type PlanFormConfig = EnvConfig;

export type PlanFormFields = Omit<BasePlanFormFields, 'start' | 'end'> & {
  dateRange: (dayjs.Dayjs | undefined)[];
};

export type PlanFormFieldsKeys = keyof PlanFormFields;
