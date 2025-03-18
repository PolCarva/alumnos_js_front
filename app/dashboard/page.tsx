import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardClient } from "@/components/dashboard-client"

export default function DashboardPage() {
  // Remove data fetching code - this will happen in the client component
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <DashboardClient />
      </main>
    </div>
  )
}

