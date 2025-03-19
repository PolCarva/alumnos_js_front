import { DashboardHeader } from "@/components/dashboard-header"
import { WeekClient } from "@/components/week-client"

interface WeekPageProps {
  params: {
    id: string
  }
}

export default async function WeekPage({ params }: WeekPageProps) {
  const parameters = await params
  const weekId = Number.parseInt(parameters.id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto py-8 px-4">
        <WeekClient weekId={weekId} />
      </main>
    </div>
  )
}

