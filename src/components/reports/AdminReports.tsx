"use client"

import type React from "react"
import { useState } from "react"
import { useAdmin } from "../../contexts/AdminContext"

export const AdminReports: React.FC = () => {
  const { users } = useAdmin()
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [reportType, setReportType] = useState("user_activity")
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    { id: "user_activity", name: "User Activity Report", description: "User engagement and project statistics" },
    { id: "revenue", name: "Revenue Analysis", description: "Financial performance and trends" },
    { id: "system_usage", name: "System Usage Report", description: "Platform utilization metrics" },
    { id: "cost_trends", name: "Cost Estimation Trends", description: "Analysis of cost estimation patterns" },
  ]

  const handleGenerateAdminReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const reportData = generateAdminReportData()
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `terraprice-admin-report-${reportType}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
  }

  const generateAdminReportData = () => {
    return {
      reportType,
      dateRange,
      generatedAt: new Date().toISOString(),
      summary: {
        totalUsers: users.length,
        activeUsers: users.filter((u) => u.status === "active").length,
        totalProjects: Math.floor(Math.random() * 500) + 100,
        avgProjectValue: Math.floor(Math.random() * 50000) + 25000,
      },
      userMetrics: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        projectCount: Math.floor(Math.random() * 10) + 1,
        totalSpent: Math.floor(Math.random() * 10000) + 1000,
        lastActive: user.lastLogin,
      })),
      trends: {
        dailyActiveUsers: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          count: Math.floor(Math.random() * 50) + 10,
        })),
        projectsByType: {
          residential: Math.floor(Math.random() * 100) + 50,
          commercial: Math.floor(Math.random() * 80) + 30,
          industrial: Math.floor(Math.random() * 40) + 10,
        },
      },
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Admin Reports</h2>
        <p className="text-muted-foreground">Generate comprehensive reports for system analysis</p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded-md bg-background"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-1">
              {reportTypes.find((t) => t.id === reportType)?.description}
            </p>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                className="p-2 border rounded-md bg-background"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                className="p-2 border rounded-md bg-background"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerateAdminReport}
          disabled={isGenerating}
          className="w-full mt-6 bg-primary text-primary-foreground py-3 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating Admin Report...
            </div>
          ) : (
            "Generate Admin Report"
          )}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          <p className="text-2xl font-bold text-primary">{users.length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
          <p className="text-2xl font-bold text-primary">{users.filter((u) => u.status === "active").length}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Projects This Month</h3>
          <p className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 100) + 50}</p>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Avg. Project Value</h3>
          <p className="text-2xl font-bold text-primary">
            ${(Math.floor(Math.random() * 50000) + 25000).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
