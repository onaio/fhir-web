import { wizardReducer, initialState } from '../reducer';
import { StepKey } from '../types';

describe('wizardReducer', () => {
  it('saves a step under its key', () => {
    const values = [{ name: 'Org A' }];
    const next = wizardReducer(initialState, {
      type: 'SAVE_STEP',
      step: StepKey.ORGANIZATION,
      values,
    });
    expect(next[StepKey.ORGANIZATION]).toEqual(values);
  });

  it('replaces the saved values for a step', () => {
    const first = wizardReducer(initialState, {
      type: 'SAVE_STEP',
      step: StepKey.ORGANIZATION,
      values: [{ name: 'Old' }],
    });
    const second = wizardReducer(first, {
      type: 'SAVE_STEP',
      step: StepKey.ORGANIZATION,
      values: [{ name: 'New' }],
    });
    expect(second[StepKey.ORGANIZATION]).toEqual([{ name: 'New' }]);
  });

  it('keeps the other steps untouched', () => {
    const first = wizardReducer(initialState, {
      type: 'SAVE_STEP',
      step: StepKey.ORGANIZATION,
      values: [{ name: 'Org A' }],
    });
    const second = wizardReducer(first, {
      type: 'SAVE_STEP',
      step: StepKey.CARE_TEAM,
      values: [{ name: 'Team A' }],
    });
    expect(second[StepKey.ORGANIZATION]).toEqual([{ name: 'Org A' }]);
    expect(second[StepKey.CARE_TEAM]).toEqual([{ name: 'Team A' }]);
  });

  it('does not change the state it was given', () => {
    const before = { ...initialState };
    wizardReducer(initialState, { type: 'SAVE_STEP', step: StepKey.ORGANIZATION, values: [] });
    expect(initialState).toEqual(before);
  });
});