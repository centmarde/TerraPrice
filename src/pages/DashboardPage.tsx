"use client"

import type React from "react"
import { FileUpload } from "../components/dashboard/FileUpload"
import { ProgressTracker } from "../components/dashboard/ProgressTracker"
import { CostEstimationResults } from "../components/dashboard/CostEstimationResults"
import { ProjectList } from "../components/dashboard/ProjectList"
import { ReportGenerator } from "../components/reports/ReportGenerator"

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Upload floorplans and get accurate cost estimations for your construction projects.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upload & Progress */}
        <div className="lg:col-span-1 space-y-6">
          <FileUpload />
          <ProgressTracker />
          <ReportGenerator />
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-2 space-y-6">
          <CostEstimationResults />
        </div>
      </div>

      {/* Projects List */}
      <div className="pt-8 border-t">
        <ProjectList />
      </div>
    </div>
  )
}
