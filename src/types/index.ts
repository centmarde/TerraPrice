export interface FloorplanSubmission {
  id: string;
  userId: string;
  imageUrl: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected';
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
  logout: () => void;
  checkAuth: () => void;
}

export interface FloorplanState {
  submissions: FloorplanSubmission[];
  selectedSubmission: FloorplanSubmission | null;
  isLoading: boolean;
  fetchSubmissions: () => Promise<void>;
  selectSubmission: (id: string) => void;
  updateSubmissionStatus: (id: string, status: FloorplanSubmission['status'], notes?: string) => Promise<void>;
}