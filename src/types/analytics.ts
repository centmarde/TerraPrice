export interface ProjectAnalytics {
  totalProjects: number
  completedProjects: number
  averageCostEstimation: number
  popularFloorplanTypes: FloorplanTypeData[]
  monthlyProjectTrends: MonthlyTrendData[]
  costDistribution: CostDistributionData[]
  regionalBreakdown: RegionalData[]
}

export interface FloorplanTypeData {
  type: string
  count: number
  percentage: number
  averageCost: number
}

export interface MonthlyTrendData {
  month: string
  projects: number
  revenue: number
  users: number
}

export interface CostDistributionData {
  range: string
  count: number
  percentage: number
}

export interface RegionalData {
  region: string
  projects: number
  averageCost: number
  adjustment: number
}

export interface SystemSettings {
  fileUpload: {
    maxFileSize: number
    allowedFormats: string[]
    maxFilesPerUser: number
  }
  apiLimits: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    maintenanceAlerts: boolean
  }
  maintenance: {
    maintenanceMode: boolean
    maintenanceMessage: string
    scheduledMaintenance: string
  }
}

export interface CostParameters {
  materials: MaterialCost[]
  laborRates: LaborRate[]
  regionalAdjustments: RegionalAdjustment[]
  overheadPercentage: number
  profitMargin: number
}

export interface MaterialCost {
  id: string
  category: string
  item: string
  unitCost: number
  unit: string
  lastUpdated: string
}

export interface LaborRate {
  id: string
  trade: string
  hourlyRate: number
  region: string
  lastUpdated: string
}

export interface RegionalAdjustment {
  id: string
  region: string
  adjustment: number
  description: string
}
