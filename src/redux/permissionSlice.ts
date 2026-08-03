import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Permission } from '../security/permissions/permissions';

export interface PermissionState {
  permissions: Permission[];
}

const initialState: PermissionState = {
  permissions: Object.values(Permission),
};

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermissions: (state, action: PayloadAction<Permission[]>) => {
      state.permissions = action.payload;
    },
  },
});

export const { setPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;
