import { StepKey, WizardState } from './types';

export const initialState: WizardState = {};

type Action = { type: 'SAVE_STEP'; step: StepKey; values: unknown };

export const wizardReducer = (state: WizardState, action: Action): WizardState => {
  switch (action.type) {
    case 'SAVE_STEP':
      return { ...state, [action.step]: action.values };
    default:
      return state;
  }
};