import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

// System prompt to guide the AI assistant's behavior
const SYSTEM_PROMPT = `You are a GPU recommendation assistant for machine learning workloads.
Your goal is to help users understand which GPU instances are best for their specific needs.

Here's some information about common GPU types:
- NVIDIA A100: High-end GPU with 80GB memory, ideal for large language models and extensive training workloads
- NVIDIA V100: Powerful GPU with 32GB memory, good for most deep learning tasks
- NVIDIA T4: Cost-effective GPU with 16GB memory, excellent for inference and smaller training jobs
- NVIDIA K80: Older generation GPU with 12GB memory, budget option for experimentation

When responding:
- Be concise and informative
- Provide specific recommendations when possible
- Explain trade-offs between different options
- Consider cost-effectiveness based on the user's needs
- Suggest ways to optimize GPU usage and reduce costs
`

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = await generateText({
      model: openai("gpt-4o"),
      system: SYSTEM_PROMPT,
      prompt: message,
    })

    return NextResponse.json({ response: response.text })
  } catch (error) {
    console.error("Error in AI assistant:", error)
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 })
  }
}
