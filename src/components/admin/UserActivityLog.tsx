"use client"

import type React from "react"
import { useState } from "react"
import { Activity, Calendar, MapPin, User } from "lucide-react"
import { useAdmin } from "../../contexts/AdminContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"

export const UserActivityLog: React.FC = () => {
  const { users, userActivities } = useAdmin()
  const [selectedUserId, setSelectedUserId] = useState<string>("all")

  const filteredActivities =
    selectedUserId === "all" ? userActivities : userActivities.filter((activity) => activity.userId === selectedUserId)

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "login":
        return <User className="h-4 w-4 text-green-600" />
      case "upload_floorplan":
        return <Activity className="h-4 w-4 text-blue-600" />
      case "export_report":
        return <Activity className="h-4 w-4 text-purple-600" />
      case "create_project":
        return <Activity className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityBadge = (action: string) => {
    switch (action) {
      case "login":
        return <Badge className="bg-green-100 text-green-800">Login</Badge>
      case "upload_floorplan":
        return <Badge className="bg-blue-100 text-blue-800">Upload</Badge>
      case "export_report":
        return <Badge className="bg-purple-100 text-purple-800">Export</Badge>
      case "create_project":
        return <Badge className="bg-orange-100 text-orange-800">Create</Badge>
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : "Unknown User"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-secondary" />
              <span>User Activity Log</span>
            </CardTitle>
            <CardDescription>Monitor user actions and system activity</CardDescription>
          </div>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No activity found for the selected user.</div>
          ) : (
            filteredActivities
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {getActivityBadge(activity.action)}
                      <span className="text-sm font-medium">{getUserName(activity.userId)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                      </div>
                      {activity.ipAddress && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.ipAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
