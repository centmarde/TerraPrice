"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { User } from "../types/auth"
import type { UserActivity, AdminStats, UserManagementFilters } from "../types/admin"

interface AdminContextType {
  users: User[]
  userActivities: UserActivity[]
  adminStats: AdminStats
  updateUserRole: (userId: string, role: "admin" | "user") => void
  updateUserStatus: (userId: string, isActive: boolean) => void
  deleteUser: (userId: string) => void
  getUserActivities: (userId: string) => UserActivity[]
  getFilteredUsers: (filters: UserManagementFilters) => User[]
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@terraprice.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "2",
    email: "user@terraprice.com",
    name: "Regular User",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
    isActive: true,
  },
  {
    id: "3",
    email: "sarah.chen@modernspace.com",
    name: "Sarah Chen",
    role: "user",
    createdAt: "2024-01-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "4",
    email: "michael.rodriguez@buildright.com",
    name: "Michael Rodriguez",
    role: "user",
    createdAt: "2024-02-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "5",
    email: "emily.johnson@urbandevelopment.com",
    name: "Emily Johnson",
    role: "user",
    createdAt: "2024-02-10T00:00:00Z",
    isActive: false,
  },
  {
    id: "6",
    email: "david.kim@architect.com",
    name: "David Kim",
    role: "user",
    createdAt: "2024-02-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "7",
    email: "lisa.wang@construction.com",
    name: "Lisa Wang",
    role: "admin",
    createdAt: "2024-01-20T00:00:00Z",
    isActive: true,
  },
]

// Mock user activities
const mockActivities: UserActivity[] = [
  {
    id: "1",
    userId: "2",
    action: "login",
    details: "User logged in",
    timestamp: "2024-03-01T10:30:00Z",
    ipAddress: "192.168.1.100",
  },
  {
    id: "2",
    userId: "2",
    action: "upload_floorplan",
    details: "Uploaded floorplan: Modern House Design",
    timestamp: "2024-03-01T10:35:00Z",
    ipAddress: "192.168.1.100",
  },
  {
    id: "3",
    userId: "3",
    action: "export_report",
    details: "Exported cost estimation as PDF",
    timestamp: "2024-03-01T09:15:00Z",
    ipAddress: "192.168.1.101",
  },
  {
    id: "4",
    userId: "4",
    action: "login",
    details: "User logged in",
    timestamp: "2024-03-01T08:45:00Z",
    ipAddress: "192.168.1.102",
  },
  {
    id: "5",
    userId: "6",
    action: "create_project",
    details: "Created new project: Office Building",
    timestamp: "2024-02-28T16:20:00Z",
    ipAddress: "192.168.1.103",
  },
]

const mockStats: AdminStats = {
  totalUsers: 7,
  activeUsers: 6,
  totalProjects: 24,
  totalRevenue: 125000,
  newUsersThisMonth: 3,
  projectsThisMonth: 8,
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [userActivities] = useState<UserActivity[]>(mockActivities)
  const [adminStats] = useState<AdminStats>(mockStats)

  const updateUserRole = useCallback((userId: string, role: "admin" | "user") => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)))
  }, [])

  const updateUserStatus = useCallback((userId: string, isActive: boolean) => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isActive } : user)))
  }, [])

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }, [])

  const getUserActivities = useCallback(
    (userId: string) => {
      return userActivities.filter((activity) => activity.userId === userId)
    },
    [userActivities],
  )

  const getFilteredUsers = useCallback(
    (filters: UserManagementFilters) => {
      return users.filter((user) => {
        if (filters.role && filters.role !== "all" && user.role !== filters.role) {
          return false
        }
        if (filters.status && filters.status !== "all") {
          const isActive = filters.status === "active"
          if (user.isActive !== isActive) {
            return false
          }
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          return user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower)
        }
        return true
      })
    },
    [users],
  )

  const value: AdminContextType = {
    users,
    userActivities,
    adminStats,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    getUserActivities,
    getFilteredUsers,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
