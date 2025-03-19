"use client"

import { redirect, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getUser } from "@/lib/auth"
import { QuestionsList } from "@/components/questions-list"
import { getWeekById, getQuestionsForWeek, getUserProgress } from "@/lib/data"
import { fetchUserProgress } from "@/lib/api"
import { UserProgress } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface WeekClientProps {
  weekId: number
}

export function WeekClient({ weekId }: WeekClientProps) {
  const user = getUser()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDebouncingUpdate, setIsDebouncingUpdate] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/")
  }

  // Cargar datos al montar el componente
  const loadData = async () => {
    try {
      setLoading(true)
      // Intentar cargar el progreso del usuario desde la API
      const progress = await fetchUserProgress(user.id)
      setUserProgress(progress)
      setError(null)
    } catch (err) {
      console.error("Error al cargar el progreso del usuario:", err)
      // Fallback a datos locales
      const localProgress = getUserProgress(user.id)
      setUserProgress(localProgress)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  // Actualizar manualmente el progreso
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadData()
      toast({
        title: "Progreso actualizado",
        description: "Tu progreso se ha actualizado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso.",
        variant: "destructive",
      })
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user.id])

  // Actualizar el progreso después de completar una pregunta
  // pero con un retraso para evitar actualizaciones frecuentes
  const onQuestionComplete = async () => {
    if (isDebouncingUpdate) return Promise.resolve(); // Evitar múltiples actualizaciones rápidas
    
    setIsDebouncingUpdate(true);
    
    // Actualizar en segundo plano con un retraso
    setTimeout(async () => {
      try {
        const progress = await fetchUserProgress(user.id);
        setUserProgress(progress);
      } catch (error) {
        console.error("Error al actualizar el progreso:", error);
      } finally {
        setIsDebouncingUpdate(false);
      }
    }, 1000);
    
    return Promise.resolve(); // Devolver promesa que se resuelve inmediatamente
  }

  // Obtener datos del cliente
  const week = getWeekById(weekId)
  if (!week) {
    redirect("/dashboard")
  }

  // Obtener preguntas para la semana
  const questions = getQuestionsForWeek(weekId)
  
  // Mostrar estado de carga
  if (loading) {
    return <div className="p-8 text-center">Cargando datos...</div>
  }

  // Si no hay progreso del usuario (algo salió mal), usar datos locales
  const progress = userProgress || getUserProgress(user.id)

  // Verificar si la semana está desbloqueada
  const isFirstWeek = week.id === 1
  const isPreviousWeekCompleted = progress.completedWeekIds.includes(week.id - 1)

  if (!isFirstWeek && !isPreviousWeekCompleted) {
    redirect("/dashboard")
  }

  // Determinar si la semana actual está completada
  const isCurrentWeekCompleted = progress.completedWeekIds.includes(week.id)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => router.push("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              Semana {week.id}: {week.title}
            </h1>
            <p className="text-gray-600 mt-2">{week.description}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Actualizando...' : 'Actualizar progreso'}
        </Button>
      </div>

      {isCurrentWeekCompleted && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <p className="font-medium">¡Felicidades! Has completado esta semana.</p>
          <p className="text-sm">Puedes seguir practicando o avanzar a la siguiente semana.</p>
        </div>
      )}

      <div className="bg-card rounded-lg shadow p-6">
        <QuestionsList 
          questions={questions} 
          weekId={week.id} 
          userId={user.id} 
          userProgress={progress} 
          onQuestionComplete={onQuestionComplete}
        />
      </div>
    </>
  )
}

