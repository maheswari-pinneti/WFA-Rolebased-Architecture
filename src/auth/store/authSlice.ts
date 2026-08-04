import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { Role } from '../../security/roles/roles';
import { PERMISSION_MATRIX } from '../../security/policies/permissionMatrix';
import usersData from '../../mocks/data/users.json';

const initialSession = authService.getStoredSession();
const defaultUser = (usersData as User[])[0]; // Admin by default for seamless initial view

const initialState: AuthState = {
  user: initialSession ? initialSession.user : defaultUser,
  token: initialSession ? initialSession.token : 'default-demo-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (email: string, { rejectWithValue }) => {
    try {
      const data = await authService.login(email);
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
    setRole: (state, action: PayloadAction<Role>) => {
      if (state.user) {
        state.user.role = action.payload;
        state.user.permissions = PERMISSION_MATRIX[action.payload] || [];
        localStorage.setItem('wfa_user_data', JSON.stringify(state.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    logoutAction: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
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
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
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

export const { setRole, clearError, logoutAction } = authSlice.actions;
export default authSlice.reducer;
