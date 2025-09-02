"use client"

import type React from "react"
import { CheckCircle, Circle, Loader2 } from "lucide-react"
import { useProjects } from "../../contexts/ProjectContext"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"

export const ProgressTracker: React.FC = () => {
  const { uploadProgress, currentProject } = useProjects()

  if (!uploadProgress && !currentProject) return null

  const stages = [
    { key: "upload", label: "Upload", description: "Uploading floorplan file" },
    { key: "processing", label: "Processing", description: "Processing image data" },
    { key: "analysis", label: "Analysis", description: "Analyzing structure and materials" },
    { key: "complete", label: "Complete", description: "Cost estimation ready" },
  ]

  const currentStage = uploadProgress?.stage || "complete"
  const progress = uploadProgress?.progress || 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {uploadProgress ? (
            <Loader2 className="h-5 w-5 animate-spin text-secondary" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <span>Analysis Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{uploadProgress?.message || "Analysis completed"}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Stage Indicators */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isActive = stage.key === currentStage
            const isCompleted = stages.findIndex((s) => s.key === currentStage) > index || currentStage === "complete"
            const isPending = stages.findIndex((s) => s.key === currentStage) < index

            return (
              <div key={stage.key} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${isActive ? "text-secondary" : isCompleted ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{stage.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {currentProject && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Project: <span className="font-medium text-foreground">{currentProject.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Started: {new Date(currentProject.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
