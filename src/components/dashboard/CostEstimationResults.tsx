"use client"

import type React from "react"
import { useState } from "react"
import { FileText, Table, FileSpreadsheet, TrendingUp, Info } from "lucide-react"
import { useProjects } from "../../contexts/ProjectContext"
import { useToast } from "../ui/toast"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Table as TableComponent, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export const CostEstimationResults: React.FC = () => {
  const { currentProject, exportProject } = useProjects()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState("overview")

  if (!currentProject || !currentProject.costEstimation || currentProject.status !== "completed") {
    return null
  }

  const { costEstimation } = currentProject

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    exportProject(currentProject.id, format)
    showToast(`Exporting as ${format.toUpperCase()}...`, "success")
  }

  // Chart data
  const breakdownData = [
    { name: "Materials", value: costEstimation.breakdown.materials, color: "#6366f1" },
    { name: "Labor", value: costEstimation.breakdown.labor, color: "#10b981" },
    { name: "Permits", value: costEstimation.breakdown.permits, color: "#f59e0b" },
    { name: "Overhead", value: costEstimation.breakdown.overhead, color: "#ef4444" },
  ]

  const detailedChartData = costEstimation.detailedBreakdown.map((item) => ({
    category: item.category,
    cost: item.totalCost,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span>Cost Estimation Results</span>
            </CardTitle>
            <CardDescription>Analysis for {currentProject.name}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {costEstimation.confidence}% Confidence
            </Badge>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
                <FileText className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                <Table className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Excel
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
            <TabsTrigger value="charts">Visual Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Total Cost */}
            <div className="text-center p-6 bg-secondary/5 rounded-lg">
              <h3 className="text-2xl font-bold text-secondary mb-2">${costEstimation.totalCost.toLocaleString()}</h3>
              <p className="text-muted-foreground">Total Estimated Cost</p>
              <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 mr-1" />
                Includes {(costEstimation.regionalAdjustment - 1) * 100}% regional adjustment
              </div>
            </div>

            {/* Quick Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {breakdownData.map((item) => (
                <Card key={item.name}>
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold" style={{ color: item.color }}>
                      ${item.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">{item.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {((item.value / costEstimation.totalCost) * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="font-medium mb-2">Project Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Name: {currentProject.name}</p>
                  {currentProject.description && <p>Description: {currentProject.description}</p>}
                  <p>Analyzed: {new Date(currentProject.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Estimation Details</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Confidence Level: {costEstimation.confidence}%</p>
                  <p>Regional Factor: {costEstimation.regionalAdjustment}x</p>
                  <p>Base Cost: ${(costEstimation.totalCost / costEstimation.regionalAdjustment).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4">
            <TableComponent>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Cost</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costEstimation.detailedBreakdown.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity.toLocaleString()} {item.unit}
                    </TableCell>
                    <TableCell className="text-right">${item.unitCost.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">${item.totalCost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableComponent>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {/* Cost Breakdown Pie Chart */}
            <div>
              <h4 className="font-medium mb-4">Cost Distribution</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Cost"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed Breakdown Bar Chart */}
            <div>
              <h4 className="font-medium mb-4">Detailed Cost Breakdown</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detailedChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Cost"]} />
                    <Bar dataKey="cost" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
