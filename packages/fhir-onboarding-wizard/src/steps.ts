import { StepKey, StepConfig } from './types';

import { OrganizationStepAdapter } from './components/StepAdapters/OrganizationStepAdapter';

export const steps: StepConfig[] = [
  {
    key: StepKey.ORGANIZATION,
    title: 'Organization',
    component: OrganizationStepAdapter,
    requiredPermissions: ['Organization.create'],
  }
];