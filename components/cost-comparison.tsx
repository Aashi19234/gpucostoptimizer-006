"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown } from "lucide-react"

interface CostComparisonProps {
  onDemandPrice: number | null
  spotPrice: number | null
  monthlyPrice: number | null
}

export function CostComparison({ onDemandPrice, spotPrice, monthlyPrice }: CostComparisonProps) {
  const savings = onDemandPrice && spotPrice ? ((onDemandPrice - spotPrice) / onDemandPrice) * 100 : null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gray-50 dark:bg-gray-800 border-0">
        <CardContent className="p-4 text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">On-Demand</h4>
          {onDemandPrice ? (
            <p className="text-xl font-bold">${onDemandPrice.toFixed(2)}/hr</p>
          ) : (
            <p className="text-xl font-bold text-gray-400">Not Available</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-50 dark:bg-gray-800 border-0">
        <CardContent className="p-4 text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Spot Price</h4>
          <div className="flex flex-col items-center">
            {spotPrice ? (
              <>
                <p className="text-xl font-bold text-green-600 dark:text-green-500">${spotPrice.toFixed(2)}/hr</p>
                {savings && (
                  <div className="flex items-center text-xs text-green-600 dark:text-green-500 mt-1">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    {savings.toFixed(0)}% savings
                  </div>
                )}
              </>
            ) : (
              <p className="text-xl font-bold text-gray-400">Not Available</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50 dark:bg-gray-800 border-0">
        <CardContent className="p-4 text-center">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Monthly Est.</h4>
          {monthlyPrice ? (
            <p className="text-xl font-bold">${monthlyPrice.toFixed(2)}</p>
          ) : (
            <p className="text-xl font-bold text-gray-400">Not Available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
