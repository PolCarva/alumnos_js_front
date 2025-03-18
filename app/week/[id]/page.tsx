import { DashboardHeader } from "@/components/dashboard-header"
import { WeekClient } from "@/components/week-client"

interface WeekPageProps {
  params: {
    id: string
  }
}

export default function WeekPage({ params }: WeekPageProps) {
  const weekId = Number.parseInt(params.id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <WeekClient weekId={weekId} />
      </main>
    </div>
  )
}

