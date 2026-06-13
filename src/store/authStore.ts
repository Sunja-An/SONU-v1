import { create } from 'zustand';

interface UserProfile {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
}

interface RegisteredProfile {
  roles: string[];
  agents: { name: string; iconUrl: string }[];
  intro: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  registeredProfile: RegisteredProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  setRegisteredProfile: (profile: RegisteredProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  registeredProfile: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
  setRegisteredProfile: (profile) => set({ registeredProfile: profile }),
}));
