import { StepKey, StepConfig } from './types';

import { OrganizationStepAdapter } from './components/StepAdapters/OrganizationStepAdapter';
import { CareTeamStepAdapter } from './components/StepAdapters/CareteamStepAdapter';
import { LocationStepAdapter } from './components/StepAdapters/LocationStepAdapter';
import { UserStepAdapter } from './components/StepAdapters/UserStepAdapter';
import { checkCareTeam, checkLocation, checkOrganization, checkUser } from './components/utils/duplicateChecks';

export const steps: StepConfig[] = [
      {
    key: StepKey.LOCATION,
    title: 'Location',
    component: LocationStepAdapter, 
    requiredPermissions: ['Location.create'],
    findDuplicate: checkLocation,
  },
    {
    key: StepKey.USERS,
    title: 'Users',
    component: UserStepAdapter, // <-- wire up
    requiredPermissions: ['iam_user.create', 'Practitioner.create'],
    findDuplicate: checkUser,
  },
  {
    key: StepKey.ORGANIZATION,
    title: 'Organization',
    component: OrganizationStepAdapter,
    requiredPermissions: ['Organization.create'],
    findDuplicate: checkOrganization,
  },
  {
    key: StepKey.CARE_TEAM,
    title: 'Care Team',
    component: CareTeamStepAdapter,
    requiredPermissions: ['CareTeam.create'],
    findDuplicate: checkCareTeam,
  },
];
