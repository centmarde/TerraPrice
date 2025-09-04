export interface FloorplanSubmission {
  id: string;
  userId: string;
  imageUrl: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'denied';
  submittedAt: Date;
  reviewedAt?: Date;
  adminNotes?: string;
  userDetails: UserInfo;
  squareFootage?: number;
  location?: string;
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
  user_id: string;
  userDetails?: UserInfo;
  created_at: string;
  file_name: string;
  file_path: string;
  ai_analysis_path?: string;
  file_size?: number;
  comments?: string;
  status: 'approved' | 'denied' | 'pending' | 'uploading' | 'uploaded' | 'processing' | 'completed' | 'error';
  updated_at: string;
}

export interface MobileUploadsState {
  uploads: MobileUpload[];
  selectedUpload?: MobileUpload;
  isLoading: boolean;
  isDialogOpen: boolean;
  fetchUploads: () => Promise<void>;
  fetchUploadsByUserId: (userId: string) => Promise<void>;
  fetchUploadsByStatus: (status: MobileUpload['status']) => Promise<void>;
  selectUpload: (id: number) => void;
  updateUploadStatus: (id: number, status: MobileUpload['status'], comments?: string) => Promise<void>;
  openDialog: (upload: MobileUpload) => void;
  closeDialog: () => void;
}

export interface FloorplanState {
  submissions: FloorplanSubmission[];
  selectedSubmission: FloorplanSubmission ;
  isLoading: boolean;
  fetchSubmissions: () => Promise<void>;
  selectSubmission: (id: string) => void;
  updateSubmissionStatus: (id: string, status: FloorplanSubmission['status'], notes?: string) => Promise<void>;
}