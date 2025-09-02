export interface UserActivity {
  id: string
  userId: string
  action: string
  details: string
  timestamp: string
  ipAddress?: string
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  totalRevenue: number
  newUsersThisMonth: number
  projectsThisMonth: number
}

export interface UserManagementFilters {
  role?: "admin" | "user" | "all"
  status?: "active" | "inactive" | "all"
  search?: string
}
