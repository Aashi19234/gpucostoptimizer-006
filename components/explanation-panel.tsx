"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

interface ExplanationPanelProps {
  explanation: {
    summary: string
    pros: string[]
    cons: string[]
    tips: string[]
  }
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  return (
    <Card className="bg-gray-50 dark:bg-gray-800 border-0">
      <CardContent className="p-4">
        <p className="text-sm mb-4">{explanation.summary}</p>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Advantages
            </h4>
            <ul className="text-sm space-y-1 pl-6 list-disc">
              {explanation.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
              Limitations
            </h4>
            <ul className="text-sm space-y-1 pl-6 list-disc">
              {explanation.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium flex items-center mb-2">
              <Info className="h-4 w-4 text-blue-500 mr-2" />
              Tips
            </h4>
            <ul className="text-sm space-y-1 pl-6 list-disc">
              {explanation.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
