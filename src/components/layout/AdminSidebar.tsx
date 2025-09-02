"use client"

import type React from "react"
import { useState } from "react"
import {
  Users,
  Activity,
  BarChart3,
  Settings,
  FileText,
  Shield,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "User Management", icon: Users },
  { id: "activity", label: "Activity Log", icon: Activity },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "cost-settings", label: "Cost Settings", icon: DollarSign },
  { id: "settings", label: "System Settings", icon: Settings },
  { id: "reports", label: "Reports", icon: FileText },
]

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <Card className={`h-fit sticky top-24 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-secondary" />
              <span className="font-semibold text-primary">Admin Panel</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">{item.label}</span>}
            </Button>
          ))}
        </nav>
      </div>
    </Card>
  )
}
