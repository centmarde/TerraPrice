export interface ReportTemplate {
  id: string
  name: string
  description: string
  sections: ReportSection[]
  createdAt: Date
  updatedAt: Date
}

export interface ReportSection {
  id: string
  title: string
  type: "summary" | "cost_breakdown" | "materials" | "labor" | "timeline" | "charts"
  content: any
  order: number
}

export interface GeneratedReport {
  id: string
  projectId: string
  templateId: string
  title: string
  generatedAt: Date
  data: any
  format: "pdf" | "excel" | "csv"
}

export interface ReportFilters {
  dateRange: {
    start: Date
    end: Date
  }
  projectTypes: string[]
  costRange: {
    min: number
    max: number
  }
  regions: string[]
}
