import { create } from 'zustand';
import { FloorplanState, FloorplanSubmission } from '../types';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { getSupabaseFileUrl } from '../utils/fileUtils';

export const useFloorplanStore = create<FloorplanState>((set, get) => ({
  submissions: [],
  selectedSubmission: null,
  isLoading: false,

  fetchSubmissions: async () => {
    set({ isLoading: true });
    try {
      console.log('Fetching submissions from mobile_uploads...');
      
      // Fetch reviewed items from mobile_uploads (approved/denied)
      const { data, error } = await supabase
        .from('mobile_uploads')
        .select('*')
        .in('status', ['approved', 'denied'])
        .order('updated_at', { ascending: false });

      console.log('Fetch result:', { data, error, count: data?.length });

      if (error) {
        throw error;
      }

      const enriched = await Promise.all((data || []).map(async (row: any) => {
        let userDetails = null;
        if (row.user_id) {
          try {
            const { data: ud, error: ue } = await supabaseAdmin.auth.admin.getUserById(row.user_id);
            if (!ue && ud?.user) {
              userDetails = {
                id: ud.user.id,
                email: ud.user.email || '',
                fullName: ud.user.user_metadata?.full_name || ud.user.email || 'Unknown User',
                phoneNumber: ud.user.user_metadata?.phone_number || undefined
              };
            }
          } catch (e) {
            console.warn('Failed to fetch user for submission', row.id, e);
          }
        }

        const mapped: FloorplanSubmission = {
          id: `mobile-${row.id}`,
          userId: row.user_id || '',
          imageUrl: row.file_path ? getSupabaseFileUrl(row.file_path) : (row.file_path || ''),
          estimatedCost: 0,
          status: row.status === 'approved' ? 'approved' : 'rejected',
          submittedAt: row.created_at ? new Date(row.created_at) : new Date(),
          reviewedAt: row.updated_at ? new Date(row.updated_at) : undefined,
          adminNotes: row.admin_notes || undefined,
          userDetails: userDetails
        };

        return mapped;
      }));

      set({ submissions: enriched, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch submissions:', error);
      throw error;
    }
  },

  selectSubmission: (id: string) => {
    const submission = get().submissions.find(s => s.id === id);
    set({ selectedSubmission: submission || null });
  },

  updateSubmissionStatus: async (id: string, status: FloorplanSubmission['status'], notes?: string) => {
    set({ isLoading: true });
    try {
      // If submissions are sourced from mobile_uploads, updating status should be done there.
      // This function will update local state for entries in the submissions array.
      const submissions = get().submissions.map(submission =>
        submission.id === id
          ? { ...submission, status, adminNotes: notes, reviewedAt: new Date() }
          : submission
      );
      set({ submissions, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to update submission status:', error);
      throw error;
    }
  },
}));