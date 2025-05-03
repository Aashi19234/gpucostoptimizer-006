"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ExplanationPanel } from "@/components/explanation-panel"
import { CostComparison } from "@/components/cost-comparison"
import type { GPURecommendation } from "@/lib/types"
import { useState } from "react"

interface RecommendationCardProps {
  recommendation: GPURecommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { toast } = useToast()
  const [showExplanation, setShowExplanation] = useState(false)

  const handleRequestPricing = () => {
    toast({
      title: "Request Sent",
      description: `We'll notify you when pricing for ${recommendation.name} becomes available.`,
    })
  }

  return (
    <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold">{recommendation.name}</h3>
              {recommendation.matchScore > 90 && (
                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                  Best Match
                </Badge>
              )}
              {recommendation.matchScore > 75 && recommendation.matchScore <= 90 && (
                <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                  Good Match
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {recommendation.gpuType} • {recommendation.gpuCount} GPU{recommendation.gpuCount > 1 ? "s" : ""} •{" "}
              {recommendation.vCPUs} vCPUs • {recommendation.ram}GB RAM
            </p>
          </div>
          <div className="mt-2 md:mt-0 flex items-center">
            <div className="text-right">
              <div className="text-sm font-medium">Match Score</div>
              <div className="text-2xl font-bold text-primary">{recommendation.matchScore}%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">vCPUs</div>
            <div className="text-xl font-bold">{recommendation.vCPUs}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Memory</div>
            <div className="text-xl font-bold">{recommendation.ram} GB</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">GPU Memory</div>
            <div className="text-xl font-bold">{recommendation.gpuMemory} GB</div>
          </div>
        </div>

        <CostComparison
          onDemandPrice={recommendation.pricing.onDemand}
          spotPrice={recommendation.pricing.spot}
          monthlyPrice={recommendation.pricing.monthly}
        />

        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between">
          <Button variant="outline" onClick={() => setShowExplanation(!showExplanation)}>
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </Button>

          {(!recommendation.pricing.onDemand || !recommendation.pricing.spot) && (
            <Button onClick={handleRequestPricing}>Request Pricing</Button>
          )}
        </div>

        {showExplanation && (
          <div className="mt-4">
            <ExplanationPanel explanation={recommendation.explanation} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
