import { create } from 'zustand';
import { FloorplanState, FloorplanSubmission } from '../types';

export const useFloorplanStore = create<FloorplanState>((set, get) => ({
  submissions: [],
  selectedSubmission: {} as FloorplanSubmission,
  isLoading: false,

  fetchSubmissions: async () => {
    set({ isLoading: true });
    try {
      // TODO: Implement actual API call to Supabase
      // This is where we'll fetch from the database
      set({ submissions: [], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to fetch submissions:', error);
    }
  },

  selectSubmission: (id: string) => {
    const submission = get().submissions.find(s => s.id === id);
    set({ selectedSubmission: submission  });
  },

  updateSubmissionStatus: async (id: string, status: FloorplanSubmission['status'], notes?: string) => {
    set({ isLoading: true });
    try {
      // TODO: Implement actual API call to Supabase
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