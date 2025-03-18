"use client"

import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { QuestionsList } from "@/components/questions-list"
import { getWeekById, getQuestionsForWeek, getUserProgress } from "@/lib/data"

interface WeekClientProps {
  weekId: number
}

export function WeekClient({ weekId }: WeekClientProps) {
  const user = getUser()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/")
  }

  // Move data fetching here from the server component
  const week = getWeekById(weekId)
  if (!week) {
    redirect("/dashboard")
  }

  // Obtener preguntas para la semana
  const questions = getQuestionsForWeek(weekId)
  const userProgress = getUserProgress(user.id)

  // Verificar si la semana está desbloqueada
  const isFirstWeek = week.id === 1
  const isPreviousWeekCompleted = userProgress.completedWeekIds.includes(week.id - 1)

  if (!isFirstWeek && !isPreviousWeekCompleted) {
    redirect("/dashboard")
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Semana {week.id}: {week.title}
        </h1>
        <p className="text-gray-600 mt-2">{week.description}</p>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <QuestionsList questions={questions} weekId={week.id} userId={user.id} userProgress={userProgress} />
      </div>
    </>
  )
}

