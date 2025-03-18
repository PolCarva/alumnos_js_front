"use client"

import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { WeeksList } from "@/components/weeks-list"
import { getWeeks, getUserProgress } from "@/lib/data"

type DashboardClientProps = {}

export function DashboardClient() {
  const user = getUser()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/")
  }

  // Move data fetching here from the server component
  const weeks = getWeeks()
  const userProgress = getUserProgress(user.id)

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {user.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WeeksList weeks={weeks} userProgress={userProgress} />
        </div>

        <div>
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Tu progreso</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Puntos totales</p>
                <p className="text-2xl font-bold text-blue-600">{userProgress.totalPoints}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Preguntas completadas</p>
                <p className="text-2xl font-bold text-blue-600">{userProgress.completedQuestions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semanas completadas</p>
                <p className="text-2xl font-bold text-blue-600">{userProgress.completedWeeks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

