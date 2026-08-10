import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { loginUserThunk, logoutUserThunk, logoutAction, setRole, clearError, loginSuccessAction } from '../store/authSlice';
import { Role } from '../../security/roles/roles';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const login = (email: string) => dispatch(loginUserThunk(email));

  const verifyMfa = async (tempToken: string, code: string) => {
    const data = await authService.verifyMfa(tempToken, code);
    dispatch(loginSuccessAction(data));
  };
  
  const logout = () => {
    authService.logout();
    dispatch(logoutAction());
    dispatch(logoutUserThunk());
  };

  const switchRole = (_role: Role) => undefined;
  const dismissError = () => dispatch(clearError());

  return {
    ...authState,
    login,
    verifyMfa,
    logout,
    switchRole,
    dismissError,
    role: authState.user?.role || Role.EMPLOYEE,
    permissions: authState.user?.permissions || [],
  };
};
