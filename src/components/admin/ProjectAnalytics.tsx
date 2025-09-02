"use client"

import type React from "react"
import { TrendingUp, BarChart3, PieChart, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Mock analytics data
const mockAnalytics = {
  totalProjects: 247,
  completedProjects: 231,
  averageCostEstimation: 87500,
  popularFloorplanTypes: [
    { type: "Residential", count: 156, percentage: 63.2, averageCost: 75000 },
    { type: "Commercial", count: 48, percentage: 19.4, averageCost: 125000 },
    { type: "Industrial", count: 28, percentage: 11.3, averageCost: 95000 },
    { type: "Mixed-Use", count: 15, percentage: 6.1, averageCost: 110000 },
  ],
  monthlyTrends: [
    { month: "Jan", projects: 18, revenue: 45000, users: 12 },
    { month: "Feb", projects: 22, revenue: 55000, users: 15 },
    { month: "Mar", projects: 28, revenue: 70000, users: 18 },
    { month: "Apr", projects: 25, revenue: 62500, users: 16 },
    { month: "May", projects: 32, revenue: 80000, users: 22 },
    { month: "Jun", projects: 35, revenue: 87500, users: 25 },
  ],
  costDistribution: [
    { range: "$0-50k", count: 45, percentage: 18.2 },
    { range: "$50k-100k", count: 98, percentage: 39.7 },
    { range: "$100k-200k", count: 67, percentage: 27.1 },
    { range: "$200k+", count: 37, percentage: 15.0 },
  ],
  regionalBreakdown: [
    { region: "West Coast", projects: 89, averageCost: 95000, adjustment: 1.15 },
    { region: "East Coast", projects: 76, averageCost: 88000, adjustment: 1.12 },
    { region: "Midwest", projects: 52, averageCost: 72000, adjustment: 0.95 },
    { region: "South", projects: 30, averageCost: 68000, adjustment: 0.88 },
  ],
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export const ProjectAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {mockAnalytics.completedProjects} completed (
              {((mockAnalytics.completedProjects / mockAnalytics.totalProjects) * 100).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cost Estimation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockAnalytics.averageCostEstimation.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular Type</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.popularFloorplanTypes[0].type}</div>
            <p className="text-xs text-muted-foreground">
              {mockAnalytics.popularFloorplanTypes[0].percentage}% of all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Region</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalytics.regionalBreakdown[0].region}</div>
            <p className="text-xs text-muted-foreground">{mockAnalytics.regionalBreakdown[0].projects} projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="types">Floorplan Types</TabsTrigger>
          <TabsTrigger value="costs">Cost Distribution</TabsTrigger>
          <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Project Trends</CardTitle>
              <CardDescription>Project volume and revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockAnalytics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="projects"
                      stackId="1"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                      name="Projects"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Floorplan Type Distribution</CardTitle>
                <CardDescription>Project breakdown by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={mockAnalytics.popularFloorplanTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percentage }) => `${type} ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {mockAnalytics.popularFloorplanTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Cost by Type</CardTitle>
                <CardDescription>Cost comparison across floorplan types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAnalytics.popularFloorplanTypes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Average Cost"]} />
                      <Bar dataKey="averageCost" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs">
          <Card>
            <CardHeader>
              <CardTitle>Cost Distribution</CardTitle>
              <CardDescription>Project distribution by cost ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockAnalytics.costDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Regional Analysis</CardTitle>
              <CardDescription>Project distribution and costs by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockAnalytics.regionalBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="projects" fill="#6366f1" name="Projects" />
                    <Bar yAxisId="right" dataKey="averageCost" fill="#10b981" name="Avg Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
