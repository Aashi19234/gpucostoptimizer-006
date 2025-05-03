"use client"

import { RecommendationCard } from "@/components/recommendation-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRecommendationStore } from "@/lib/store"
import { Skeleton } from "@/components/ui/skeleton"

export function RecommendationList() {
  const { recommendations, loading } = useRecommendationStore()

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>GPU Recommendations</CardTitle>
          <CardDescription>Finding the best GPU instances for your workload...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex justify-between mb-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-8 w-1/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>GPU Recommendations</CardTitle>
          <CardDescription>Submit your workload parameters to get tailored GPU recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">No recommendations yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Fill out the form on the left to get personalized GPU recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>GPU Recommendations</CardTitle>
        <CardDescription>{recommendations.length} GPU instances recommended based on your workload</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} recommendation={recommendation} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
