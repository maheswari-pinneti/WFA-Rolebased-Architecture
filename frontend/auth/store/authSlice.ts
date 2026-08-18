import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { Role } from '../../security/roles/roles';

const initialSession = authService.getStoredSession();

const initialState: AuthState = {
  user: initialSession ? initialSession.user : null,
  token: initialSession ? initialSession.token : null,
  isAuthenticated: Boolean(initialSession),
  isLoading: false,
  error: null,
};

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password?: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const logoutUserThunk = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await authService.logout();
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logoutAction: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    loginSuccessAction: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const payloadUser = action.payload?.user;
      if (!payloadUser) {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = 'The server returned an incomplete user session. Please sign in again.';
        return;
      }
      if (!Object.values(Role).includes(payloadUser.role)) {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = 'The server returned an invalid role. Please sign in again.';
        return;
      }
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = {
        ...payloadUser,
        permissions: Array.isArray(payloadUser.permissions) ? payloadUser.permissions : []
      };
      state.token = action.payload.token;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as any;
        if (payload && payload.requiresMfa) {
          state.isAuthenticated = false;
        } else if (!payload?.user || !Object.values(Role).includes(payload.user.role)) {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.error = 'The server returned an invalid user session. Please sign in again.';
        } else {
          state.isAuthenticated = true;
          state.user = payload?.user ? {
            ...payload.user,
            permissions: Array.isArray(payload.user.permissions) ? payload.user.permissions : []
          } : null;
          state.token = payload ? payload.token : null;
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearError, logoutAction, loginSuccessAction } = authSlice.actions;
export default authSlice.reducer;
