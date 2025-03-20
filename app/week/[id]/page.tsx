"use client"

import { getWeekById, getQuestionsForWeek, getUserProgress } from "@/lib/data"
import { QuestionsList } from "@/components/questions-list"
import { getUser } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import React from "react"
import Link from "next/link"

interface WeekPageProps {
  params: Promise<{
    id: string
  }>
}


export default function WeekPage({ params }: WeekPageProps) {
  // Desenvolver los parámetros usando React.use()
  const unwrappedParams = React.use(params);
  const weekId = Number.parseInt(unwrappedParams.id);
  
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  const [week, setWeek] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [userProgress, setUserProgress] = useState<any>(null)
  
  useEffect(() => {
    // Obtener información del usuario autenticado
    const user = getUser()
    
    // Si no hay usuario autenticado, redirigir al inicio
    if (!user) {
      router.push("/")
      return
    }
    
    // Obtener información de la semana
    const weekData = getWeekById(weekId)
    
    // Si la semana no existe, redirigir a dashboard
    if (!weekData) {
      router.push("/dashboard")
      return
    }
    
    // Obtener preguntas para la semana
    const questionsData = getQuestionsForWeek(weekId)
    
    // Obtener progreso del usuario
    const userProgressData = getUserProgress(user.id)

    setWeek(weekData)
    setQuestions(questionsData)
    setUserProgress(userProgressData)
    setIsLoading(false)
  }, [weekId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-5 mx-auto pt-4">
        <Link 
          href="/dashboard" 
          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Volver al dashboard
        </Link>
      </div>
      <div className="container py-4 mx-auto md:py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Semana {week.id}: {week.title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {week.description}
        </p>

        <QuestionsList 
          questions={questions} 
          weekId={weekId} 
          userId={getUser()?.id || 0} 
          userProgress={userProgress}
        />
      </div>
    </div>
  )
}
