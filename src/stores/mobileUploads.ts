import { create } from 'zustand';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { MobileUpload, MobileUploadsState } from '../types';

export const useMobileUploadsStore = create<MobileUploadsState>((set, get) => ({
  uploads: [],
  selectedUpload: null,
  isLoading: false,
  subscription: null,

  subscribeToUploads: () => {
    const { subscription } = get();
    if (subscription) return;

    const newSubscription = supabase
      .channel('mobile_uploads_changes')
      .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'mobile_uploads' 
        }, (payload) => {
          console.log('Realtime change detected:', payload);
          get().fetchUploads();
        })
      .subscribe();

    set({ subscription: newSubscription });
  },

  unsubscribeFromUploads: () => {
    const { subscription } = get();
    if (subscription) {
      supabase.removeChannel(subscription);
      set({ subscription: null });
    }
  },

  fetchUploads: async () => {
    set({ isLoading: true });
    
    try {
      console.log('🔍 Fetching uploads with optimized query...');
      
      // Fetch all records - no limit to show everything to boss
      const { data, error } = await supabaseAdmin
        .from('mobile_uploads')
        .select('id, user_id, file_name, file_path, file_size, status, created_at, updated_at')
        .order('created_at', { ascending: false });

      console.log('📊 Query result:', { 
        dataLength: data?.length, 
        error: error 
      });

      if (error) {
        console.error('❌ Admin client error:', error);
        set({ uploads: [], isLoading: false });
        return;
      }

      if (!data || data.length === 0) {
        console.log('📭 No data returned');
        set({ uploads: [], isLoading: false });
        return;
      }

      console.log('✅ Got', data.length, 'uploads, enriching with user details...');

      // Enrich with actual user details
      const enrichedUploads = await Promise.all(
        data.map(async (upload) => {
          let userDetails = {
            id: upload.user_id,
            email: 'Loading...',
            fullName: `User ${upload.user_id.substring(0, 8)}`
          };
          
          if (upload.user_id) {
            try {
              const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(upload.user_id);
              
              if (!userError && userData?.user) {
                userDetails = {
                  id: userData.user.id,
                  email: userData.user.email || '',
                  fullName: userData.user.user_metadata?.full_name || userData.user.email || 'Unknown User'
                };
              }
            } catch (userFetchError) {
              console.warn(`Failed to fetch user data for user_id: ${upload.user_id}`);
            }
          }
          
          return { ...upload, userDetails };
        })
      );

      console.log('🎉 Successfully loaded', enrichedUploads.length, 'uploads with user details');
      set({ uploads: enrichedUploads, isLoading: false });

    } catch (error) {
      console.error('💥 Error:', error);
      set({ uploads: [], isLoading: false });
    }
  },

  fetchUploadsByUserId: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('mobile_uploads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ uploads: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching uploads by user ID:', error);
      set({ isLoading: false });
    }
  },

  fetchUploadsByStatus: async (status: MobileUpload['status']) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('mobile_uploads')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ uploads: data || [], isLoading: false });
    } catch (error) {
      console.error('Error fetching uploads by status:', error);
      set({ isLoading: false });
    }
  },

  selectUpload: (id: number) => {
    const { uploads } = get();
    const upload = uploads.find(u => u.id === id);
    set({ selectedUpload: upload || null });
  },

  updateUploadStatus: async (id: number, status: MobileUpload['status']) => {
    try {
      console.log('🔄 Updating upload status:', { id, status });
      
      // Check if we have admin permissions
      if (!supabaseAdmin) {
        throw new Error('Admin client not available');
      }
      
      // Test admin access first
      const { error: testError } = await supabaseAdmin
        .from('mobile_uploads')
        .select('id')
        .eq('id', id)
        .single();
        
      if (testError) {
        console.error('❌ Admin access test failed:', testError);
        throw new Error(`Admin access denied: ${testError.message}`);
      }
      
      console.log('✅ Admin access confirmed, proceeding with update...');
      
      // Use admin client to bypass RLS policies
      const { error } = await supabaseAdmin
        .from('mobile_uploads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('❌ Database update error:', error);
        throw new Error(`Database update failed: ${error.message}`);
      }

      console.log('✅ Successfully updated upload status in database');

      // Update local state
      const { uploads, selectedUpload } = get();
      const updatedUploads = uploads.map(upload => 
        upload.id === id 
          ? { ...upload, status, updated_at: new Date().toISOString() }
          : upload
      );
      
      const updatedSelectedUpload = selectedUpload?.id === id 
        ? { ...selectedUpload, status, updated_at: new Date().toISOString() }
        : selectedUpload;

      set({ uploads: updatedUploads, selectedUpload: updatedSelectedUpload });
      
      console.log('✅ Successfully updated local state');
    } catch (error) {
      console.error('💥 Error updating upload status:', error);
      throw error;
    }
  },
}));
