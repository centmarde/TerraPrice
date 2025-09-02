"use client"

import type React from "react"
import { useState } from "react"
import { MoreHorizontal, Shield, User, Eye, Trash2, UserCheck, UserX } from "lucide-react"
import { useAdmin } from "../../contexts/AdminContext"
import { useToast } from "../ui/toast"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import type { UserManagementFilters } from "../../types/admin"

export const UserManagementTable: React.FC = () => {
  const { getFilteredUsers, updateUserRole, updateUserStatus, deleteUser } = useAdmin()
  const { showToast } = useToast()

  const [filters, setFilters] = useState<UserManagementFilters>({
    role: "all",
    status: "all",
    search: "",
  })
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const filteredUsers = getFilteredUsers(filters)

  const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
    updateUserRole(userId, newRole)
    showToast(`User role updated to ${newRole}`, "success")
    setOpenDropdownId(null) // Close dropdown after action
  }

  const handleStatusChange = (userId: string, isActive: boolean) => {
    updateUserStatus(userId, isActive)
    showToast(`User ${isActive ? "activated" : "deactivated"}`, "success")
    setOpenDropdownId(null) // Close dropdown after action
  }

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId)
    setDeletingUserId(null)
    setOpenDropdownId(null)
    showToast("User deleted successfully", "success")
  }

  const getRoleBadge = (role: string) => {
    return role === "admin" ? (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        <User className="h-3 w-3 mr-1" />
        User
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search users..."
          value={filters.search || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="sm:max-w-xs"
        />
        <Select
          value={filters.role || "all"}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, role: value as any }))}
        >
          <SelectTrigger className="sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value as any }))}
        >
          <SelectTrigger className="sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">User</TableHead>
              <TableHead className="font-semibold text-gray-900">Role</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Created</TableHead>
              <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>{getStatusBadge(user.isActive)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu 
                    open={openDropdownId === user.id}
                    onOpenChange={(open) => setOpenDropdownId(open ? user.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem 
                        onClick={() => {
                          showToast(`Viewing details for ${user.name}`, "info")
                          setOpenDropdownId(null)
                        }}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(user.id, user.role === "admin" ? "user" : "admin")}
                        className="cursor-pointer"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleStatusChange(user.id, !user.isActive)}
                        className="cursor-pointer"
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog open={deletingUserId === user.id} onOpenChange={(open) => !open && setDeletingUserId(null)}>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                            onSelect={(e) => {
                              e.preventDefault()
                              setDeletingUserId(user.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.name}? This action cannot be undone and will remove
                              all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeletingUserId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg">
          No users found matching the current filters.
        </div>
      )}
    </div>
  )
}