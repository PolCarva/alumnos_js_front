"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { QuestionsList } from "@/components/questions-list"
import { getWeekById, getQuestionsForWeek } from "@/lib/data"
import { fetchUserProgress } from "@/lib/api"
import { UserProgress } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface WeekClientProps {
  weekId: number
}

export function WeekClient({ weekId }: WeekClientProps) {
  const router = useRouter()
  const user = getUser()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const { toast } = useToast()

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [router, user])

  // Cargar datos del usuario
  const loadUserProgress = useCallback(async () => {
    if (!user || (hasLoaded && !isRefreshing)) return
    
    try {
      setLoading(true)
      // Intentar cargar el progreso del usuario desde la API
      const progress = await fetchUserProgress(user.id)
      setUserProgress(progress)
      setError(null)
    } catch (err) {
      console.error("Error obteniendo progreso del usuario:", err)
      setError("Error al cargar el progreso. Por favor intente de nuevo.")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
      setHasLoaded(true)
    }
  }, [user, hasLoaded, isRefreshing])

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user && !hasLoaded) {
      loadUserProgress()
    }
  }, [user, loadUserProgress, hasLoaded])

  // Función para actualizar manualmente el progreso
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadUserProgress()
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
    } finally {
      setIsRefreshing(false)
    }
  }

  // Obtener datos de la semana y preguntas
  const week = getWeekById(weekId)
  const questions = getQuestionsForWeek(weekId)

  if (!week) {
    return <div className="p-8">Semana no encontrada.</div>
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
      </div>
    )
  }

  // Si hay un error, mostrar mensaje
  if (error) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mb-6">
        <p className="text-yellow-700 dark:text-yellow-300">{error}</p>
        <Button onClick={handleRefresh} variant="outline" className="mt-2">
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  // Si no hay progreso, mostrar un mensaje
  if (!userProgress) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mb-6">
        <p className="text-yellow-700 dark:text-yellow-300">
          No se pudo cargar el progreso. Por favor, intente actualizar.
        </p>
        <Button onClick={handleRefresh} variant="outline" className="mt-2">
          Actualizar
        </Button>
      </div>
    )
  }

  // Verificar que el usuario exista antes de continuar
  if (!user) {
    return null; // Esto no debería ocurrir, pero TypeScript lo necesita
  }

  // Refrescar el progreso después de completar una pregunta
  const onQuestionComplete = async () => {
    setIsRefreshing(true)
    try {
      const progress = await fetchUserProgress(user.id)
      setUserProgress(progress)
    } catch (error) {
      console.error("Error actualizando progreso:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" /> Volver al dashboard
          </Button>
          <h1 className="text-3xl font-bold">{week.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{week.description}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="self-start md:self-auto flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Actualizando..." : "Actualizar progreso"}
        </Button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Temas de la semana</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 mb-6">
          {week.topics.map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Preguntas</h2>
        <div className="bg-card p-6 rounded-lg border border-border">
          <QuestionsList
            questions={questions}
            weekId={weekId}
            userId={user.id}
            userProgress={userProgress}
            onQuestionComplete={onQuestionComplete}
          />
        </div>
      </div>
    </div>
  )
}

