"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { logoutUser, getUser } from "@/lib/auth"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export function DashboardHeader() {
  const router = useRouter()
  const user = getUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logoutUser()
    router.push("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Alumnos.js
        </Link>

        {/* Menú para escritorio */}
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
          <Button variant="outline" onClick={handleLogout} className="hidden md:flex">
            Cerrar sesión
          </Button>
          
          {/* Botón de menú hamburguesa para móvil */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 py-4 px-4 border-t">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Button variant="outline" onClick={handleLogout} className="w-full mt-2">
              Cerrar sesión
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
