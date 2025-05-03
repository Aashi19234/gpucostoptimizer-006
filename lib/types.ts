export interface WorkloadInput {
  modelType: string
  taskType: string
  datasetSize: number
  region: string
  budget: number
  operatingSystem: string
  gpu: boolean
}

export interface GPUPricing {
  onDemand: number | null
  spot: number | null
  monthly: number | null
}

export interface GPURecommendation {
  id: string
  name: string
  provider: string
  gpuType: string
  gpuCount: number
  gpuMemory: number
  vCPUs: number
  ram: number
  pricing: GPUPricing
  matchScore: number
  explanation: {
    summary: string
    pros: string[]
    cons: string[]
    tips: string[]
  }
}