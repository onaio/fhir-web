import { StepKey, StepConfig } from './types';

import { OrganizationStepAdapter } from './components/StepAdapters/OrganizationStepAdapter';
import { CareTeamStepAdapter } from './components/StepAdapters/CareteamStepAdapter';
import { LocationStepAdapter } from './components/StepAdapters/LocationStepAdapter';
import { UserStepAdapter } from './components/StepAdapters/UserStepAdapter';

export const steps: StepConfig[] = [
      {
    key: StepKey.LOCATION,
    title: 'Location',
    component: LocationStepAdapter, 
    requiredPermissions: ['Location.create'],
  },
    {
    key: StepKey.USERS,
    title: 'Users',
    component: UserStepAdapter, // <-- wire up
    requiredPermissions: ['iam_user.create', 'Practitioner.create'],
  },
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
