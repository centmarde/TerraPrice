export interface FloorplanSubmission {
  id: string;
  userId: string;
  imageUrl: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: Date;
  reviewedAt?: Date;
  adminNotes?: string;
  denialReason?: string;
  userDetails?: UserInfo | null;
  squareFootage?: number;
  location?: string;
  canUndo?: boolean;
  previousStatus?: 'pending' | 'approved' | 'denied';
}

export interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface MobileUpload {
  id: number;
  user_id: string | null;
  userDetails?: UserInfo | null;
  created_at: string | null;
  file_name: string;
  file_path: string;
  file_size: number | null;
  status: 'uploading' | 'uploaded' | 'processing' | 'pending' | 'approved' | 'denied' | 'completed' | 'error';
  updated_at: string | null;
  comments?: string | null;
  is_read?: boolean; // For notification system
  confidence_score?: number | null; // AI confidence score (0-100)
}

export interface MobileUploadsState {
  uploads: MobileUpload[];
  selectedUpload: MobileUpload | null;
  isLoading: boolean;
  subscription: any;
  recentActions: Array<{
    submissionId: string;
    previousStatus: MobileUpload['status'];
    newStatus: MobileUpload['status'];
    timestamp: number;
    canUndo: boolean;
  }>;
  fetchUploads: () => Promise<void>;
  fetchUploadsByUserId: (userId: string) => Promise<void>;
  fetchUploadsByStatus: (status: MobileUpload['status']) => Promise<void>;
  selectUpload: (id: number) => void;
  updateUploadStatus: (id: number, status: MobileUpload['status'], denialReason?: string) => Promise<void>;
  undoStatusChange: (submissionId: string) => Promise<void>;
  subscribeToUploads: () => void;
  unsubscribeFromUploads: () => void;
  getUnreadCount: () => number;
  markAsRead: (id: number) => Promise<void>;
}

export interface FloorplanState {
  submissions: FloorplanSubmission[];
  selectedSubmission: FloorplanSubmission | null;
  isLoading: boolean;
  recentActions: Array<{
    submissionId: string;
    previousStatus: FloorplanSubmission['status'];
    newStatus: FloorplanSubmission['status'];
    timestamp: Date;
    canUndo: boolean;
  }>;
  fetchSubmissions: () => Promise<void>;
  selectSubmission: (id: string) => void;
  updateSubmissionStatus: (id: string, status: FloorplanSubmission['status'], notes?: string, denialReason?: string) => Promise<void>;
  undoStatusChange: (submissionId: string) => Promise<void>;
}