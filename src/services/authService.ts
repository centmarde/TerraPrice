import { AdminUser } from '../types';

export class AuthService {
  static async loginAdmin(email: string, password: string): Promise<AdminUser> {
    // TODO: Replace with actual Supabase authentication
    // This will integrate with Supabase Auth when connected
    
    if (email === 'admin@terraprice.com' && password === 'admin123') {
      return {
        id: '1',
        email,
        fullName: 'Admin User',
        role: 'admin'
      };
    }
    
    throw new Error('Invalid credentials');
  }

  static async logoutAdmin(): Promise<void> {
    // TODO: Implement Supabase logout
    return Promise.resolve();
  }

  static async getCurrentAdmin(): Promise<AdminUser | null> {
    // TODO: Implement Supabase session check
    const stored = localStorage.getItem('terraprice_admin');
    return stored ? JSON.parse(stored) : null;
  }
}