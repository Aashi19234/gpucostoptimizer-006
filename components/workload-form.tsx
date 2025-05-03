"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useRecommendationStore } from "@/lib/store"

export function WorkloadForm() {
  const { toast } = useToast()
  const { setRecommendations, setLoading } = useRecommendationStore()

  const [formData, setFormData] = useState({
    modelType: "",
    taskType: "training",
    datasetSize: 50,
    region: "us-east",
    budget: 500,
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await response.json()
      setRecommendations(data.recommendations)

      toast({
        title: "Recommendations Ready",
        description: `Found ${data.recommendations.length} suitable GPU instances for your workload.`,
      })
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      toast({
        title: "Error",
        description: "Failed to fetch recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Workload Parameters</CardTitle>
        <CardDescription>Provide details about your GPU workload to get tailored recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="modelType">Model Type</Label>
            <Select value={formData.modelType} onValueChange={(value) => handleChange("modelType", value)} required>
              <SelectTrigger id="modelType">
                <SelectValue placeholder="Select model type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="llm">Large Language Model (LLM)</SelectItem>
                <SelectItem value="vision">Computer Vision</SelectItem>
                <SelectItem value="nlp">Natural Language Processing</SelectItem>
                <SelectItem value="rl">Reinforcement Learning</SelectItem>
                <SelectItem value="gan">Generative Models (GAN)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taskType">Task Type</Label>
            <Select value={formData.taskType} onValueChange={(value) => handleChange("taskType", value)} required>
              <SelectTrigger id="taskType">
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="inference">Inference</SelectItem>
                <SelectItem value="finetuning">Fine-tuning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="datasetSize">Dataset Size (GB)</Label>
              <span className="text-sm text-gray-500">{formData.datasetSize} GB</span>
            </div>
            <Slider
              id="datasetSize"
              min={1}
              max={1000}
              step={1}
              value={[formData.datasetSize]}
              onValueChange={(value) => handleChange("datasetSize", value[0])}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={formData.region} onValueChange={(value) => handleChange("region", value)} required>
              <SelectTrigger id="region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east">US East</SelectItem>
                <SelectItem value="us-west">US West</SelectItem>
                <SelectItem value="eu-central">EU Central</SelectItem>
                <SelectItem value="ap-southeast">Asia Pacific</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="budget">Monthly Budget ($)</Label>
              <span className="text-sm text-gray-500">${formData.budget}</span>
            </div>
            <Slider
              id="budget"
              min={100}
              max={5000}
              step={50}
              value={[formData.budget]}
              onValueChange={(value) => handleChange("budget", value[0])}
              className="py-4"
            />
          </div>

          <Button type="submit" className="w-full">
            Get Recommendations
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
