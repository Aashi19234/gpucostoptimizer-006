"use client"

import { create } from "zustand"
import type { GPURecommendation } from "@/lib/types"

interface RecommendationState {
  recommendations: GPURecommendation[]
  loading: boolean
  setRecommendations: (recommendations: GPURecommendation[]) => void
  setLoading: (loading: boolean) => void
}

export const useRecommendationStore = create<RecommendationState>((set) => ({
  recommendations: [],
  loading: false,
  setRecommendations: (recommendations) => set({ recommendations }),
  setLoading: (loading) => set({ loading }),
}))
