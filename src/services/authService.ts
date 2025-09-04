import { AdminUser } from '../types';
import { supabase } from '../lib/supabase';

export class AuthService {
  static async loginAdmin(email: string, password: string): Promise<AdminUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Authentication failed');
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      fullName: data.user.user_metadata?.full_name || data.user.email || '',
      role: data.user.user_metadata?.role || 'admin'
    };
  }

  static async registerAdmin(email: string, password: string, fullName: string): Promise<AdminUser> {
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

    if (!data.user) {
      throw new Error('Registration failed');
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      fullName: fullName,
      role: 'admin'
    };
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