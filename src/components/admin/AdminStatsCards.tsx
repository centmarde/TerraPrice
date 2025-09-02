"use client"

import type React from "react"
import { Users, UserCheck, FolderOpen, DollarSign } from "lucide-react"
import { useAdmin } from "../../contexts/AdminContext"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export const AdminStatsCards: React.FC = () => {
  const { adminStats } = useAdmin()

  const stats = [
    {
      title: "Total Users",
      value: adminStats.totalUsers.toLocaleString(),
      description: `${adminStats.newUsersThisMonth} new this month`,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: adminStats.activeUsers.toLocaleString(),
      description: `${((adminStats.activeUsers / adminStats.totalUsers) * 100).toFixed(1)}% of total`,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Projects",
      value: adminStats.totalProjects.toLocaleString(),
      description: `${adminStats.projectsThisMonth} created this month`,
      icon: FolderOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: `$${adminStats.totalRevenue.toLocaleString()}`,
      description: "Estimated platform value",
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-700">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
