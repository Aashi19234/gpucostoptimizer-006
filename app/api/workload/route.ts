import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { WorkloadInputModel } from "@/lib/models"

export async function POST(request: Request) {
  try {
    const workloadInput = await request.json()

    await connectToDatabase()
    const savedWorkload = await WorkloadInputModel.create(workloadInput)

    return NextResponse.json({
      success: true,
      workloadId: savedWorkload._id,
    })
  } catch (error) {
    console.error("Error saving workload input:", error)
    return NextResponse.json({ error: "Failed to save workload input" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    const workloads = await WorkloadInputModel.find().sort({ createdAt: -1 }).limit(10)

    return NextResponse.json({ workloads })
  } catch (error) {
    console.error("Error fetching workload inputs:", error)
    return NextResponse.json({ error: "Failed to fetch workload inputs" }, { status: 500 })
  }
}
