"use client"

import type React from "react"
import { useState } from "react"
import { AdminStatsCards } from "../components/admin/AdminStatsCards"
import { UserManagementTable } from "../components/admin/UserManagementTable"
import { UserActivityLog } from "../components/admin/UserActivityLog"
import { ProjectAnalytics } from "../components/admin/ProjectAnalytics"
import { CostEstimationSettings } from "../components/admin/CostEstimationSettings"
import { SystemSettings } from "../components/admin/SystemSettings"
import { AdminReports } from "../components/reports/AdminReports"
import { AdminSidebar } from "../components/layout/AdminSidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview")

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Admin Overview</h2>
              <p className="text-muted-foreground">Monitor system performance and user activity</p>
            </div>
            <AdminStatsCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UserActivityLog />
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Summary</CardTitle>
                  <CardDescription>Key metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">User Registrations</span>
                      <span className="font-medium">+12% this month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Project Uploads</span>
                      <span className="font-medium">+8% this month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">System Uptime</span>
                      <span className="font-medium text-green-600">99.9%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Response Time</span>
                      <span className="font-medium">245ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "users":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">User Management</h2>
              <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
            </div>
            <UserManagementTable />
          </div>
        )

      case "activity":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Activity Log</h2>
              <p className="text-muted-foreground">Monitor user actions and system events</p>
            </div>
            <UserActivityLog />
          </div>
        )

      case "analytics":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Project Analytics</h2>
              <p className="text-muted-foreground">Detailed insights into project trends and performance</p>
            </div>
            <ProjectAnalytics />
          </div>
        )

      case "cost-settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Cost Estimation Settings</h2>
              <p className="text-muted-foreground">Configure cost calculation parameters and pricing</p>
            </div>
            <CostEstimationSettings />
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">System Settings</h2>
              <p className="text-muted-foreground">Configure system parameters and preferences</p>
            </div>
            <SystemSettings />
          </div>
        )

      case "reports":
        return <AdminReports />

      default:
        return null
    }
  }

  return (
    <div className="flex gap-6">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1">{renderContent()}</div>
    </div>
  )
}
