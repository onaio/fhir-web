import { StepKey, StepConfig } from './types';

import { OrganizationStepAdapter } from './components/StepAdapters/OrganizationStepAdapter';
import { CareTeamStepAdapter } from './components/StepAdapters/CareteamStepAdapter';

export const steps: StepConfig[] = [
  {
    key: StepKey.ORGANIZATION,
    title: 'Organization',
    component: OrganizationStepAdapter,
    requiredPermissions: ['Organization.create'],
  },
  {
    key: StepKey.CARE_TEAM,
    title: 'Care Team',
    component: CareTeamStepAdapter,
    requiredPermissions: ['CareTeam.create'],
  },
];
