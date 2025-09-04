import { create } from 'zustand';
import { AuthState, AdminUser } from '../types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Implement actual authentication with Supabase
      // For now, simulate admin login
      if (email.trim() === 'admin@terraprice.com' && password.trim() === 'admin123') {
        const adminUser: AdminUser = {
          id: '1',
          email,
          fullName: 'Admin User',
          role: 'admin'
        };
        localStorage.setItem('terraprice_admin', JSON.stringify(adminUser));
        set({ user: adminUser, isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('terraprice_admin');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const stored = localStorage.getItem('terraprice_admin');
    if (stored) {
      const user = JSON.parse(stored);
      set({ user, isAuthenticated: true });
    }
  },
}));