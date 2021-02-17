import { generatedMission1, generatedMissionForm1, mission1 } from './eusm.fixtures';
import { getPlanFormValues, generatePlanDefinition } from '../helpers';

describe('eusm plans tests', () => {
  it('generatePlanDefinition can get original planDefinition', () => {
    const generatedPlanForm = getPlanFormValues(mission1);
    expect(generatedPlanForm).toEqual(generatedMissionForm1);
    const generatedMission = generatePlanDefinition(generatedPlanForm, mission1);
    expect(generatedMission).toEqual(generatedMission1);
  });
});
