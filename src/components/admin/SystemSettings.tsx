"use client"

import type React from "react"
import { useState } from "react"
import { Save, AlertTriangle, Server, Bell, Upload, Shield } from "lucide-react"
import { useToast } from "../ui/toast"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Label } from "../ui/label"
import { Badge } from "../ui/badge"
import type { SystemSettings as SystemSettingsType } from "../../types/analytics"

const mockSettings: SystemSettingsType = {
  fileUpload: {
    maxFileSize: 10,
    allowedFormats: ["jpg", "jpeg", "png", "pdf"],
    maxFilesPerUser: 50,
  },
  apiLimits: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceAlerts: true,
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "System maintenance in progress. Please check back later.",
    scheduledMaintenance: "2024-03-15T02:00:00Z",
  },
}

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettingsType>(mockSettings)
  const { showToast } = useToast()

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    showToast("Settings saved successfully", "success")
  }

  const updateSetting = (category: keyof SystemSettingsType, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="api">API Limits</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>File Upload Settings</span>
              </CardTitle>
              <CardDescription>Configure file upload limits and allowed formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.fileUpload.maxFileSize}
                    onChange={(e) => updateSetting("fileUpload", "maxFileSize", Number(e.target.value))}
                  />
                  <p className="text-sm text-gray-700">Maximum size per file upload</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxFilesPerUser">Max Files Per User</Label>
                  <Input
                    id="maxFilesPerUser"
                    type="number"
                    value={settings.fileUpload.maxFilesPerUser}
                    onChange={(e) => updateSetting("fileUpload", "maxFilesPerUser", Number(e.target.value))}
                  />
                  <p className="text-sm text-gray-700">Maximum files a user can store</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allowed File Formats</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.fileUpload.allowedFormats.map((format) => (
                    <Badge key={format} variant="secondary">
                      .{format}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-700">Currently supported file formats</p>
              </div>

              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Upload Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>API Rate Limits</span>
              </CardTitle>
              <CardDescription>Configure API request limits to prevent abuse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="perMinute">Requests Per Minute</Label>
                  <Input
                    id="perMinute"
                    type="number"
                    value={settings.apiLimits.requestsPerMinute}
                    onChange={(e) => updateSetting("apiLimits", "requestsPerMinute", Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perHour">Requests Per Hour</Label>
                  <Input
                    id="perHour"
                    type="number"
                    value={settings.apiLimits.requestsPerHour}
                    onChange={(e) => updateSetting("apiLimits", "requestsPerHour", Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="perDay">Requests Per Day</Label>
                  <Input
                    id="perDay"
                    type="number"
                    value={settings.apiLimits.requestsPerDay}
                    onChange={(e) => updateSetting("apiLimits", "requestsPerDay", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Rate Limit Warning</h4>
                    <p className="text-sm text-yellow-700">
                      Changes to rate limits will affect all users immediately. Set limits carefully to balance
                      performance and user experience.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save API Limits
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Configure system-wide notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-700">Send email notifications to users</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-700">Send SMS notifications for critical updates</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSetting("notifications", "smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-700">Send browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Alerts</Label>
                    <p className="text-sm text-gray-700">Notify users about scheduled maintenance</p>
                  </div>
                  <Switch
                    checked={settings.notifications.maintenanceAlerts}
                    onCheckedChange={(checked) => updateSetting("notifications", "maintenanceAlerts", checked)}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>Maintenance Settings</span>
              </CardTitle>
              <CardDescription>Configure system maintenance and downtime</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-gray-700">Enable to put the system in maintenance mode</p>
                </div>
                <Switch
                  checked={settings.maintenance.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting("maintenance", "maintenanceMode", checked)}
                />
              </div>

              {settings.maintenance.maintenanceMode && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Maintenance Mode Active</h4>
                      <p className="text-sm text-red-700">
                        The system is currently in maintenance mode. Users will see the maintenance message.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={settings.maintenance.maintenanceMessage}
                  onChange={(e) => updateSetting("maintenance", "maintenanceMessage", e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-gray-700">Message shown to users during maintenance</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledMaintenance">Scheduled Maintenance</Label>
                <Input
                  id="scheduledMaintenance"
                  type="datetime-local"
                  value={settings.maintenance.scheduledMaintenance.slice(0, 16)}
                  onChange={(e) => updateSetting("maintenance", "scheduledMaintenance", e.target.value + ":00Z")}
                />
                <p className="text-sm text-gray-700">Next scheduled maintenance window</p>
              </div>

              <Button onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                Save Maintenance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
