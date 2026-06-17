import { create } from 'zustand';

export interface UserProfile {
  id: string | number;
  username: string;
  discriminator?: string;
  avatarUrl: string;
  nickname?: string;
}

export interface RegisteredProfile {
  roles: string[];
  agents: { name: string; iconUrl: string }[];
  intro: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
  registeredProfile: RegisteredProfile | null;
  isLoading: boolean;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  setRegisteredProfile: (profile: RegisteredProfile) => void;
  setLoading: (isLoading: boolean) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  registeredProfile: null,
  isLoading: false,
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ isAuthenticated: true, user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null, token: null, registeredProfile: null });
  },
  setRegisteredProfile: (profile) => set({ registeredProfile: profile }),
  setLoading: (isLoading) => set({ isLoading }),
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      // Dynamic import to prevent circular dependency at startup
      const { getMe } = await import('../api/auth');
      const userRes = await getMe();
      set({
        user: {
          id: userRes.id,
          username: userRes.username,
          discriminator: userRes.discriminator || '',
          avatarUrl: userRes.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png',
          nickname: userRes.nickname || userRes.username,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to restore auth session:', error);
      localStorage.removeItem('token');
      set({ token: null, isAuthenticated: false, user: null, isLoading: false });
    }
  },
}));
