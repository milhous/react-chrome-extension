import {createSlice} from '@reduxjs/toolkit';
import {IAppState} from './types';

// 初始化状态
export const initialState: IAppState = {
  isLaunch: false,
  isConnected: false,
  isOnboarding: false,
  isFirstTime: false,
  isInitialized: false,
  isUnlocked: false,
  env: '',
  address: '',
  mnemonicWords: '',
  privateKey: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    update: (state, action) => {
      const {payload} = action;

      for (const key in payload) {
        state[key] = payload[key];
      }
    },
  },
});

export const {update} = appSlice.actions;

export default appSlice.reducer;
