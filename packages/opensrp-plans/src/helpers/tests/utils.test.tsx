import {
  ACTIVE_PLANS_LIST_VIEW_URL,
  COMPLETE_PLANS_LIST_VIEW_URL,
  DRAFT_PLANS_LIST_VIEW_URL,
  OPENSRP_API_BASE_URL,
  SORT_BY_EFFECTIVE_PERIOD_START_FIELD,
  RETIRED_PLANS_LIST_VIEW_URL,
} from '../../constants';
import * as planDefinitionFixtures from '../../ducks/planDefinitions/tests/fixtures';
import { InterventionType, PlanDefinition, PlanStatus } from '@opensrp-web/plan-form-core';
import {
  descendingOrderSort,
  isPlanDefinitionOfType,
  getPlanType,
  BuildDownloadUrl,
} from '../utils';
import { redirectPathGetter } from '../common';

describe('helpers/utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sorts plans array in descending order', () => {
    const sortedPlans = descendingOrderSort(
      planDefinitionFixtures.eusmPlans as PlanDefinition[],
      SORT_BY_EFFECTIVE_PERIOD_START_FIELD
    );
    expect(sortedPlans).toEqual(planDefinitionFixtures.eusmPlans);
  });
  it('returns unsorted plans array', () => {
    const unsortedPlans = descendingOrderSort(planDefinitionFixtures.plans as PlanDefinition[], '');
    expect(unsortedPlans).toEqual(planDefinitionFixtures.plans);
  });

  it('returns plan type', () => {
    const type = getPlanType(planDefinitionFixtures.plans[0] as PlanDefinition);
    expect(type).toEqual('FI');
  });

  it('computes the interventionType of a planDefinition correctly', () => {
    const sampleFIPlan = planDefinitionFixtures.plans[0];
    let result = isPlanDefinitionOfType(sampleFIPlan, InterventionType.FI);
    expect(result).toBeTruthy();
    result = isPlanDefinitionOfType(sampleFIPlan, InterventionType.IRS);
    expect(result).toBeFalsy();
    const sampleIRSPlan = planDefinitionFixtures.plans[1];
    result = isPlanDefinitionOfType(sampleIRSPlan, InterventionType.FI);
    expect(result).toBeFalsy();
    result = isPlanDefinitionOfType(sampleIRSPlan, InterventionType.IRS);
    expect(result).toBeTruthy();
  });

  it('computes the interventionType of a planDefinition correctly with many interventionTypes', () => {
    const sampleFIPlan = planDefinitionFixtures.plans[0];
    let result = isPlanDefinitionOfType(sampleFIPlan, [InterventionType.FI, InterventionType.IRS]);
    expect(result).toBeTruthy();
    result = isPlanDefinitionOfType(sampleFIPlan, [
      InterventionType.IRS,
      InterventionType.DynamicFI,
    ]);
    expect(result).toBeFalsy();
    const sampleIRSPlan = planDefinitionFixtures.plans[1];
    result = isPlanDefinitionOfType(sampleIRSPlan, [
      InterventionType.FI,
      InterventionType.DynamicMDA,
    ]);
    expect(result).toBeFalsy();
    result = isPlanDefinitionOfType(sampleIRSPlan, InterventionType.IRS);
    expect(result).toBeTruthy();
  });
  it('tests redirectGetter util', () => {
    expect(redirectPathGetter(PlanStatus.DRAFT)).toEqual(DRAFT_PLANS_LIST_VIEW_URL);
    expect(redirectPathGetter()).toEqual(DRAFT_PLANS_LIST_VIEW_URL);
    expect(redirectPathGetter(PlanStatus.ACTIVE)).toEqual(ACTIVE_PLANS_LIST_VIEW_URL);
    expect(redirectPathGetter(PlanStatus.COMPLETE)).toEqual(COMPLETE_PLANS_LIST_VIEW_URL);
    expect(redirectPathGetter(PlanStatus.RETIRED)).toEqual(RETIRED_PLANS_LIST_VIEW_URL);
  });
  it('tests BuildDownloadUrl', () => {
    expect(BuildDownloadUrl(OPENSRP_API_BASE_URL, '123')).toEqual(
      'https://opensrp-stage.smartregister.org/opensrp/rest/event/export-data?eventTypes=flag_problem,service_point_check,looks_good,record_gps&planIdentifier=123'
    );
  });
});
