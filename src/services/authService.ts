import { AdminUser } from '../types';
import { supabase } from '../lib/supabase';

export class AuthService {
  static async loginAdmin(email: string, password: string): Promise<AdminUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        // Map Supabase errors to user-friendly messages
        let errorMessage = error.message;
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and confirm your account';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait before trying again';
        } else if (error.status === 400) {
          errorMessage = 'Invalid login credentials. Please check your email and password';
        }
        
        throw new Error(errorMessage);
      }

      if (!data.user) {
        throw new Error('Authentication failed - no user data received');
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        fullName: data.user.user_metadata?.full_name || data.user.email || '',
        role: data.user.user_metadata?.role || 'admin'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during login');
    }
  }

  static async registerAdmin(email: string, password: string, fullName: string): Promise<AdminUser> {
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
        // Map Supabase errors to user-friendly messages
        let errorMessage = error.message;
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long';
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = 'Please enter a valid email address';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Account registration is currently disabled';
        } else if (error.status === 400) {
          errorMessage = 'Registration failed. Please check your information and try again';
        }
        
        throw new Error(errorMessage);
      }

      if (!data.user) {
        throw new Error('Registration failed - no user data received');
      }

      return {
        id: data.user.id,
        email: data.user.email || '',
        fullName: fullName,
        role: 'admin'
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred during registration');
    }
  }

  static async logoutAdmin(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  static async getCurrentAdmin(): Promise<AdminUser | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      fullName: session.user.user_metadata?.full_name || session.user.email || '',
      role: session.user.user_metadata?.role || 'admin'
    };
  }
}