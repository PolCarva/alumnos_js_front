"use client"

import { redirect } from "next/navigation"
import { useState, useEffect } from "react"
import { getUser } from "@/lib/auth"
import { WeeksList } from "@/components/weeks-list"
import { getWeeks, getUserProgress } from "@/lib/data"
import { fetchUserProgress } from "@/lib/api"
import { UserProgress } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type DashboardClientProps = {}

export function DashboardClient() {
  const user = getUser()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/")
  }

  // Cargar progreso del usuario
  const loadUserProgress = async () => {
    try {
      setLoading(true)
      // Intentar cargar el progreso desde la API
      const progress = await fetchUserProgress(user.id)
      setUserProgress(progress)
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
      setIsRefreshing(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadUserProgress()
  }, [user.id])

  // Obtener la lista de semanas
  const weeks = getWeeks()
  
  // Mostrar estado de carga
  if (loading && !userProgress) {
    return <div className="p-8 text-center">Cargando progreso...</div>
  }

  // Si no hay progreso (algo salió mal), usar datos locales
  const progress = userProgress || getUserProgress(user.id)

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bienvenido, {user.name}</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WeeksList weeks={weeks} userProgress={progress} />
        </div>

        <div>
          <div className="bg-card rounded-lg shadow p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Tu progreso</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Puntos totales</p>
                <p className="text-2xl font-bold text-blue-600">{progress.totalPoints}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Preguntas completadas</p>
                <p className="text-2xl font-bold text-blue-600">{progress.completedQuestions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Semanas completadas</p>
                <p className="text-2xl font-bold text-blue-600">{progress.completedWeeks}</p>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Semanas completadas: {progress.completedWeekIds.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

