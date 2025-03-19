"use client"

import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { getUser } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrophyIcon, MedalIcon, AwardIcon, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import type { UserProgress } from "@/lib/types"
import { fetchLeaderboard } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"


export function LeaderboardClient() {
  const user = getUser()
  const [usersProgress, setUsersProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const { toast } = useToast()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/")
  }

  // Función para cargar los datos del leaderboard
  const loadLeaderboardData = async () => {
    try {
      setLoading(true)
      const data = await fetchLeaderboard()
      setUsersProgress(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error("Error fetching leaderboard data:", err)
      setError("No se pudieron cargar los datos del leaderboard. Intentando usar datos locales...")
      
      // Fallback a datos locales si hay un error
      import("@/lib/data").then(module => {
        const localData = module.getAllUsersProgress()
        setUsersProgress(localData)
        setError(null)
      }).catch(e => {
        console.error("Error loading local data:", e)
        setError("No se pudieron cargar los datos del leaderboard")
      })
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    loadLeaderboardData()
  }, [])

  // Función para actualizar manualmente los datos
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadLeaderboardData()
      toast({
        title: "Datos actualizados",
        description: "El leaderboard se ha actualizado correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar los datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron actualizar los datos.",
        variant: "destructive",
      })
    }
  }

  // Ordenar por puntos (de mayor a menor)
  const sortedUsers = [...usersProgress].filter(user => user.userId !== 1).sort((a, b) => b.totalPoints - a.totalPoints)

  // Encontrar la posición del usuario actual
  const currentUserRank = sortedUsers.findIndex((u) => u.userId === user.id) + 1

  if (loading && !isRefreshing) {
    return <div className="p-8 text-center">Cargando leaderboard...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  // Formatear la fecha de última actualización
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(lastUpdated)

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Última actualización: {formattedDate}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sortedUsers.slice(0, 3).map((userProgress, index) => {
          const medalColors = [
            "bg-yellow-100 text-yellow-800 border-yellow-300",
            "bg-gray-100 text-gray-800 border-gray-300",
            "bg-amber-100 text-amber-800 border-amber-300",
          ]
          const icons = [
            <TrophyIcon key="trophy" className="h-6 w-6 text-yellow-500" />,
            <MedalIcon key="medal" className="h-6 w-6 text-gray-500" />,
            <AwardIcon key="award" className="h-6 w-6 text-amber-500" />,
          ]

          return (
            <Card
              key={userProgress.userId}
              className={`border-2 ${index === 0 ? "border-yellow-300" : index === 1 ? "border-gray-300" : "border-amber-300"}`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <Badge className={`${medalColors[index]} px-3 py-1`}>
                    {icons[index]} {index === 0 ? "1er" : index === 1 ? "2do" : "3er"} Lugar
                  </Badge>
                  <span className="text-2xl font-bold text-blue-600">{userProgress.totalPoints} pts</span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {userProgress.userName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{userProgress.userName}</p>
                    <p className="text-sm text-gray-500">{userProgress.completedQuestions} preguntas completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Clasificación completa</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1"
          >
            {showAll ? (
              <>Mostrar menos <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Mostrar todos <ChevronDown className="h-4 w-4" /></>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Posición</th>
                  <th className="px-4 py-3 text-left">Usuario</th>
                  <th className="px-4 py-3 text-right">Preguntas</th>
                  <th className="px-4 py-3 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody>
                {(showAll ? sortedUsers : sortedUsers.slice(0, 10)).map((userProgress, index) => (
                  <tr
                    key={userProgress.userId}
                    className={`border-b ${userProgress.userId === user.id ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {userProgress.userName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {userProgress.userName}
                      {userProgress.userId === user.id && (
                        <Badge variant="outline" className="ml-2">
                          Tú
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">{userProgress.completedQuestions}</td>
                    <td className="px-4 py-3 text-right font-bold">{userProgress.totalPoints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {currentUserRank > 3 && (
        <div className="mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-2 py-1">
                    Tu posición: {currentUserRank}
                  </Badge>
                  <span className="font-medium">{user.name}</span>
                </div>
                <span className="font-bold text-blue-600">
                  {sortedUsers.find((u) => u.userId === user.id)?.totalPoints || 0} pts
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
