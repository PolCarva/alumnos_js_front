"use client"

import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrophyIcon, MedalIcon, AwardIcon } from "lucide-react"
import { getAllUsersProgress } from "@/lib/data"

type LeaderboardClientProps = {}

export function LeaderboardClient() {
  const user = getUser()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/")
  }

  // Move data fetching here from the server component
  const usersProgress = getAllUsersProgress()

  // Ordenar por puntos (de mayor a menor)
  const sortedUsers = [...usersProgress].sort((a, b) => b.totalPoints - a.totalPoints)

  // Encontrar la posición del usuario actual
  const currentUserRank = sortedUsers.findIndex((u) => u.userId === user.id) + 1

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>

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
        <CardHeader>
          <CardTitle>Clasificación completa</CardTitle>
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
                {sortedUsers.map((userProgress, index) => (
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

