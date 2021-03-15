import { generatedMissionForm1, mission1 } from './eusm.fixtures';
import { getPlanFormValues, generatePlanDefinition } from '../helpers';
import { PlanDefinition } from '../../formHelpers/types';

describe('eusm plans tests', () => {
  it('generatePlanDefinition can get original planDefinition', () => {
    const generatedPlanForm = getPlanFormValues(mission1 as PlanDefinition);
    expect(generatedPlanForm).toEqual(generatedMissionForm1);
    const generatedMission = generatePlanDefinition(generatedPlanForm, mission1);
    const regeneratedMission = { ...mission1, version: 2 };
    delete regeneratedMission.serverVersion;
    expect(generatedMission).toEqual(regeneratedMission);
  });
});
