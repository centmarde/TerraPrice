import { create } from 'zustand';
import { toast } from 'react-toastify';
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
        // Enhanced error handling for common authentication errors
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account before logging in';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait before trying again';
        }
        
        throw new Error(errorMessage);
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
        // Enhanced error handling for common registration errors
        let errorMessage = error.message;
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long';
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = 'Please enter a valid email address';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Account registration is currently disabled';
        }
        
        throw new Error(errorMessage);
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
    toast.success('You have been logged out successfully.');
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
supabase.auth.onAuthStateChange((event: string, session) => {
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