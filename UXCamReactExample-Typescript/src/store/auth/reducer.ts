import {createAction, createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export const resetState = createAction('RESET-STATE');

export interface AuthState {
  appkey: string;
  username: string;
}

const initialState: AuthState = {
  appkey: '',
  username: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    start: (state, {payload}: PayloadAction<AuthState>) => {
      state.appkey = payload.appkey;
      state.username = payload.username;
    },
    stop: state => {
      state.appkey = '';
      state.username = '';
    },
  },
  extraReducers: builder => {
    builder.addCase(resetState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const {start, stop} = authSlice.actions;

export default authSlice.reducer;
