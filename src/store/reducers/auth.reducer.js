import { createSlice } from '@reduxjs/toolkit';

import { authActions } from '../actions';

const { reducer } = createSlice({
  name: 'auth',
  initialState: {
    user: {
      userToken: JSON.parse(localStorage.getItem('userToken')),
      userId: JSON.parse(localStorage.getItem('userId')),
      authExpiry: JSON.parse(localStorage.getItem('authExpiry')),
    },
    waiter: false,
    error: undefined,
  },
  extraReducers: (builder) => {
    builder
      .addCase(authActions.loginOrSignup.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(authActions.loginOrSignup.fulfilled, (state, action) => {
        state.waiter = false;
        state.user = {
          userToken: action.payload.auth_token.token,
          userId: action.payload.auth_token.user_id,
          authExpiry: action.payload.authExpiry,
        };
      })
      .addCase(authActions.loginOrSignup.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.payload.error?.user_authentication || action.payload.error;
      });

    builder
      .addCase(authActions.logout.pending, (state) => {
        state.waiter = true;
        state.error = undefined;
      })
      .addCase(authActions.logout.fulfilled, (state) => {
        state.waiter = false;
        state.user = {
          userToken: undefined,
          userId: undefined,
          authExpiry: undefined,
        };
      })
      .addCase(authActions.logout.rejected, (state, action) => {
        state.waiter = false;
        state.error = action.error;
      });
  },
});

export default reducer;
