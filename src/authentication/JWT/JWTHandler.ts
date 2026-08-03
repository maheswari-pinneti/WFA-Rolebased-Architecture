import { attachAuthInterceptor } from '../../api/interceptors/authInterceptor';
import { LOCAL_STORAGE_KEYS } from '../../shared/constants/constants';

export class JWTHandler {
  public static getToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  }

  public static setToken(token: string): void {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
  }

  public static removeToken(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  }

  public static getInterceptor() {
    return attachAuthInterceptor;
  }
}
