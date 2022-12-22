import { configureStore } from '@reduxjs/toolkit';

import { authReducer, dataReducer } from './reducers';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
  },
  devTools: process.env.NODE_ENV === 'development',
});
