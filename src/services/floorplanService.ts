import { FloorplanSubmission } from '../types';

export class FloorplanService {
  static async getSubmissions(): Promise<FloorplanSubmission[]> {
    // TODO: Implement Supabase query
    // SELECT * FROM floorplan_submissions 
    // JOIN users ON floorplan_submissions.user_id = users.id
    // ORDER BY submitted_at DESC
    
    return [];
  }

  static async getSubmissionById(id: string): Promise<FloorplanSubmission | null> {
    // TODO: Implement Supabase query
    // SELECT * FROM floorplan_submissions 
    // JOIN users ON floorplan_submissions.user_id = users.id
    // WHERE floorplan_submissions.id = $1
    
    return null;
  }

  static async updateSubmissionStatus(
    id: string, 
    status: FloorplanSubmission['status'], 
    adminNotes?: string
  ): Promise<void> {
    // TODO: Implement Supabase update
    // UPDATE floorplan_submissions 
    // SET status = $1, admin_notes = $2, reviewed_at = NOW()
    // WHERE id = $3
    
    return Promise.resolve();
  }

  static async getSubmissionsByStatus(status: FloorplanSubmission['status']): Promise<FloorplanSubmission[]> {
    // TODO: Implement Supabase query with status filter
    return [];
  }
}