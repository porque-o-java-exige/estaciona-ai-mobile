import * as SecureStore from 'expo-secure-store';
import { AuthUser } from '@/features/auth/types/auth.types';

const TOKEN_KEY = 'estaciona_ai.auth_token';
const USER_KEY = 'estaciona_ai.auth_user';

export interface StoredSession {
  token: string;
  user: AuthUser;
}

export const tokenStorage = {
  async saveSession(session: StoredSession): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, session.token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(session.user)),
    ]);
  },

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },

  async getSession(): Promise<StoredSession | null> {
    const [token, rawUser] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEY),
      SecureStore.getItemAsync(USER_KEY),
    ]);

    if (!token || !rawUser) {
      return null;
    }

    try {
      const user = JSON.parse(rawUser) as AuthUser;
      return { token, user };
    } catch {
      await this.clearSession();
      return null;
    }
  },

  async clearSession(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },
};