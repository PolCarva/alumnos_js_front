"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { getUser } from "@/lib/auth"
import { WeeksList } from "@/components/weeks-list"
import { getWeeks } from "@/lib/data"
import { fetchUserProgress } from "@/lib/api"
import { UserProgress } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DashboardClient() {
  const router = useRouter()
  const user = getUser()
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const { toast } = useToast()

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [router, user])

  // Obtener la lista de semanas
  const weeks = getWeeks()

  // Cargar datos desde la API
  const loadUserProgress = useCallback(async () => {
    if (!user || hasLoaded && !isRefreshing) return;
    
    setIsRefreshing(true)
    try {
      const progress = await fetchUserProgress(user.id)
      setUserProgress(progress)
      setError(null)
    } catch (err) {
      console.error("Error al cargar el progreso del usuario:", err)
      setError("No se pudieron cargar los datos. Por favor, intente de nuevo.")
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

  // Función para actualizar manualmente
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadUserProgress()
      toast({
        title: "Datos actualizados",
        description: "El progreso se ha actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los datos",
        variant: "destructive"
      })
      console.error("Error al actualizar los datos:", error)
    } finally {
      setIsRefreshing(false)
    }
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
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
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
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <p className="text-yellow-700 dark:text-yellow-300">
          No se pudo cargar el progreso. Por favor, intente actualizar la página.
        </p>
        <Button onClick={handleRefresh} variant="outline" className="mt-2">
          Intentar de nuevo
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Banner para usuario demo */}
      {user?.id === 1 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-md">
          <p className="text-blue-700 dark:text-blue-300 font-medium">
            ¡Bienvenido al modo de prueba! 🚀
          </p>
          <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
            Como usuario demo, tienes acceso a todas las semanas sin restricciones. Puedes responder cualquier pregunta 
            múltiples veces y explorar toda la plataforma libremente. Tu progreso no se guarda permanentemente.
          </p>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de actividades</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WeeksList weeks={weeks} userProgress={userProgress} />
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Tu progreso</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
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
              <div className="text-xs text-gray-500 mt-2">
                <p>Semanas completadas: {userProgress.completedWeekIds.join(', ')}</p>
                <p className="mt-1 italic">Nota: Una semana se considera completada cuando has respondido todas sus preguntas, sin importar si las respuestas fueron correctas o incorrectas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

