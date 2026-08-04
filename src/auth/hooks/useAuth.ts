import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { loginUserThunk, logoutUserThunk, logoutAction, setRole, clearError } from '../store/authSlice';
import { Role } from '../../security/roles/roles';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const login = (email: string) => dispatch(loginUserThunk(email));
  
  const logout = () => {
    authService.logout();
    dispatch(logoutAction());
    dispatch(logoutUserThunk());
  };

  const switchRole = (role: Role) => dispatch(setRole(role));
  const dismissError = () => dispatch(clearError());

  return {
    ...authState,
    login,
    logout,
    switchRole,
    dismissError,
    role: authState.user?.role || Role.EMPLOYEE,
    permissions: authState.user?.permissions || [],
  };
};
