import { create } from 'zustand';
import { AuthUser, LoginResponse } from '@/features/auth/types/auth.types';
import { tokenStorage } from '@/storage/token-storage';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (response: LoginResponse) => Promise<void>;
  clearSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isHydrated: false,

  hydrate: async () => {
    try {
      const session = await tokenStorage.getSession();

      if (session) {
        set({
          token: session.token,
          user: session.user,
          isAuthenticated: true,
        });
        return;
      }

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    } catch {
      await tokenStorage.clearSession();
      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isHydrated: true });
    }
  },

  setSession: async (response) => {
    const user: AuthUser = {
      id: response.userId,
      name: response.name,
      email: response.email,
    };

    await tokenStorage.saveSession({
      token: response.token,
      user,
    });

    set({
      token: response.token,
      user,
      isAuthenticated: true,
    });
  },

  clearSession: async () => {
    await tokenStorage.clearSession();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));