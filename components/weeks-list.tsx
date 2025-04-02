"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LockIcon, UnlockIcon, CheckIcon, ClockIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Week, UserProgress } from "@/lib/types"
import { getQuestionsForWeek } from "@/lib/data"

interface WeeksListProps {
  weeks: Week[]
  userProgress: UserProgress
}

export function WeeksList({ weeks, userProgress }: WeeksListProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null)

  const toggleExpand = (weekId: number) => {
    setExpandedWeek(expandedWeek === weekId ? null : weekId)
  }

  const isWeekUnlocked = (weekId: number) => {
    // El usuario demo siempre tiene todas las semanas desbloqueadas
    if (userProgress.userId === 1) return true
    
    // La primera semana siempre está desbloqueada
    if (weekId === 1) return true

    // Obtener la semana actual
    const week = weeks.find(w => w.id === weekId)
    if (!week) return false

    // Verificar si la fecha actual es posterior a la fecha de desbloqueo
    const now = new Date()
    const unlockDate = new Date(week.unlockDate)
    
    // Una semana se desbloquea si la fecha actual es posterior a la fecha de desbloqueo
    return now >= unlockDate
  }

  const getWeekProgress = (weekId: number) => {
    // Obtener todas las preguntas para esta semana
    const allQuestionsForWeek = getQuestionsForWeek(weekId)
    if (!allQuestionsForWeek.length) return 0
    
    // Obtener el progreso del usuario para esta semana
    const userQuestionsProgress = userProgress.questionProgress.filter(
      (q) => q.weekId === weekId && (q.completed || q.failed)
    )
    
    // Calcular el porcentaje basado en el número total de preguntas respondidas vs total de preguntas
    return Math.round((userQuestionsProgress.length / allQuestionsForWeek.length) * 100)
  }

  const getUnlockDate = (week: Week) => {
    const date = new Date(week.unlockDate)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Semanas de aprendizaje</h2>

      {weeks.map((week) => {
        const isUnlocked = isWeekUnlocked(week.id)
        const isCompleted = userProgress.completedWeekIds.includes(week.id)
        const progress = getWeekProgress(week.id)
        const unlockDate = getUnlockDate(week.id)
        const isTestUser = userProgress.userId === 99

        return (
          <Card key={week.id} className={`transition-all ${isUnlocked ? "opacity-100" : "opacity-70"}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  Semana {week.id}: {week.title}
                  {isCompleted && <CheckIcon className="h-5 w-5 text-green-500" />}
                </CardTitle>
                {isUnlocked ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <UnlockIcon className="h-3 w-3 mr-1" /> Desbloqueado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <LockIcon className="h-3 w-3 mr-1" /> Bloqueado
                  </Badge>
                )}
              </div>
              <CardDescription>{week.description}</CardDescription>
              {!isUnlocked && (
                <p className="text-sm text-gray-500 mt-2">
                  Se desbloqueará el {getUnlockDate(week)}
                </p>
              )}
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Progress value={progress} className="h-2" />
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>

              {expandedWeek === week.id && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium">Temas de la semana:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {week.topics.map((topic, index) => (
                      <li key={index}>{topic.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => toggleExpand(week.id)}>
                {expandedWeek === week.id ? "Menos detalles" : "Más detalles"}
              </Button>

              {isUnlocked && (
                <Link href={`/week/${week.id}`}>
                  <Button size="sm">{isCompleted ? "Repasar" : "Comenzar"}</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}