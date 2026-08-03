export { store } from '../app/store';
export type { RootState, AppDispatch } from '../app/store';
export { default as authSlice, loginUserThunk, logoutUserThunk, setRole } from '../auth/store/authSlice';
export { default as adminSlice } from '../features/admin/store/adminSlice';
export { default as hrSlice } from '../features/hr/store/hrSlice';
