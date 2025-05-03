import { WorkloadForm } from "@/components/workload-form"
import { RecommendationList } from "@/components/recommendation-list"
import { Toaster } from "@/components/ui/toaster"
import { AiAssistant } from "@/components/ai-assistant"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            GPU Cost Optimizer & Recommender
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the most cost-effective GPU instances for your machine learning workloads
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <WorkloadForm />
          </div>
          <div className="lg:col-span-8">
            <RecommendationList />
          </div>
        </div>
      <AiAssistant />
      <Toaster />
    </div>
    </main>
  );
}
