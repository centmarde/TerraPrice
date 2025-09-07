import { create } from 'zustand';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { MobileUpload, MobileUploadsState } from '../types';

export const useMobileUploadsStore = create<MobileUploadsState>((set, get) => ({
  uploads: [],
  selectedUpload: null,
  isLoading: false,

  fetchUploads: async () => {
    set({ isLoading: true });
    
    // Simulate network delay for better skeleton demonstration
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    try {
      // Get uploads from mobile_uploads table
      const { data, error } = await supabase
        .from('mobile_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Get user details for each upload using auth API (similar to authStore pattern)
      const enrichedUploads = await Promise.all(
        (data || []).map(async (upload) => {
          let userDetails = null;
          
          if (upload.user_id) {
            try {
              // Use Supabase admin auth API to get user info
              const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(upload.user_id);
              
              if (!userError && userData?.user) {
                userDetails = {
                  id: userData.user.id,
                  email: userData.user.email || '',
                  fullName: userData.user.user_metadata?.full_name || userData.user.email || 'Unknown User',
                  phoneNumber: userData.user.user_metadata?.phone_number || undefined
                };
              }

              console.log('Fetched user data for upload:', upload.id, userDetails);
            } catch (userFetchError) {
              console.warn(`Failed to fetch user data for user_id: ${upload.user_id}`, userFetchError);
            }
          }
          
          return {
            ...upload,
            userDetails
          };
        })
      );

      set({ uploads: enrichedUploads, isLoading: false });
    } catch (error) {
      console.error('Error fetching mobile uploads:', error);
      set({ isLoading: false });
      throw error;
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

      if (error) {
        throw error;
      }

      // Get user details for filtered uploads (similar to authStore pattern)
      const enrichedUploads = await Promise.all(
        (data || []).map(async (upload) => {
          let userDetails = null;
          
          if (upload.user_id) {
            try {
              const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(upload.user_id);
              
              if (!userError && userData?.user) {
                userDetails = {
                  id: userData.user.id,
                  email: userData.user.email || '',
                  fullName: userData.user.user_metadata?.full_name || userData.user.email || 'Unknown User',
                  phoneNumber: userData.user.user_metadata?.phone_number || undefined
                };
              }
            } catch (userFetchError) {
              console.warn(`Failed to fetch user data for user_id: ${upload.user_id}`, userFetchError);
            }
          }
          
          return {
            ...upload,
            userDetails
          };
        })
      );

      set({ uploads: enrichedUploads, isLoading: false });
    } catch (error) {
      console.error('Error fetching mobile uploads by user ID:', error);
      set({ isLoading: false });
      throw error;
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

      if (error) {
        throw error;
      }

      // Get user details for filtered uploads (similar to authStore pattern)
      const enrichedUploads = await Promise.all(
        (data || []).map(async (upload) => {
          let userDetails = null;
          
          if (upload.user_id) {
            try {
              const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(upload.user_id);
              
              if (!userError && userData?.user) {
                userDetails = {
                  id: userData.user.id,
                  email: userData.user.email || '',
                  fullName: userData.user.user_metadata?.full_name || userData.user.email || 'Unknown User',
                  phoneNumber: userData.user.user_metadata?.phone_number || undefined
                };
              }
            } catch (userFetchError) {
              console.warn(`Failed to fetch user data for user_id: ${upload.user_id}`, userFetchError);
            }
          }
          
          return {
            ...upload,
            userDetails
          };
        })
      );

      set({ uploads: enrichedUploads, isLoading: false });
    } catch (error) {
      console.error('Error fetching mobile uploads by status:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  selectUpload: (id: number) => {
    const { uploads } = get();
    const upload = uploads.find(u => u.id === id);
    set({ selectedUpload: upload || null });
  },

  updateUploadStatus: async (id: number, status: MobileUpload['status']) => {
    try {
      const { error } = await supabase
        .from('mobile_uploads')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

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

      set({ 
        uploads: updatedUploads, 
        selectedUpload: updatedSelectedUpload 
      });
    } catch (error) {
      console.error('Error updating upload status:', error);
      throw error;
    }
  },
}));
