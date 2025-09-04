import { create } from 'zustand';
import { AuthState, AdminUser } from '../types';
import { supabase } from '../lib/supabase';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Create admin user object from Supabase user
        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name || data.user.email || '',
          role: data.user.user_metadata?.role || 'admin'
        };
        
        set({ user: adminUser, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName,
            role: 'admin'
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || '',
          fullName: fullName,
          role: 'admin'
        };
        
        set({ user: adminUser, isAuthenticated: true, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email || '',
          role: session.user.user_metadata?.role || 'admin'
        };
        
        set({ user: adminUser, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ user: null, isAuthenticated: false });
    }
  },
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const adminUser: AdminUser = {
      id: session.user.id,
      email: session.user.email || '',
      fullName: session.user.user_metadata?.full_name || session.user.email || '',
      role: session.user.user_metadata?.role || 'admin'
    };
    
    useAuthStore.setState({ user: adminUser, isAuthenticated: true });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  }
});