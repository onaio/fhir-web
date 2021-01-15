import { createSelector, Store, createSlice, PayloadAction } from '@reduxjs/toolkit';
export const configsSliceName = 'configs';

export interface ConfigState {
  [key: string]: string;
}

export const defaultConfigState: ConfigState = {};

export const configsSlice = createSlice({
  name: configsSliceName,
  initialState: defaultConfigState,
  reducers: {
    addConfigs(state, action: PayloadAction<ConfigState>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

const getConfigsState = (state: Partial<Store>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (state as any)[configsSliceName];
};

export const getConfigsFactory = () => createSelector(getConfigsState, (state) => state);

export const { addConfigs } = configsSlice.actions;
export const { reducer: configsReducer } = configsSlice;
