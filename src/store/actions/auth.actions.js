import { createAsyncThunk } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { authService } from 'src/services';

export const loginOrSignup = createAsyncThunk(
  'auth/login-or-signup',
  async (formData, { rejectWithValue }) => {
    try {
      const result = await authService.loginOrSignup(formData);

      localStorage.setItem('userToken', JSON.stringify(result.data.auth_token.token));
      localStorage.setItem('userId', JSON.stringify(result.data.auth_token.user_id));

      const authExpiry = dayjs().add(1, 'day').toString();
      localStorage.setItem('authExpiry', JSON.stringify(authExpiry));

      return { ...result.data, authExpiry };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('userToken');
  localStorage.removeItem('authExpiry');
});
