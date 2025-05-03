import { NextResponse } from "next/server"
import type { WorkloadInput, GPURecommendation } from "@/lib/types"
import { connectToDatabase } from "@/lib/mongodb"
import { WorkloadInputModel } from "@/lib/models"

// Mock explanations - in a real app, this would be a more sophisticated knowledge base
const explanations = {
  a100: {
    summary: "The NVIDIA A100 is a high-performance GPU designed for AI training and inference workloads.",
    pros: [
      "Excellent for large-scale deep learning training",
      "High memory bandwidth for data-intensive workloads",
      "Good performance-to-cost ratio for production workloads",
    ],
    cons: ["Expensive for small projects or startups", "May be overkill for smaller models or datasets"],
    tips: [
      "Consider using spot instances to reduce costs by up to 70%",
      "Batch your workloads to maximize GPU utilization",
    ],
  },
  v100: {
    summary: "The NVIDIA V100 is a powerful GPU for deep learning and HPC applications.",
    pros: [
      "Good balance of performance and cost",
      "Widely available across cloud providers",
      "Suitable for most deep learning workloads",
    ],
    cons: ["Less memory than newer A100 GPUs", "Lower performance for the latest large language models"],
    tips: [
      "Use mixed precision training to maximize memory efficiency",
      "Good choice for fine-tuning pre-trained models",
    ],
  },
  t4: {
    summary: "The NVIDIA T4 is a cost-effective GPU designed for inference workloads.",
    pros: ["Excellent price-to-performance for inference", "Low power consumption", "Widely available at lower costs"],
    cons: ["Limited performance for training large models", "Less memory than V100 or A100"],
    tips: [
      "Ideal for deploying models in production",
      "Consider using multiple T4s instead of a single more expensive GPU",
    ],
  },
  k80: {
    summary: "The NVIDIA K80 is an older generation GPU still available on some cloud providers.",
    pros: [
      "Very cost-effective",
      "Sufficient for smaller models and datasets",
      "Often available at significant discounts",
    ],
    cons: ["Much lower performance than newer GPUs", "Limited memory and compute capabilities"],
    tips: ["Good for learning and experimentation", "Consider upgrading for production workloads"],
  },
}

export async function POST(request: Request) {
  try {
    const workloadInput: WorkloadInput = await request.json()

    // Optional: Log the workload input to MongoDB
    try {
      await connectToDatabase()
      await WorkloadInputModel.create(workloadInput)
    } catch (dbError) {
      console.error("Error logging workload input to MongoDB:", dbError)
      // Continue execution even if logging fails
    }

    // Fetch GPU pricing data from AceCloud API
    const response = await fetch(
      "https://customer.acecloudhosting.com/api/v1/pricing?is_gpu=true&resource=instances",
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error("Failed to fetch GPU pricing data")
    }

    const data = await response.json()

    // Process and filter the data
    const gpuInstances = data.data.filter((instance: any) => {
      // Filter out instances with missing or zero pricing
      const hasValidPricing = instance.pricing && (instance.pricing.on_demand > 0 || instance.pricing.spot > 0)

      return hasValidPricing
    })

    // Apply heuristics based on user input to recommend suitable GPUs
    const recommendations = applyHeuristics(gpuInstances, workloadInput)

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error processing recommendation request:", error)
    return NextResponse.json({ error: "Failed to process recommendation request" }, { status: 500 })
  }
}

function applyHeuristics(gpuInstances: any[], workloadInput: WorkloadInput): GPURecommendation[] {
  // In a real application, this would be a more sophisticated algorithm
  // For this example, we'll use a simple scoring system

  // Mock GPU data since we don't have real data from the API
  const mockGPUs: GPURecommendation[] = [
    {
      id: "a100-1",
      name: "NVIDIA A100 Instance",
      provider: "AceCloud",
      gpuType: "NVIDIA A100",
      gpuCount: 1,
      gpuMemory: 80,
      vCPUs: 16,
      ram: 128,
      pricing: {
        onDemand: 3.5,
        spot: 1.2,
        monthly: 2520.0,
      },
      matchScore: 95,
      explanation: explanations.a100,
    },
    {
      id: "a100-4",
      name: "NVIDIA A100 4-GPU Instance",
      provider: "AceCloud",
      gpuType: "NVIDIA A100",
      gpuCount: 4,
      gpuMemory: 320,
      vCPUs: 64,
      ram: 512,
      pricing: {
        onDemand: 12.8,
        spot: 4.3,
        monthly: 9216.0,
      },
      matchScore: 88,
      explanation: explanations.a100,
    },
    {
      id: "v100-1",
      name: "NVIDIA V100 Instance",
      provider: "AceCloud",
      gpuType: "NVIDIA V100",
      gpuCount: 1,
      gpuMemory: 32,
      vCPUs: 8,
      ram: 64,
      pricing: {
        onDemand: 2.1,
        spot: 0.7,
        monthly: 1512.0,
      },
      matchScore: 82,
      explanation: explanations.v100,
    },
    {
      id: "t4-1",
      name: "NVIDIA T4 Instance",
      provider: "AceCloud",
      gpuType: "NVIDIA T4",
      gpuCount: 1,
      gpuMemory: 16,
      vCPUs: 4,
      ram: 32,
      pricing: {
        onDemand: 0.9,
        spot: 0.3,
        monthly: 648.0,
      },
      matchScore: 75,
      explanation: explanations.t4,
    },
    {
      id: "k80-1",
      name: "NVIDIA K80 Instance",
      provider: "AceCloud",
      gpuType: "NVIDIA K80",
      gpuCount: 1,
      gpuMemory: 12,
      vCPUs: 4,
      ram: 16,
      pricing: {
        onDemand: 0.45,
        spot: 0.15,
        monthly: 324.0,
      },
      matchScore: 60,
      explanation: explanations.k80,
    },
  ]

  // Filter based on budget
  const filteredGPUs = mockGPUs.filter((gpu) => {
    if (gpu.pricing.monthly) {
      return gpu.pricing.monthly <= workloadInput.budget
    }
    return false
  })

  // Apply additional filtering based on workload requirements
  const recommendedGPUs = [...mockGPUs]

  // Sort by match score
  recommendedGPUs.sort((a, b) => b.matchScore - a.matchScore)

  // Limit to top 5 recommendations
  return recommendedGPUs.slice(0, 5)
}
