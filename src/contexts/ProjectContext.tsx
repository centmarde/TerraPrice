"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Project, CostEstimation, UploadProgress } from "../types/project"

interface ProjectContextType {
  projects: Project[]
  currentProject: Project | null
  uploadProgress: UploadProgress | null
  uploadFloorplan: (file: File, projectName: string, description?: string) => Promise<string>
  getProject: (id: string) => Project | undefined
  deleteProject: (id: string) => void
  exportProject: (id: string, format: "pdf" | "csv" | "excel") => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

// Mock cost estimation data
const generateMockEstimation = (): CostEstimation => {
  const materials = Math.floor(Math.random() * 50000) + 30000
  const labor = Math.floor(Math.random() * 40000) + 25000
  const permits = Math.floor(Math.random() * 5000) + 2000
  const overhead = Math.floor(Math.random() * 10000) + 5000

  return {
    totalCost: materials + labor + permits + overhead,
    breakdown: { materials, labor, permits, overhead },
    detailedBreakdown: [
      { category: "Foundation", item: "Concrete", quantity: 50, unit: "cubic yards", unitCost: 120, totalCost: 6000 },
      { category: "Framing", item: "Lumber", quantity: 15000, unit: "board feet", unitCost: 2.5, totalCost: 37500 },
      { category: "Roofing", item: "Asphalt Shingles", quantity: 2500, unit: "sq ft", unitCost: 4.5, totalCost: 11250 },
      {
        category: "Electrical",
        item: "Wiring & Fixtures",
        quantity: 1,
        unit: "project",
        unitCost: 12000,
        totalCost: 12000,
      },
      { category: "Plumbing", item: "Pipes & Fixtures", quantity: 1, unit: "project", unitCost: 8500, totalCost: 8500 },
      {
        category: "HVAC",
        item: "System Installation",
        quantity: 1,
        unit: "project",
        unitCost: 15000,
        totalCost: 15000,
      },
    ],
    regionalAdjustment: 1.15,
    confidence: Math.floor(Math.random() * 20) + 80,
  }
}

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

  const uploadFloorplan = useCallback(
    async (file: File, projectName: string, description?: string): Promise<string> => {
      const projectId = Date.now().toString()
      const newProject: Project = {
        id: projectId,
        name: projectName,
        description,
        floorplanUrl: URL.createObjectURL(file),
        status: "uploading",
        progress: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setProjects((prev) => [newProject, ...prev])
      setCurrentProject(newProject)

      // Simulate upload and analysis process
      const stages = [
        { stage: "upload" as const, progress: 25, message: "Uploading floorplan..." },
        { stage: "processing" as const, progress: 50, message: "Processing image..." },
        { stage: "analysis" as const, progress: 75, message: "Analyzing structure..." },
        { stage: "complete" as const, progress: 100, message: "Analysis complete!" },
      ]

      for (const stageData of stages) {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setUploadProgress({
          projectId,
          stage: stageData.stage,
          progress: stageData.progress,
          message: stageData.message,
        })

        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  status: stageData.stage === "complete" ? "completed" : "analyzing",
                  progress: stageData.progress,
                  updatedAt: new Date().toISOString(),
                }
              : p,
          ),
        )
      }

      // Add cost estimation
      const costEstimation = generateMockEstimation()
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, costEstimation, status: "completed" } : p)))

      setUploadProgress(null)
      return projectId
    },
    [],
  )

  const getProject = useCallback(
    (id: string) => {
      return projects.find((p) => p.id === id)
    },
    [projects],
  )

  const deleteProject = useCallback(
    (id: string) => {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (currentProject?.id === id) {
        setCurrentProject(null)
      }
    },
    [currentProject],
  )

  const exportProject = useCallback(
    (id: string, format: "pdf" | "csv" | "excel") => {
      const project = projects.find((p) => p.id === id)
      if (!project || !project.costEstimation) return

      // Mock export functionality
      console.log(`Exporting project ${project.name} as ${format}`)

      // In a real app, this would generate and download the file
      const blob = new Blob(
        [`Project: ${project.name}\nTotal Cost: $${project.costEstimation.totalCost.toLocaleString()}`],
        { type: "text/plain" },
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.name}-estimate.${format === "excel" ? "xlsx" : format}`
      a.click()
      URL.revokeObjectURL(url)
    },
    [projects],
  )

  const value: ProjectContextType = {
    projects,
    currentProject,
    uploadProgress,
    uploadFloorplan,
    getProject,
    deleteProject,
    exportProject,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider")
  }
  return context
}
