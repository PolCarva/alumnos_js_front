"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logoutUser, getUser } from "@/lib/auth"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardHeader() {
  const router = useRouter()
  const user = getUser()

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Alumnos.js
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Inicio
          </Link>
          <Link
            href="/leaderboard"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          >
            Leaderboard
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}

