import { createSelector, Store, createSlice, PayloadAction } from '@reduxjs/toolkit';
export const sliceName = 'configs';

export interface ConfigState {
  [key: string]: string;
}

export const defaultConfigState: ConfigState = {};

export const configsSlice = createSlice({
  name: sliceName,
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
  return (state as any)[sliceName];
};

export const getConfigsFactory = () => createSelector(getConfigsState, (state) => state);

export const { addConfigs } = configsSlice.actions;
export const { reducer } = configsSlice;
