import { SORT_BY_EFFECTIVE_PERIOD_START_FIELD } from '../../constants';
import * as planDefinitionFixtures from '../../ducks/tests/fixtures';
import { InterventionType, Plan } from '../../ducks/index';
import { plan1, plan99, sortedPlansArray } from './fixtures';
import { descendingOrderSort, isPlanDefinitionOfType } from '../utils';

describe('helpers/utils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sorts plans array in descending order', () => {
    const sortedPlans = descendingOrderSort(
      [plan99, plan1] as Plan[],
      SORT_BY_EFFECTIVE_PERIOD_START_FIELD
    );
    expect(sortedPlans).toEqual(sortedPlansArray);
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
});
