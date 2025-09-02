"use client"

import type React from "react"
import { useState } from "react"
import { useProjects } from "../../contexts/ProjectContext"

interface ReportGeneratorProps {
  projectId?: string
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ projectId }) => {
  const { projects } = useProjects()
  const [selectedTemplate, setSelectedTemplate] = useState("comprehensive")
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel" | "csv">("pdf")
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTemplates = [
    { id: "comprehensive", name: "Comprehensive Report", description: "Complete project analysis with all details" },
    { id: "executive", name: "Executive Summary", description: "High-level overview for stakeholders" },
    { id: "cost_only", name: "Cost Analysis Only", description: "Detailed cost breakdown and estimates" },
    { id: "materials", name: "Materials Report", description: "Material specifications and quantities" },
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create download link
    const reportData = generateReportData(projectId, selectedTemplate)
    const blob = createReportBlob(reportData, selectedFormat)
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `terraprice-report-${Date.now()}.${selectedFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsGenerating(false)
  }

  const generateReportData = (projectId: string | undefined, template: string) => {
    const project = projectId ? projects.find((p) => p.id === projectId) : null

    return {
      title: project ? `${project.name} - Cost Estimation Report` : "TerraPrice Analytics Report",
      generatedAt: new Date().toISOString(),
      template,
      project,
      summary: {
        totalCost: project?.costEstimation?.totalCost || 0,
        squareFootage: (project as any)?.metadata?.squareFootage || 0,
        costPerSqFt: (project?.costEstimation as any)?.costPerSquareFoot || 0,
      },
      breakdown: project?.costEstimation?.breakdown || {},
      materials: (project?.costEstimation as any)?.materials || [],
      timeline: (project as any)?.timeline || [],
    }
  }

  const createReportBlob = (data: any, format: string) => {
    switch (format) {
      case "pdf":
        return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      case "excel":
        return new Blob([convertToCSV(data)], { type: "application/vnd.ms-excel" })
      case "csv":
        return new Blob([convertToCSV(data)], { type: "text/csv" })
      default:
        return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    }
  }

  const convertToCSV = (data: any) => {
    const headers = ["Item", "Category", "Quantity", "Unit Cost", "Total Cost"]
    const rows =
      data.materials?.map((item: any) => [item.name, item.category, item.quantity, item.unitCost, item.totalCost]) || []

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Generate Report</h3>

      <div className="space-y-4">
        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Report Template</label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            {reportTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            {reportTemplates.find((t) => t.id === selectedTemplate)?.description}
          </p>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Export Format</label>
          <div className="flex gap-2">
            {(["pdf", "excel", "csv"] as const).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFormat === format ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating Report...
            </div>
          ) : (
            "Generate & Download Report"
          )}
        </button>
      </div>
    </div>
  )
}
