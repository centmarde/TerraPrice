export interface Project {
  id: string
  name: string
  description?: string
  floorplanUrl: string
  status: "uploading" | "analyzing" | "completed" | "error"
  progress: number
  createdAt: string
  updatedAt: string
  costEstimation?: CostEstimation
}

export interface CostEstimation {
  totalCost: number
  breakdown: {
    materials: number
    labor: number
    permits: number
    overhead: number
  }
  detailedBreakdown: CostItem[]
  regionalAdjustment: number
  confidence: number
}

export interface CostItem {
  category: string
  item: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
}

export interface UploadProgress {
  projectId: string
  stage: "upload" | "processing" | "analysis" | "complete"
  progress: number
  message: string
}
