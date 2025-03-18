import { DashboardHeader } from "@/components/dashboard-header"
import { LeaderboardClient } from "@/components/leaderboard-client"

export default function LeaderboardPage() {
  // Remove data fetching code - this will happen in the client component
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <LeaderboardClient />
      </main>
    </div>
  )
}

